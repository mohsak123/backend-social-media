const router = require("express").Router();
const {
  registerUserCtrl,
  loginUserCtrl,
  verifyEmail,
} = require("../controllers/authController");

// const { sendOTP } = require("../controllers/otpController");

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

router.route("/verifyEmail").post(verifyEmail);

module.exports = router;

// 672b087fc8b4320a801a143d
