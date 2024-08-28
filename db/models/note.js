const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: { type: String, default: null },
  createdAt: { type: Number, default: null },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "new",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
