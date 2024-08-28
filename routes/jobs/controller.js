const { verifyToken } = require("../../authentication/token");
const Job = require("../../db/models/job");
const JobApplication = require("../../db/models/jobApplication");
const User = require("../../db/models/user");

const jobController = {
  addJob: async (req, res) => {
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
      const newJob = new Job({
        title: req.body.title,
        type: req.body.type,
        category: req.body.category,
        location: req.body.location,
        salary: req.body.salary,
        tags: req.body.tags,
        description: req.body.description,
        userId,
        createdAt: Date.now(),
      });

      console.log(newJob);

      // Save the new user record to the database
      newJob
        .save()
        .then(() => {
          console.log("Job record added to database");
          res.status(200).json({
            message: "Job added successfully",
            success: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Server Error");
        });
    } catch (error) {
      console.log("Error while signing in", error);
    }
  },
  getJobs: async (req, res) => {
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
      const jobs = await Job.find({
        userId,
      });

      console.log(jobs);

      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.log("Error while getting jobs", error);
    }
  },
  getAllJobs: async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.log("Error while getting jobs", error);
    }
  },
  removeJob: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const jobId = req.params.id;
      console.log("hheheeh", jobId);
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
      const job = await Job.findOneAndDelete({
        _id: jobId,
      });
      if (job) {
        await JobApplication.deleteMany({ jobId });
        res.status(200).json({
          success: true,
          message: "Job has been removed successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Job not found",
        });
      }
      console.log("tttt", job);
    } catch (error) {
      console.log("Error while removing job", error);
    }
  },
  updateJob: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const jobId = req.params.id;
      const updateData = req.body;
      console.log("hheheeh", jobId);
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
      const job = await Job.findOneAndUpdate(updateData);
      console.log(job);
      if (job) {
        res.status(200).json({
          success: true,
          message: "Job has been updated successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Job not found",
        });
      }
    } catch (error) {
      console.log("Error while updating job", error);
    }
  },
};

module.exports = jobController;
