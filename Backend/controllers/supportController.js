// controllers/supportController.js
//
// Powers the public Contact Support form (SupportPage.jsx), which had no
// submit handler at all before — reuses the existing mail transporter
// (config/mail.js, already used for OTP emails) rather than adding a new
// mail integration or a ticket database.

const transporter = require("../config/mail");

const submitSupportRequest = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Support] ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent. Our team will get back to you soon.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later.",
    });
  }
};

module.exports = { submitSupportRequest };
