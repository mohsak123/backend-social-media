const nodemailer = require("nodemailer");
require(".env").config();

const { EMAIL, PASSWORD } = process.env;
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp-gmail.com",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
  }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
