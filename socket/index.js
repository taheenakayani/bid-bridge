const socketIo = require("socket.io");
const { emitChatHistory, emitChatMessage } = require("./events");

let io;

const registerSocketServer = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001", // Allow requests from your React app
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    console.log("CLIENT CONNECTED", userId);
    socket.join(`${userId}-room`);
    // emit chat history on connection
    // emitChatHistory(io, userId);

    // Handle messages
    socket.on("chat-message", (msg) => {
      emitChatMessage(io, msg, userId);
    });

    // Handle messages
    socket.on("chat-history", () => {
      emitChatHistory(io, userId);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(`User disconnected`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { registerSocketServer, getIO };
