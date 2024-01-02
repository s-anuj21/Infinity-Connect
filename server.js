const express = require("express");
const dotenv = require("dotenv");

const userRoutes = require("./backend/routes/userRoutes");
const chatRoutes = require("./backend/routes/chatRoutes");
const messageRoutes = require("./backend/routes/messageRoutes");
const {
  notFound,
  errorHandler,
} = require("./backend/middlewares/errorMiddleware");

const { connectDB } = require("./backend/config/db");
// Loading Environment Variables
dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Allows us to accept JSON data in the body

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Socket IO Stuffs

const io = require("socket.io")(server, {
  pingTimeout: 60000, // 60 sec
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket!!", socket.id);

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", (user) => {
    console.log("USER DISCONNECTED");
    socket.leave(user._id);
  });
});
