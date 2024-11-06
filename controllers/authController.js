const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/sendEmail");
const crypto = require("crypto");

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

  const emailTk = await crypto.randomBytes(64).toString("hex");

  const sub = "Welcome to our website";

  const msg = `
      <html>
        <body style="font-size:"30px"">
            <p>
            <h1>This is the code to confirm your email:</h1>
              <a href="${process.env.REACT_APP_DOMAIN}/verifyEmail/${emailTk}">Click here to confirm your email</a>
              <h2 style="color:"red"">Note: </h2><span>This code expires after 1 hour</span>
            </p>
        </body>
      </html >`;

  const to = `${req.body.username} <${req.body.email}>`;

  // res.json({ message: "sending email in moment" });

  sendMail(to, sub, msg);

  user = new User({
    username: req.body.username,
    password: hashPassword,
    email: req.body.email,
    bio: req.body.bio,
    emailToken: emailTk,
  });

  await user.save();

  res.status(201).json({
    message: "register successfully, please confirm your email then login",
    user,
  });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const emailToken = req.body.emailToken;

  console.log(emailToken);
  console.log(typeof emailToken);

  if (!emailToken) {
    return res.status(400).json({ message: "EmailToken not found..." });
  }

  const user = await User.findOne({ emailToken }).select("-__v");

  console.log(user);

  if (user) {
    user.emailToken = null;
    user.verified = true;
    await user.save();

    res.status(200).json({
      message: "Your email is verified please login",
      emailToken,
      verified: user?.verified,
    });
  } else {
    res.status(400).json("Email verification failed, invalid token!");
  }
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

  if (user.verified === false) {
    return res
      .status(404)
      .json({ message: "Your Email not verified, Please verify it" });
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
