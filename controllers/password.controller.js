import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

// 🌐 Render Forgot Password Page
export const renderForgotPasswordPage = (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render("forgot-password", { title: "Forgot Password", error });
};

// 📩 Send Password Reset Link to Email
export const sendResetLink = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    req.session.error = "❌ Email is required.";
    return res.redirect("/users/forgot-password");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = "❌ No user found with that email.";
      return res.redirect("/users/forgot-password");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 15; // valid for 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `http://${req.headers.host}/users/reset-password/${token}`;

    const plainText = `
Hello ${user.username},

You requested a password reset.

Click the link below to reset your password (valid for 15 minutes):
${resetLink}

If you didn't request this, please ignore this email.

— Team BookNest
    `.trim();

    const html = `
      <h2>🔐 Password Reset - BookNest</h2>
      <p>Hi <strong>${user.username}</strong>,</p>
      <p>You requested a password reset. Click the link below:</p>
      <p><a href="${resetLink}" style="color: blue;">Reset Password</a></p>
      <p>This link is valid for 15 minutes.</p>
      <p>If this wasn’t you, you can ignore this message.</p>
      <p>— <strong>Team BookNest</strong></p>
    `;

    await sendMail(email, "🔐 Password Reset - BookNest", plainText, html);
    res.render("reset-link-sent", { title: "Email Sent", email });

  } catch (err) {
    req.session.error = "❌ Failed to send reset link: " + err.message;
    res.redirect("/users/forgot-password");
  }
};

// 🔓 Render Reset Password Page
export const renderResetPasswordPage = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    req.session.error = "❌ Invalid or expired token.";
    return res.redirect("/users/forgot-password");
  }

  res.render("reset-password", {
    title: "Reset Password",
    token,
    error: null
  });
};

// ✅ Reset Password Handler
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.render("reset-password", {
      title: "Reset Password",
      token,
      error: "❌ Password must be at least 6 characters."
    });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.render("reset-password", {
        title: "Reset Password",
        token,
        error: "❌ Token expired or invalid."
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // 📬 Notify user via email
    const timestamp = new Date().toLocaleString();
    const plainText = `
Hello ${user.username},

Your BookNest password was successfully changed on ${timestamp}.

If this wasn't you, please contact support immediately.

— Team BookNest
    `.trim();

    const html = `
      <h2>✅ Password Changed</h2>
      <p>Hi <strong>${user.username}</strong>,</p>
      <p>This is a confirmation that your password was changed on <strong>${timestamp}</strong>.</p>
      <p>If this wasn't you, please <a href="mailto:support@booknest.com">contact support</a> immediately.</p>
      <p>— <strong>Team BookNest</strong></p>
    `;

    await sendMail(
      user.email,
      "✅ Password Changed Successfully - BookNest",
      plainText,
      html
    );

    res.render("password-reset-success", {
      title: "Password Reset Successful"
    });

  } catch (err) {
    res.status(500).send("❌ Error resetting password: " + err.message);
  }
};