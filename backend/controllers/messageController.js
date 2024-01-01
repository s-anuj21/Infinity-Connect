const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

/**
   @description Get all messages
    @route GET /api/message/:chatId
 */

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email profilePic")
    .populate("chat");

  res.status(200).json(messages);
});

/**
    @description Create new Message
    @route POST /api/message
 */

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error("Invalid Message Data");
  }

  const data = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(data);
  message = await Message.find({ _id: message._id })
    .populate("sender", "name email profilePic")
    .populate("chat");

  message = await User.populate(message, {
    path: "chat.users",
    select: "name profilePic email",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message[0]._id });

  res.status(201).json(message);
});

module.exports = { getAllMessages, sendMessage };
