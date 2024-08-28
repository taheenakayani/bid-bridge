const { verifyToken } = require("../../authentication/token");
const Note = require("../../db/models/note");
const User = require("../../db/models/user");

const NotesController = {
  addNote: async (req, res) => {
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
      const newNote = new Note({
        content: req.body.content,
        priority: req.body.priority,
        createdAt: Date.now(),
        userId,
      });

      // Save the new user record to the database
      newNote
        .save()
        .then(() => {
          res.status(200).json({
            message: "Note added successfully",
            success: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Server Error");
        });
    } catch (error) {
      console.log("Error while adding note", error);
    }
  },
  getNotes: async (req, res) => {
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
      const notes = await Note.find({
        userId,
      });

      res.status(200).json({
        success: true,
        notes,
      });
    } catch (error) {
      console.log("Error while getting notes by user", error);
    }
  },
  removeNote: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const noteId = req.params.id;
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
      const note = await Note.findOneAndDelete({
        _id: noteId,
      });
      if (note) {
        res.status(200).json({
          success: true,
          message: "Note has been removed successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Note not found",
        });
      }
    } catch (error) {
      console.log("Error while removing note", error);
    }
  },
};

module.exports = NotesController;
