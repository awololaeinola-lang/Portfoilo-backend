
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    console.log("Incoming request:", { name, email, message });

    // ✅ Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required",
      });
    }

    // ✅ Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS");
      return res.status(500).json({
        success: false,
        error: "Server email configuration error",
      });
    }

    // ✅ Create transporter (PRODUCTION SAFE)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ❌ Removed transporter.verify() (causes issues on Render)

    // ✅ Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `
You have a new message from your portfolio:

Name: ${name}
Email: ${email}
Message: ${message}
      `,
    };

    // ✅ Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully ✅",
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
});

export default router;