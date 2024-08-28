const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  bidRate: { type: String, default: null },
  deliveryTime: { type: String, default: null },
  applicantCV: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Number, default: null },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: Object,
    default: null,
  },
});

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
