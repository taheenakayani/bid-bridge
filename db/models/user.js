const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  role: { type: String, default: null },
  avatar: { base64Image: String, contentType: String },
  token: { type: String, default: null },
  data: { type: Object, default: null },
  resume: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  coverLetter: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  platform: { type: String, default: null },
  platformId: { type: String, default: null },
  createdAt: { type: Number, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
