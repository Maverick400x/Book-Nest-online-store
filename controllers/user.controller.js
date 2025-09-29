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

  // pass email if available (e.g., after submitting form)
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

    await sendMail(
      email,
      "🎉 Welcome to BookNest",
      `Hello ${fullName},\n\nYour account has been created successfully.\n\nHappy reading!\n— Team BookNest`
    );

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
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/users/reset-password/${resetToken}`;

    await sendMail(
      email,
      "🔐 Reset Your Password",
      `Hello ${user.fullName},\n\nClick below to reset your password (valid for 15 mins):\n\n${resetUrl}\n\nIf you didn’t request this, ignore this email.\n\n— BookNest Team`
    );

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

export const logoutUser = async (req, res) => {
  const user = req.session.user;
  const timestamp = new Date().toLocaleString();

  try {
    if (user) {
      await sendMail(
        user.email,
        "📤 Logout Alert",
        `Hello ${user.fullName},\n\nYou have successfully logged out of your BookNest account.\n\n📅 ${timestamp}\n\nIf this wasn’t you, contact support.\n\n— Team BookNest`
      );
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.redirect("/users/account");
      }
      res.clearCookie("connect.sid");
      res.redirect("/users/login");
    });
  } catch (err) {
    console.error("Logout exception:", err);
    res.redirect("/users/account");
  }
};
