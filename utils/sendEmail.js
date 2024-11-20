const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  secure: true,
  service: "gmail",
  host: "smtp.gmail.com",
  // host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "kogoshakokah@gmail.com",
    pass: "mwlejmunxkamlwqe",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
  }
});

function sendMail(to, sub, msg) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });

  console.log("send email");
}

// sendMail("kogoshakokah@gmail.com", "This is subject", "this is message");

module.exports = { sendMail };
