// controllers/user.controller.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

// =================== RENDER PAGES ===================

export const renderLoginPage = (req, res) => {
  const { error, success } = req.session;
  req.session.error = null;
  req.session.success = null;
  res.render("login", { title: "Login", error, success });
};

export const renderRegisterPage = (req, res) => {
  const { error, success } = req.session;
  req.session.error = null;
  req.session.success = null;
  res.render("register", { title: "Register", error, success });
};

export const renderForgotPasswordPage = (req, res) => {
  const { error, success } = req.session;
  req.session.error = null;
  req.session.success = null;
  const email = req.query.email || "";
  res.render("forgot-password", { title: "Forgot Password", error, success, email });
};

export const renderResetPasswordPage = (req, res) => {
  const { error, success } = req.session;
  req.session.error = null;
  req.session.success = null;
  res.render("reset-password", { title: "Reset Password", token: req.params.token, error, success });
};

// =================== REGISTER USER ===================

export const registerUser = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.error = "❌ Email already registered.";
      return res.redirect("/users/register");
    }

    const newUser = new User({
      fullName,
      username,
      email,
      password, // bcrypt handled in pre-save hook
      isVerified: true, // direct verification
    });

    await newUser.save();

    // Send Welcome Email
    const html = `
      <h2>Welcome to BookNest, ${fullName}!</h2>
      <p>Your account has been created successfully. Start exploring our books!</p>
      <p>Happy Reading! 📚</p>
      <p>— Team BookNest</p>
    `;
    await sendMail(email, "🎉 Welcome to BookNest", `Hello ${fullName}, your account is ready!`, html);

    req.session.success = "✅ Registration successful! You can now log in.";
    res.redirect("/users/login");
  } catch (err) {
    console.error("Register error:", err);
    req.session.error = "❌ Registration failed.";
    res.redirect("/users/register");
  }
};

// =================== LOGIN USER ===================

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.error = "❌ Invalid email or password.";
      return res.redirect("/users/login");
    }

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
    };

    req.session.success = "🎉 Logged in successfully!";
    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    req.session.error = "❌ Login failed.";
    res.redirect("/users/login");
  }
};

// =================== FORGOT PASSWORD ===================

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = "❌ User not found.";
      return res.redirect("/users/forgot-password");
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/users/reset-password/${resetToken}`;

    const html = `
      <h3>Password Reset Request</h3>
      <p>Hello ${user.fullName},</p>
      <p>You requested a password reset. Click the link below to reset your password (valid for 2 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>— BookNest Team</p>
    `;

    await sendMail(email, "🔐 Reset Your Password", `Reset your password using this link: ${resetUrl}`, html);

    req.session.success = "📩 Password reset link sent to your email.";
    res.redirect(`/users/forgot-password?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error("Forgot password error:", err);
    req.session.error = "❌ Failed to send reset link.";
    res.redirect("/users/forgot-password");
  }
};

// =================== RESET PASSWORD ===================

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      req.session.error = "❌ Invalid or expired token.";
      return res.redirect("/users/forgot-password");
    }

    user.password = password; // bcrypt handled in pre-save hook
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    req.session.success = "✅ Password reset successful. Please log in.";
    res.redirect("/users/login");
  } catch (err) {
    console.error("Reset password error:", err);
    req.session.error = "❌ Failed to reset password.";
    res.redirect("/users/forgot-password");
  }
};

// =================== LOGOUT ===================

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/users/account");
    }
    res.clearCookie("connect.sid");
    res.redirect("/users/login");
  });
};