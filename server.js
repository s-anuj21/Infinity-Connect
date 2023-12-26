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
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
