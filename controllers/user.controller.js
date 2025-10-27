import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

// =================== SESSION MESSAGE HELPER ===================
const clearSessionMessages = (req) => {
  const { error, success } = req.session;
  req.session.error = null;
  req.session.success = null;
  return { error, success };
};

// =================== RENDER PAGES ===================
export const renderLoginPage = (req, res) => {
  const { error, success } = clearSessionMessages(req);
  res.render("login", { title: "Login", error, success });
};

export const renderRegisterPage = (req, res) => {
  const { error, success } = clearSessionMessages(req);
  res.render("register", { title: "Register", error, success });
};

export const renderForgotPasswordPage = (req, res) => {
  const { error, success } = clearSessionMessages(req);
  const email = req.query.email || "";
  res.render("forgot-password", { title: "Forgot Password", error, success, email });
};

export const renderResetPasswordPage = (req, res) => {
  const { error, success } = clearSessionMessages(req);
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

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });
    await newUser.save();

    req.session.success = "✅ Registration successful! You can now log in.";
    res.redirect("/users/login");

    // Send Welcome Email
    (async () => {
      try {
        const text = `Hello ${fullName}, welcome to BookNest! Your account has been created successfully.`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
              <h2 style="color: #333;">🎉 Welcome to <strong>BookNest</strong>, ${fullName}!</h2>
            </div>
            <p>Your account has been created successfully.</p>
            <p>Start exploring our wide range of books and enjoy reading 📚</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>— Team BookNest</strong></p>
          </div>
        `;
        await sendMail(email, "🎉 Welcome to BookNest", text, html);
      } catch (err) {
        console.error("Welcome email failed:", err);
      }
    })();
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
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

// =================== GOOGLE LOGIN HANDLER ===================
export const googleLoginHandler = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      const profile = req.session.googleProfile;
      if (!profile) {
        req.session.error = "⚠️ Google login failed. Please try again.";
        return res.redirect("/users/login");
      }

      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = new User({
        fullName: profile.displayName,
        username: profile.emails[0].value.split("@")[0],
        email: profile.emails[0].value,
        password: hashedPassword,
        isVerified: true,
        googleId: profile.id,
      });
      await user.save();
    }

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
    };
    req.session.success = "🎉 Logged in with Google successfully!";
    res.redirect("/");
  } catch (err) {
    console.error("Google login handler error:", err);
    req.session.error = "❌ Google login failed.";
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 2 * 60 * 1000;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/users/reset-password/${resetToken}`;
    req.session.success = "📩 Password reset link sent to your email.";
    res.redirect(`/users/forgot-password?email=${encodeURIComponent(email)}`);

    (async () => {
      try {
        const text = `Hello ${user.fullName}, You requested a password reset. Reset here: ${resetUrl}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
              <h3 style="color: #444;">🔑 <strong>Password Reset Request</strong></h3>
            </div>
            <p>Hello <strong>${user.fullName}</strong>,</p>
            <p>Click the link below to reset your password (valid for 2 minutes):</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" style="background: #4CAF50; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p style="margin-top: 20px;">— <strong>BookNest Security Team</strong></p>
          </div>
        `;
        await sendMail(email, "🔐 Reset Your Password", text, html);
      } catch (err) {
        console.error("Forgot password email failed:", err);
      }
    })();
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

    user.password = await bcrypt.hash(password, 12);
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