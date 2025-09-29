import { sendMail } from "../utils/mailer.js";

// Render Contact Page
export const renderContactPage = (req, res) => {
  res.render("contact", { title: "Contact Us", user: req.session.user });
};

// Handle Contact Form Submission
export const handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.send("All fields are required!");
  }

  // Send Email Notification
  await sendMail(
    "admin@example.com", // Change this to your admin email
    `New Contact Request: ${subject}`,
    `From: ${name} (${email})\n\nMessage:\n${message}`
  );

  res.send("Your request has been submitted successfully!");
};
