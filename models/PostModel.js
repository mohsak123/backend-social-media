const mongoose = require("mongoose");
const Joi = require("joi");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    postPhoto: {
      url: { type: String },
      // type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Loves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate Comment for this post
PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});

const Post = mongoose.model("Post", PostSchema);

// Validate Create Post
const validateCreatePost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().trim().max(128).required(),
    description: Joi.string().trim().required(),
  });
  return schema.validate(obj);
};

// Validate Update Post
const validateUpdatePost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().trim().max(128),
    description: Joi.string().trim(),
  });
  return schema.validate(obj);
};

module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
};
