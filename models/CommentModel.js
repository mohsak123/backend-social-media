const mongoose = require("mongoose");
const Joi = require("joi");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    username: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

// validate create comment
const validateCreateComment = (obj) => {
  const schema = Joi.object({
    postId: Joi.string().required().label("Post ID"),
    text: Joi.string().trim().required(),
  });

  return schema.validate(obj);
};

// validate update comment
const validateUpdateComment = (obj) => {
  const schema = Joi.object({
    text: Joi.string().trim().required(),
  });

  return schema.validate(obj);
};

module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};
