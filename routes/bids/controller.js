const { verifyToken } = require("../../authentication/token");
const Bid = require("../../db/models/bid");
const Task = require("../../db/models/task");
const User = require("../../db/models/user");
const { getIO } = require("../../socket");

const BidsController = {
  addBid: async (req, res) => {
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
      if (!req.body.taskId) {
        res.status(400).json({
          success: false,
          message: "taskId not found",
        });
      }
      const task = await Task.findOne({
        _id: req.body.taskId,
      });
      if (!task) {
        res.status(400).json({
          success: false,
          message: "task not found",
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
      const newBid = new Bid({
        bidRate: req.body.bidRate,
        deliveryTime: req.body.deliveryTime,
        createdAt: Date.now(),
        taskId: req.body.taskId,
        userId,
      });

      // Save the new user record to the database
      await newBid.save();
      const employer = await User.findById(task.userId);
      // send notification to employer
      let dataCopy = employer.data || {};
      let notificationsCopy = dataCopy.notifications
        ? [...dataCopy.notifications]
        : [];
      notificationsCopy.push({
        type: "place-bid",
        bidderId: userId,
        taskId: req.body.taskId,
        createdAt: Date.now(),
        isRead: false,
      });
      dataCopy.notifications = [...notificationsCopy];
      await User.findOneAndUpdate({ _id: task.userId }, { data: dataCopy });
      const io = getIO();
      io.to(`${task.userId}-room`).emit("fetch-notifications", {});
      console.log("Bid record added to database");
      res.status(200).json({
        message: "Bid added successfully",
        success: true,
      });
    } catch (error) {
      console.log("Error while adding job application", error);
    }
  },
  getBidsByUser: async (req, res) => {
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
      const bids = await Bid.find({
        userId,
      });

      console.log(bids);

      res.status(200).json({
        success: true,
        bids,
      });
    } catch (error) {
      console.log("Error while getting bids by user", error);
    }
  },
  getBidsByTaskIds: async (req, res) => {
    try {
      const taskIds = req.params.taskIds.split(",");
      console.log(taskIds);
      const bids = await Bid.find({
        taskId: { $in: taskIds },
      });

      console.log(bids);

      res.status(200).json({
        success: true,
        bids,
      });
    } catch (error) {
      console.log("Error while getting bids by task ids", error);
    }
  },
  removeBid: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const bidId = req.params.id;
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
      const bid = await Bid.findOneAndDelete({
        _id: bidId,
      });
      if (bid) {
        res.status(200).json({
          success: true,
          message: "Bid has been removed successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Bid not found",
        });
      }
    } catch (error) {
      console.log("Error while removing bid", error);
    }
  },
  updateBid: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const bidId = req.params.id;
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
      const bid = await Bid.findOneAndUpdate({ _id: bidId }, updateData, {
        new: true, // This option returns the updated document
        useFindAndModify: false, // This option is needed to avoid deprecation warnings
      });
      console.log(bid);
      if (bid) {
        res.status(200).json({
          success: true,
          message: "Bid has been updated successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Bid not found",
        });
      }
    } catch (error) {
      console.log("Error while updating bid", error);
    }
  },
};

module.exports = BidsController;
