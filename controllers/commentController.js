const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/CommentModel");
const { User } = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// Get All Comments (Admin)
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().select("-__v");

  res.status(200).json({ comments });
});

// Get One Comment
module.exports.getOneCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  res.status(200).json({ comment });
});

// Create A Comment
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await User.findById(req.user.id);

  const comment = await Comment.create({
    user: req.user.id,
    username: user.username,
    postId: req.body.postId,
    text: req.body.text,
  });

  await comment.save();

  res.status(201).json({
    message: "Comment Has Been Created Successfully",
    comment,
  });
});

// Update Comment (only user)
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  if (comment.user.toString() !== req.user.id) {
    return res.status(404).json({
      message: "access denied, only user himself can edit his comment",
    });
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Your comment has been updated successfully",
    updatedComment,
  });
});

// Delete Comment (Admin And Only User)
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment Not Found" });
  }

  if (req.user.id === comment.user.toString() || req.user.isAdmin) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment has been deleted successfully" });
  } else {
    return res.status(403).json({ message: "access denied, not allowed" });
  }
});
