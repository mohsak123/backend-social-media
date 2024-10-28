const { User, validateUpdateUser } = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/CommentModel");
const { Post } = require("../models/PostModel");

const path = require("path");
const fs = require("fs");

// Get All Users (Admin)
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

// Get User Profile
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  res.status(200).json(user);
});

// Update User Profile
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  let pass = "";

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    pass = await req.body.password;
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "Your Profile Updated Successfully", pass });
});

// Profile Photo Upload
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  const { profileImage } = req.body;

  const user = await User.findById(req.user.id);

  let imageData = "";

  if (profileImage.name !== "") {
    imageData = `data:${profileImage.type};base64,${profileImage.name}`;
  }

  user.profilePhoto = imageData;

  await user.save();

  res.status(200).json({
    message: "your profile photo upload successfully",
  });
});

// Banner Profile Upload
module.exports.bannerPhotoUploadCtrl = asyncHandler(async (req, res) => {
  const { bannerImage } = req.body;

  let imageData = "";

  const user = await User.findById(req.user.id);

  if (bannerImage.name !== "") {
    imageData = `data:${bannerImage.type};base64,${bannerImage.name}`;
  }

  user.banner = imageData;

  await user.save();

  res.status(200).json({
    message: "your banner photo upload successfully",
  });
});

// Delete User Profile
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const posts = await Post.find({ user: user._id });

  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "your profile has been deleted" });
});
