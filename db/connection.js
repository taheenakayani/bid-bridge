// db.js
const uri =
  "mongodb+srv://kayaniaiza391:rxLVg89BNWIOAZNe@cluster0.za2wvqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(uri);

// Get the default connection
const db = mongoose.connection;

// Event listener for successful connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
