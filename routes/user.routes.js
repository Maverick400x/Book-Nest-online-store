// routes/user.routes.js
import express from "express";

// Controllers
import {
  sendOtpForLogin,
  verifyOtpLogin,
  logoutUser,
  registerUser,
  renderLoginPage,
  renderRegisterPage,
  renderOtpPage
} from "../controllers/user.controller.js";

import { renderAccountPage } from "../controllers/account.controller.js";
import { updateContactInfo } from "../controllers/profile.controller.js";

// Middleware
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===================== AUTH PAGES =====================

// Login page
router.get("/login", renderLoginPage);

// Register page
router.get("/register", renderRegisterPage);

// OTP verification page
router.get("/verify-otp", renderOtpPage);

// ===================== AUTH ACTIONS =====================

// Send OTP
router.post("/send-otp", sendOtpForLogin);

// Verify OTP
router.post("/verify-otp", verifyOtpLogin);

// Register
router.post("/register", registerUser);

// Logout
router.get("/logout", logoutUser);

// ===================== ACCOUNT & PROFILE =====================

// Account page (protected)
router.get("/account", authMiddleware, renderAccountPage);

// Update profile (protected)
router.post("/profile/update", authMiddleware, updateContactInfo);

export default router;
