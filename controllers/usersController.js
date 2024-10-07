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
  if (!req.file) {
    return res.status(404).json({ message: "no file provided" });
  }

  const imagePath = path.join(
    __dirname,
    `../profilePhotos/${req.file.filename}`
  );

  const filePath = "social-media/profile-photos";

  const result = await cloudinaryUploadImage(imagePath, filePath);

  const user = await User.findById(req.user.id);

  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  res.status(200).json({
    message: "your profile photo upload successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  fs.unlinkSync(imagePath);
});

// Banner Profile Upload
module.exports.bannerPhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "no file provided" });
  }

  const imagePath = path.join(
    __dirname,
    `../bannerPhotos/${req.file.filename}`
  );

  const filePath = "social-media/banner-photos";

  const result = await cloudinaryUploadImage(imagePath, filePath);

  const user = await User.findById(req.user.id);

  if (user.banner.publicId !== null) {
    cloudinaryRemoveImage(user.banner.publicId);
  }

  user.banner = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  res.status(200).json({
    message: "your banner photo upload successfully",
    banner: { url: result.secure_url, publicId: result.public_id },
  });

  fs.unlinkSync(imagePath);
});

// Delete User Profile
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const posts = await Post.find({ user: user._id });

  const publicIds = posts?.map((post) => post.postPhoto.publicId);

  if (publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }

  await cloudinaryRemoveImage(user.profilePhoto.publicId);
  await cloudinaryRemoveImage(user.banner.publicId);

  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "your profile has been deleted" });
});
