const { mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  email: { type: String, unique: true },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const OTP = mongoose.model("OTP", OtpSchema);

module.exports = OTP;
