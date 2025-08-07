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

export const renderOtpPage = (req, res) => {
  const { error, success, email } = req.session;
  req.session.error = null;
  req.session.success = null;

  if (!email) return res.redirect("/users/login");
  res.render("verify-otp", { title: "Verify OTP", email, error, success });
};

// =================== REGISTER USER (with OTP) ===================

export const registerUser = async (req, res) => {
  const { fullName, username, email } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.error = "❌ Email already registered.";
      return res.redirect("/users/register");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    const newUser = new User({
      fullName,
      username,
      email,
      otp,
      otpExpiry,
      isVerified: false
    });

    await newUser.save();

    await sendMail(
      email,
      "📩 Verify Your BookNest Account",
      `Hello ${fullName},\n\nThanks for registering on BookNest!\nPlease verify your account using the OTP below:\n🔐 OTP: **${otp}**\n\nThis OTP is valid for 10 minutes.\n\nIf you didn’t register, ignore this email.\n\nHappy reading,\nTeam BookNest`
    );

    req.session.success = "✅ Registration successful! OTP sent to your email.";
    req.session.email = email;
    return res.redirect("/users/verify-otp");
  } catch (err) {
    console.error("Register error:", err);
    req.session.error = "❌ Registration failed.";
    res.redirect("/users/register");
  }
};

// =================== VERIFY OTP (for registration) ===================

export const verifyOtpLogin = async (req, res) => {
  const { otp } = req.body;
  const { email } = req.session;
  const timestamp = new Date().toLocaleString();

  if (!email || !otp) {
    req.session.error = "❌ Missing email or OTP.";
    return res.redirect("/users/verify-otp");
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      req.session.error = "❌ Invalid or expired OTP.";
      return res.redirect("/users/verify-otp");
    }

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email
    };

    await sendMail(
      user.email,
      "✅ Account Verified",
      `Hi ${user.fullName},\n\nYour BookNest account has been successfully verified and Logged In.\n\n📅 Verified on: ${timestamp}\n\nEnjoy your reading journey!\n— Team BookNest`
    );

    delete req.session.email;
    req.session.success = "🎉 Account verified and logged in!";
    res.redirect("/"); //home page redirected
  } catch (err) {
    console.error("OTP verify error:", err);
    req.session.error = "❌ Verification failed.";
    res.redirect("/users/verify-otp");
  }
};

// =================== SEND OTP FOR LOGIN ===================

export const sendOtpForLogin = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = "❌ User not found.";
      return res.redirect("/users/login");
    }

    // if (!user.isVerified) {
    //   req.session.error = "⚠️ Please verify your account first via OTP.";
    //   return res.redirect("/users/login");
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    req.session.email = email;

    await sendMail(
      email,
      "🔐 Your OTP for Login",
      `Hello ${user.fullName},\n\nPlease use the following One-Time Password (OTP) to log in:\n\n✅ OTP: ${otp}\n\n⏰ OTP is valid for 5 minutes.\n\nIf this wasn't you, please ignore.\n\n— BookNest Team`
    );

    req.session.success = "📩 OTP sent to your email.";
    res.redirect("/users/verify-otp");
  } catch (err) {
    console.error("Send OTP error:", err);
    req.session.error = "❌ Failed to send OTP.";
    res.redirect("/users/login");
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
        `Hello ${user.fullName},\n\nYou have successfully logged out of your BookNest account.\n\n📅 ${timestamp}\n\nIf this wasn’t you, contact support.\n\n— BookNest Team`
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