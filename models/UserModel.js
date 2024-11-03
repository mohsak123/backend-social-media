const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      minlength: 1,
      maxlength: 128,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
      minlength: 8,
      maxlength: 128,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
      maxlength: 128,
    },
    profilePhoto: {
      type: String,
      name: String,
    },
    banner: {
      type: String,
      name: String,
    },
    bio: {
      type: String,
      maxlength: 250,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate Posts That Belongs To This User When he/she Get his/her profile
UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};

const User = mongoose.model("User", UserSchema);

// Validate Register User
const validateRegisterUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(1).max(128).required(),
    password: Joi.string().trim().min(8).max(128).required(),
    email: Joi.string().trim().min(5).max(128).email().required(),
    bio: Joi.string().min(0).max(128),
  });

  return schema.validate(obj);
};

// Validate Register User
const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(128).required(),
    password: Joi.string().trim().min(8).max(128).required(),
  });

  return schema.validate(obj);
};

// validate Update User
const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(1).max(128),
    password: Joi.string().trim().min(8).max(20),
    bio: Joi.string().min(0).max(128),
  });

  return schema.validate(obj);
};

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
