const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/PostModel");

const { Comment } = require("../models/CommentModel");

const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

const asyncHandler = require("express-async-handler");

const path = require("path");
const fs = require("fs");

// Get All Posts (Admin)
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user").sort({ createdAt: -1 });

  res.status(200).json(posts);
});

// Get One Post
module.exports.getOnePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  res.status(200).json(post);
});

// Create a new post
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // const { error } = validateCreatePost(req.body);

  // if (error) {
  //   return res.status(400).json({ message: error.details[0].message });
  // }

  const { postPhoto, title, description } = req.body;

  let imageData = "";

  // let postPhoto = req.file;
  // let image = "";
  // let imagePath = "";
  // let filename = "";
  // let dataUrl = "";

  // if (postPhoto) {
  //   filename = postPhoto.filename;
  //   imagePath = path.join(__dirname, `../public/${image}`);
  //   image = postPhoto;

  //   fs.renameSync(postPhoto.path, imagePath);

  //   const imageBuffer = fs.readFileSync(imagePath);
  //   base64Image = imageBuffer.toString("base64");

  //   const mimeType = postPhoto.mimetype;
  //   dataUrl = `data:${mimeType};base64,${base64Image}`;
  // }

  // if (postPhoto) {
  //   filename = postPhoto.filename;
  //   imagePath = path.join(__dirname, `../public/postPhoto/${filename}`);
  //   // image = postPhoto;
  //   fs.renameSync(postPhoto.path, imagePath);
  //   const imageBuffer = fs.readFileSync(imagePath);
  //   base64Image = imageBuffer.toString("base64");
  //   const mimeType = postPhoto.mimetype;
  //   // dataUrl = `data:${mimeType};base64,${base64Image}`;
  //   dataUrl = `http://localhost:4000/postPhoto/${filename}`;
  // }

  if (postPhoto.name !== "") {
    imageData = `data:${postPhoto.type};base64,${postPhoto.name}`;
  }

  const post = await Post.create({
    title,
    description,
    user: req.user.id,
    postPhoto: imageData,
  });

  await post.save();

  res.status(200).json({
    message: "Your post has been created successfully",
  });

  // if (imagePath !== "") {
  //   fs.unlinkSync(imagePath);
  // }
});

// Update Post
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied, you not allowed" });
  }

  await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "post has been updated successfully" });
});

// Update Post Image
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // Validation
  if (!req.body) {
    res.status(404).json({ message: "no file provided" });
  }

  // Get Post from db and check if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  // Check if this post belong to logged in user
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "Access Denied, you are not allowed" });
  }

  const { postImage } = req.body;

  let imageData = "";

  if (postImage.name !== "") {
    imageData = `data:${postImage.type};base64,${postImage.name}`;
  }

  // Update The Image Field In The DB
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        postPhoto: imageData,
      },
    },
    { new: true }
  );

  // Send Response To Client
  res.status(200).json({ message: "Your post photo updated successfully" });

  // Remove Image The Server
  // fs.unlinkSync(imagePath);
});

// Delete Post
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.postPhoto.publicId);
    await Comment.deleteMany({ postId: post._id });
    res.status(200).json({ message: "Post Has Been Deleted Successfully" });
  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});

// Post Photo Upload
module.exports.postPhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "no file provided" });
  }

  res.status(200).json({ message: "Upload Photo Post Has Been Successfully" });
});
