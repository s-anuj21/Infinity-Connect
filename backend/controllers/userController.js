const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const { generateJWT } = require("../config/generateJWT");

/** 
  @description Register a new user
  @route POST /api/user
  @access Public 
*/

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  console.log(userExists, "userExists");
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    profilePic,
  });

  const jwt = generateJWT(user._id);

  res.status(201).json({
    ...user._doc,
    jwt,
  });
});

/** 
  @description Login user
  @route POST /api/user/login
  @access Public 
*/
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      status: "error",
      message: "Invalid Email or Password",
    });
  }

  console.log(user._id, "user._id");

  const token = generateJWT(user._id);

  return res.status(200).json({
    status: "success",
    ...user._doc,
    token,
  });
});

/**
    @description Get all users
    @route GET /api/user
 */
const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

module.exports = { getAllUser, registerUser, loginUser };
