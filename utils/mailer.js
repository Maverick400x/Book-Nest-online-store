import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service (you can replace with another email provider)
  auth: {
    user: process.env.EMAIL_USER, // Your email address (from .env)
    pass: process.env.EMAIL_PASS, // Your app-specific password (from .env)
  },
  tls: {
    rejectUnauthorized: false, // Optional: to ignore certificate issues in some cases
  },
});

// Function to send email
export const sendMail = async (to, subject, text) => {
  try {
    // Send email using the transporter
    await transporter.sendMail({
      from: `"BookNest" <${process.env.EMAIL_USER}>`, // Email sender
      to, // Receiver email address
      subject, // Subject of the email
      text, // Email body content
    });

    console.log("✅ Email sent successfully to", to); // Log success
  } catch (error) {
    // Log the error if something goes wrong
    console.error("❌ Error sending email:", error);
  }
};