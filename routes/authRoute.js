const router = require("express").Router();
const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../controllers/authController");

// const { sendOTP } = require("../controllers/otpController");

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

// request new verification otp
// router.post("/send-otp", async (req, res) => {
//   try {
//     const { email, subject, message, duration } = req.body;
//     const createdOTP = await sendOTP({
//       email,
//       subject,
//       message,
//       duration,
//     });
//     res.status(200).json(createdOTP);
//   } catch (error) {
//     throw error;
//   }
// });

module.exports = router;
