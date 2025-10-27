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
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      req.session.error = "❌ Email already registered.";
      return res.redirect("/users/register");
    }

    const newUser = new User({
      fullName,
      username,
      email,
      password, // bcrypt handled in pre-save hook
      isVerified: true,
    });

    await newUser.save();

    req.session.success = "✅ Registration successful! You can now log in.";
    res.redirect("/users/login");

    // Send welcome email asynchronously
    setImmediate(async () => {
      try {
        const text = `Hello ${fullName}, welcome to BookNest! Your account has been created successfully.`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
              <h2 style="color: #333;">🎉 Welcome to <strong>BookNest</strong>, ${fullName}!</h2>
            </div>
            <p><strong>Your account has been created successfully.</strong></p>
            <p>Start exploring our wide range of books and enjoy reading 📚</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>— Team BookNest</strong></p>
          </div>
        `;
        await sendMail(email, "🎉 Welcome to BookNest", text, html);
      } catch (err) {
        console.error("Welcome email failed:", err);
      }
    });
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

    // Send login notification email asynchronously
    setImmediate(async () => {
      try {
        const loginText = `Hello ${user.fullName}, you just logged in to your BookNest account on ${new Date().toLocaleString()}.`;
        const loginHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
              <h3 style="color: #444;">🔐 <strong>Login Notification</strong></h3>
            </div>
            <p>Hello <strong>${user.fullName}</strong>,</p>
            <p>You just <strong>logged in</strong> to your account at <strong>${new Date().toLocaleString()}</strong>.</p>
            <p>If this wasn’t you, please <strong>reset your password immediately.</strong></p>
            <p style="margin-top: 20px;">Stay safe,<br><strong>— BookNest Security Team</strong></p>
          </div>
        `;
        await sendMail(user.email, "🔐 New Login to Your BookNest Account", loginText, loginHtml);
      } catch (err) {
        console.error("Login email failed:", err);
      }
    });
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/users/reset-password/${resetToken}`;
    req.session.success = "📩 Password reset link sent to your email.";
    res.redirect(`/users/forgot-password?email=${encodeURIComponent(email)}`);

    // Send reset email asynchronously
    setImmediate(async () => {
      try {
        const text = `Hello ${user.fullName}, You requested a password reset. Reset here: ${resetUrl}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
              <h3 style="color: #444;">🔑 <strong>Password Reset Request</strong></h3>
            </div>
            <p>Hello <strong>${user.fullName}</strong>,</p>
            <p>You requested a <strong>password reset</strong>. Click the link below to reset your password (valid for 2 minutes):</p>
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
    });
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

    user.password = password;
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
  const user = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/users/account");
    }

    res.clearCookie("connect.sid");
    res.redirect("/users/login");

    if (user?.email) {
      setImmediate(async () => {
        try {
          const logoutText = `Hello ${user.fullName}, you just logged out of your BookNest account on ${new Date().toLocaleString()}.`;
          const logoutHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
                <h3 style="color: #444;">🚪 <strong>Logout Notification</strong></h3>
              </div>
              <p>Hello <strong>${user.fullName}</strong>,</p>
              <p>You just <strong>logged out</strong> of your account at <strong>${new Date().toLocaleString()}</strong>.</p>
              <p style="margin-top: 20px;">Best regards,<br><strong>— BookNest Security Team</strong></p>
            </div>
          `;
          await sendMail(user.email, "🚪 Logout from Your BookNest Account", logoutText, logoutHtml);
        } catch (err) {
          console.error("Logout email failed:", err);
        }
      });
    }
  });
};

// =================== HANDLE GOOGLE OAUTH ===================

export const handleGoogleLogin = async (profile) => {
  const email = profile.emails[0].value;
  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = profile.id;
      await user.save();
    }
    return user;
  }

  // Create new user if not exists
  const randomPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  user = new User({
    fullName: profile.displayName,
    username: email.split("@")[0],
    email,
    password: hashedPassword,
    isVerified: true,
    googleId: profile.id,
  });

  await user.save();

  // Send Welcome Email asynchronously
  setImmediate(async () => {
    try {
      const text = `Hello ${user.fullName}, welcome to BookNest! You logged in using Google.`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
            <h2 style="color: #333;">🎉 Welcome to <strong>BookNest</strong>, ${user.fullName}!</h2>
          </div>
          <p>Welcome back! You logged in using your Google account.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>— Team BookNest</strong></p>
        </div>
      `;
      await sendMail(user.email, "🎉 Welcome to BookNest", text, html);
    } catch (err) {
      console.error("Google login email failed:", err);
    }
  });

  return user;
};
