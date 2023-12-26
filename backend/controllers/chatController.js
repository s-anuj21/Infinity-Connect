const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");

const chatsData = require("../res/data");

/**
  @description  Fetch all chats
  @route        GET /api/chat
*/

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  res.send(chatsData);

  if (!userId) {
    res.status(400);
    throw new Error("Please provide a userId");
  }

  const chats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("users", "name profilePic");

  if (chats.length > 0) {
    console.log(chats);
    return res.json(chats[0]);
  }

  // Otherwise,  create a new Chat between logged in user and the user to chat with

  const newChat = await Chat.create({
    chatName: "Sender",
    users: [req.user._id, userId],
    isGroupChat: false,
  }).populate("users", "name profilePic");

  res.status(200).json(newChat);
});

module.exports = { accessChat };
