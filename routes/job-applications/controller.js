const { verifyToken } = require("../../authentication/token");
const Job = require("../../db/models/job");
const JobApplication = require("../../db/models/jobApplication");
const User = require("../../db/models/user");
const { getIO } = require("../../socket");

const jobApplicationController = {
  addJobApplication: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      if (!req.body.jobId) {
        res.status(400).json({
          success: false,
          message: "job not found",
        });
      }
      const job = await Job.findOne({
        _id: req.body.jobId,
      });
      if (!job) {
        res.status(400).json({
          success: false,
          message: "job not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const newJobApplication = new JobApplication({
        applicantName: req.body.applicantName,
        applicantEmail: req.body.applicantEmail,
        applicationDate: req.body.applicationDate || null,
        jobId: req.body.jobId,
        userId,
      });

      const employer = await User.findById(job.userId);

      newJobApplication.applicantCV = {
        filename: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      console.log(newJobApplication);

      // Save the new user record to the database
      await newJobApplication.save();

      console.log("Job application record added to database");
      // send notification to employer
      let dataCopy = employer.data || {};
      let notificationsCopy = dataCopy.notifications
        ? [...dataCopy.notifications]
        : [];
      notificationsCopy.push({
        type: "job-application",
        applicantId: userId,
        jobId: req.body.jobId,
        createdAt: Date.now(),
        isRead: false,
      });
      dataCopy.notifications = [...notificationsCopy];
      await User.findOneAndUpdate({ _id: job.userId }, { data: dataCopy });
      const io = getIO();
      io.to(`${job.userId}-room`).emit("fetch-notifications", {});

      res.status(200).json({
        message: "Job application added successfully",
        success: true,
      });
    } catch (error) {
      console.log("Error while adding job application", error);
    }
  },
  getJobApplicationsByUser: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const jobApplications = await JobApplication.find({
        userId,
      });

      console.log(jobApplications);

      res.status(200).json({
        success: true,
        jobApplications,
      });
    } catch (error) {
      console.log("Error while getting job applications by user", error);
    }
  },
  getJobApplicationsByJobIds: async (req, res) => {
    try {
      const jobIds = req.params.jobIds.split(",");
      const jobApplications = await JobApplication.find({
        jobId: { $in: jobIds },
      });

      console.log(jobApplications);

      res.status(200).json({
        success: true,
        jobApplications,
      });
    } catch (error) {
      console.log("Error while getting job applications by job ids", error);
    }
  },
};

module.exports = jobApplicationController;
