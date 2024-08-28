const {
  createCheckSchema,
} = require("express-validator/lib/middlewares/schema");
const Message = require("../db/models/message");
const User = require("../db/models/user");

async function emitChatHistory(io, userId) {
  try {
    const messages = await Message.find({
      channel: { $regex: userId },
    });
    io.to(`${userId}-room`).emit("chat-history", messages);
  } catch (e) {
    console.error("error while emitting chat history", e);
  }
}

async function emitChatMessage(io, messageData, userId) {
  try {
    // get receiver and sender info
    const receiver = await User.findOne({ _id: messageData.receiverId });
    const sender = await User.findOne({ _id: userId });
    if (sender && receiver) {
      const channel = sender._id + receiver._id;
      const senderData = {
        id: userId,
        name: sender.name,
        avatar: sender.avatar,
      };
      const receiverData = {
        id: messageData.receiverId,
        name: receiver.name,
        avatar: receiver.avatar,
      };
      let conversation = await Message.findOne({
        $and: [
          { channel: { $regex: messageData.receiverId } },
          { channel: { $regex: userId } },
        ],
      });
      if (conversation) {
        const messagesCopy = [...conversation.messages];
        messagesCopy.push({
          content: messageData.message,
          createdAt: Date.now(),
          sentBy: userId,
        });
        conversation.messages = [...messagesCopy];
      } else {
        conversation = new Message({
          messages: [
            {
              content: messageData.message,
              createdAt: Date.now(),
              sentBy: userId,
            },
          ],
          recepients: [senderData, receiverData],
          channel,
        });
      }
      console.log(conversation);
      await conversation.save();

      console.log("emitting message to receiver");
      io.to(`${messageData.receiverId}-room`).emit(
        "chat-message",
        conversation
      );

      console.log("emitting message back to sender");
      io.to(`${userId}-room`).emit("chat-message", conversation);
    } else {
      console.log("sender not found");
    }
  } catch (e) {
    console.error("error while emitting message", e);
  }
}

module.exports = { emitChatHistory, emitChatMessage };
