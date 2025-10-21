import express from "express";

// ================= CONTROLLERS =================
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  renderLoginPage,
  renderRegisterPage,
  renderForgotPasswordPage,
  renderResetPasswordPage,
} from "../controllers/user.controller.js";

import { renderAccountPage } from "../controllers/account.controller.js";
import { updateContactInfo } from "../controllers/profile.controller.js";

// ================= MIDDLEWARE =================
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ================= PASSPORT =================
import passport from "passport"; 
import "../config/passport.js"; // Google OAuth config

// ================= ROUTER =================
const router = express.Router();

// ===================== AUTH PAGES =====================

// Login page
router.get("/login", renderLoginPage);

// Register page
router.get("/register", renderRegisterPage);

// Forgot password page
router.get("/forgot-password", renderForgotPasswordPage);

// Reset password page (with token)
router.get("/reset-password/:token", renderResetPasswordPage);

// ===================== AUTH ACTIONS =====================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", logoutUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// ===================== GOOGLE OAUTH =====================

// Redirect to Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/users/login",
    failureMessage: true // capture Passport error messages
  }),
  (req, res) => {
    if (!req.user) {
      // If Passport returned no user (e.g., not registered)
      req.session.error = req.session.messages?.[0] || "You are not registered yet. Please register first.";
      req.session.messages = [];
      return res.redirect("/users/login");
    }

    // Save user session after successful Google login
    req.session.user = {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      username: req.user.username,
    };

    req.session.success = "🎉 Logged in with Google successfully!";
    res.redirect("/"); // Redirect to homepage or dashboard
  }
);

// ===================== ACCOUNT & PROFILE =====================

// Account page (protected)
router.get("/account", authMiddleware, renderAccountPage);

// Update profile (protected)
router.post("/profile/update", authMiddleware, updateContactInfo);

export default router;