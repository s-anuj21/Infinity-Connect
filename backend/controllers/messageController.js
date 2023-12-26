const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");

/**
   @description Get all messages
    @route GET /api/message/:chatId
 */

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId }).populate(
    "sender",
    "name",
    "profilePic"
  );

  res.json(messages);
});

/**
    @description Create new Message
    @route POST /api/Message
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

  const message = await Message.create(data).populate(
    "sender name profilePic chat"
  );

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  res.json(message);
});

module.exports = { getAllMessages, sendMessage };
