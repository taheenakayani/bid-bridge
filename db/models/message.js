const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messages: [
    {
      content: { type: String },
      sentBy: { type: String, default: null },
      createdAt: { type: Number, default: null },
    },
  ],
  channel: { type: String, default: null },
  data: { type: Object, default: null },
  recepients: [
    {
      id: { type: String, default: null },
      name: { type: String },
      avatar: { type: Object },
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
