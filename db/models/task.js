const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, default: null },
  type: { type: String, default: null },
  category: { type: String, default: null },
  location: { type: String, default: null },
  budget: { type: String, default: null },
  requiredSkills: { type: String, default: null },
  description: { type: String, default: null },
  data: { type: Object, default: null },
  createdAt: { type: Number, default: null },
  status: {
    type: String,
    enum: ["new", "in-progress", "finished"],
    default: "new",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    default: null,
  },
  review: {
    type: Object,
    default: null,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
