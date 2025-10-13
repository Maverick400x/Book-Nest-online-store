import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});
export const sendMail = async (to, subject, text) => {
  try {
    
    await transporter.sendMail({
      from: `"BookNest" <${process.env.EMAIL_USER}>`, // Email sender
      to, 
      subject, 
      text, 
    });
    console.log("✅ Email sent successfully to", to); // Log success
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
