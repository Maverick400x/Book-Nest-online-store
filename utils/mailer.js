import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Securely stored email
    pass: process.env.EMAIL_PASS, // Securely stored password (App Password)
  },
});

export const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Online Bookstore" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
