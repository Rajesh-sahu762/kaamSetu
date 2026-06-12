const nodemailer = require("nodemailer");

console.log({
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;