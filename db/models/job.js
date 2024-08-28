const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, default: null },
  type: { type: String, default: null },
  category: { type: String, default: null },
  location: { type: String, default: null },
  salary: { type: String, default: null },
  tags: { type: String, default: null },
  description: { type: String, default: null },
  createdAt: { type: Number, default: null },
  companyLogo: { type: Object, default: null },
  data: { type: Object, default: null },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
