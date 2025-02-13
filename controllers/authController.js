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

  // const emailTk = await crypto.randomBytes(64).toString("hex");

  // const sub = "Welcome to our website";

  // const msg = `
  //     <html>
  //       <body style="font-family: Arial, sans-serif; color: #333;">
  //           <h1 style="font-size:50px;font-style:italic;color: #555;font-weight:500">Arab Social</h1>
  //           <p style="margin: 0; padding: 0;">
  //               <h1 style="color: #4CAF50; font-size: 24px;">This is the code to confirm your email:</h1>
  //               <a href="${process.env.REACT_APP_DOMAIN}/verifyEmail/${emailTk}" style="color: #1a73e8; text-decoration: none; font-weight: bold;font-size:17px;font-style:italic">Click here to confirm your email</a>
  //               <h2 style="font-size: 18px; color: #FF5733; margin-top: 20px;">Important Note: <span style="font-size: 14px; color: #555;display:inline">This code expires after 1 hour and can only be used once.</span></h2>
  //           </p>
  //       </body>
  //     </html>`;

  // const to = `${req.body.username} <${req.body.email}>`;

  // res.json({ message: "sending email in moment" });

  // sendMail(to, sub, msg);

  user = new User({
    username: req.body.username,
    password: hashPassword,
    email: req.body.email,
    bio: req.body.bio,
    // emailToken: emailTk,
  });

  await user.save();

  res.status(201).json({
    message: "register successfully, please login",
    user,
  });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const emailToken = req.body.emailToken;

  if (!emailToken) {
    return res.status(400).json({ message: "EmailToken not found..." });
  }

  const user = await User.findOne({ emailToken }).select("-__v");

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

  // if (user.verified === false) {
  //   return res
  //     .status(404)
  //     .json({ message: "Your Email not verified, Please verify it" });
  // }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = await user.generateToken();

  return res.status(200).json({
    message: "Login is successfully",
    _id: user._id,
    token,
  });
});
