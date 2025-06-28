const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,  // your email
    pass: process.env.MAIL_PASS   // your app password (not real password)
  }
});

module.exports = transporter;
