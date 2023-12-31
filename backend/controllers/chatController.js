const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const chatsData = require("../res/data");

/**
  @description  Create or Fetch one to one chat
  @route        POST /api/chat
*/

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("Please provide a userId");
  }

  let chats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (chats.length > 0) {
    return res.json(chats[0]);
  }

  // Otherwise,  create a new Chat between logged in user and the user to chat with

  let createdChat = await Chat.create({
    chatName: "Sender",
    users: [req.user._id, userId],
    isGroupChat: false,
  });

  createdChat = await Chat.find({ _id: createdChat._id }).populate(
    "users",
    "-password"
  );

  res.status(200).json(createdChat);
});

/**
   @description   Fetch all chat of a particular user
   @route Get /api/chat
 */

const fetchChats = asyncHandler(async (req, res) => {
  const allChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  allChats = await User.populate(allChats, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  res.status(200).json(allChats);
});

/**
    @description   Create a group 
    @route Post /api/chat/group   
*/
const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    res.status(400);
    console.log(req.body);
    throw new Error("Please fill all details");
  }

  let users = req.body.users;
  users.push(req.user._id);

  let groupChat = await Chat.create({
    chatName: req.body.chatName,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  groupChat = await Chat.find({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(groupChat);
});

/**
 * @description Add user to group
 * @route PUT /api/chat/addToGroup
 */

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedGroup = await Chat.findAndUpdate(
    { _id: chatId },
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(400);
    throw new Error("Group not found");
  }

  res.status(200).json(updatedChat);
});

/**
 * @description Add user to group
 * @route PUT /api/chat/addToGroup
 */

const addToGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const updatedGroup = await Chat.findAndUpdate(
    {
      _id: userId,
    },
    { $push: { users: userId } },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(400);
    throw new Error("Group not found");
  }

  res.status(200).json(updatedGroup);
});

/**
 * @description Remove user from group
 * @route PUT /api/chat/removeFromGroup
 
 */
const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const updatedGroup = await Chat.findAndUpdate(
    {
      _id: userId,
    },
    { $pull: { users: userId } },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(400);
    throw new Error("Group not found");
  }

  res.status(200).json(updatedGroup);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
