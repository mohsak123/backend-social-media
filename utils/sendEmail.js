const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  secure: true,
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "kogoshakokah@gmail.com", // Your Gmail address
    pass: "mwlejmunxkamlwqe", // App password
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Ready to send emails");
  }
});

// Function to send emails
function sendMail(to, sub, msg) {
  transporter.sendMail(
    {
      from: "kogoshakokah@gmail.com", // Sender email
      to: to,
      subject: sub,
      html: msg, // HTML content of the email
    },
    (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    }
  );
}

// Uncomment the line below to test the function
// sendMail("kogoshakokah@gmail.com", "This is subject", "This is message");

module.exports = { sendMail };
