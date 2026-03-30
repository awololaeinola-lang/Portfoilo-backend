

import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  console.log("Contact form request body:", { name, email, message });

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: "Name, email, and message are required" 
    });
  }

  // Check environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email environment variables");
    return res.status(500).json({ 
      success: false, 
      error: "Server configuration error: Email settings not configured" 
    });
  }

  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection before sending
    await transporter.verify();

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name} via Portfolio`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    res.status(201).json({
      success: true,
      message: "Message sent successfully ✅",
    });
  } catch (error) {
    console.error("Email sending error:", {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
      code: error.code || "UNKNOWN_ERROR",
      details:
        error.response || error.response?.body || error || "No detailed error",
    });
  }
});

export default router;