const { verifyToken } = require("../../authentication/token");
const Bid = require("../../db/models/bid");
const Task = require("../../db/models/task");
const User = require("../../db/models/user");
const { getIO } = require("../../socket");

const taskController = {
  addTask: async (req, res) => {
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
      const newTask = new Task({
        title: req.body.title,
        type: req.body.type,
        category: req.body.category,
        location: req.body.location,
        budget: req.body.budget,
        requiredSkills: req.body.requiredSkills,
        description: req.body.description,
        userId,
        acceptedBid: null,
        status: "new",
        createdAt: Date.now(),
      });

      console.log(newTask);

      // Save the new user record to the database
      newTask
        .save()
        .then(() => {
          console.log("Task record added to database");
          res.status(200).json({
            message: "Task added successfully",
            success: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Server Error");
        });
    } catch (error) {
      console.log("Error while adding task", error);
    }
  },
  getTasks: async (req, res) => {
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
      const tasks = await Task.find({
        userId,
      });

      console.log(tasks);

      res.status(200).json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.log("Error while getting tasks", error);
    }
  },
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find();

      console.log(tasks);

      res.status(200).json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.log("Error while getting tasks", error);
    }
  },
  removeTask: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const taskId = req.params.id;
      console.log("hheheeh", taskId);
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
      const task = await Task.findOneAndDelete({
        _id: taskId,
      });
      if (task) {
        // remove corresponding bids as well
        await Bid.deleteMany({ taskId });
        res.status(200).json({
          success: true,
          message: "Task has been removed successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Task not found",
        });
      }
      console.log("tttt", Task);
    } catch (error) {
      console.log("Error while removing task", error);
    }
  },
  updateTask: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const taskId = req.params.id;
      const updateData = req.body;
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
      if (updateData?.review) {
        updateData.review.createdAt = Date.now();
      }
      const task = await Task.findOneAndUpdate({ _id: taskId }, updateData, {
        new: true, // This option returns the updated document
        useFindAndModify: false, // This option is needed to avoid deprecation warnings
      });
      console.log(task);
      if (task) {
        if (updateData?.acceptedBid) {
          const bid = await Bid.findById(updateData?.acceptedBid);
          if (bid) {
            const employer = await User.findById(bid.userId);
            // send notification to employer
            let dataCopy = employer.data || {};
            let notificationsCopy = dataCopy.notifications
              ? [...dataCopy.notifications]
              : [];
            notificationsCopy.push({
              type: "accept-bid",
              taskId: task._id,
              createdAt: Date.now(),
              isRead: false,
            });
            dataCopy.notifications = [...notificationsCopy];
            await User.findOneAndUpdate(
              { _id: bid.userId },
              { data: dataCopy }
            );
            const io = getIO();
            io.to(`${task.userId}-room`).emit("fetch-notifications", {});
          }
        }
        res.status(200).json({
          success: true,
          message: "Task has been updated successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Task not found",
        });
      }
    } catch (error) {
      console.log("Error while updating task", error);
    }
  },
};

module.exports = taskController;
