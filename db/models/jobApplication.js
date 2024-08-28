const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  applicantName: { type: String, default: null },
  applicantEmail: { type: String, default: null },
  applicantCV: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  applicationDate: { type: Number, default: null },
  data: { type: Object, default: null },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
