const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// Register A New User
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({ message: "User already exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    password: hashPassword,
    email: req.body.email,
    bio: req.body.bio,
  });

  await user.save();

  res.status(201).json({ message: "register successfully, please log in" });
});

// Login User
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email }).select("-__v");

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = user.generateToken();

  return res.status(200).json({
    message: "Login is successfully",
    _id: user._id,
    token,
  });
});
