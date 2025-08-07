import express from "express";

// Auth controller methods (OTP only)
import {
  sendOtpForLogin,
  verifyOtpLogin,
  logoutUser,
  registerUser,
  renderLoginPage,
  renderRegisterPage,
  renderOtpPage
} from "../controllers/user.controller.js";

// Account page rendering
import { renderAccountPage } from "../controllers/account.controller.js";

// Profile update only (delete removed)
import { updateContactInfo } from "../controllers/profile.controller.js";

// Auth middleware
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// =====================================================
// 📄 AUTH PAGES
// =====================================================

// Render login page
router.get("/login", renderLoginPage);

// Render register page
router.get("/register", renderRegisterPage);

// Render OTP verification page
router.get("/verify-otp", renderOtpPage);

// =====================================================
// 🔐 OTP AUTH ACTIONS
// =====================================================

// Step 1: Send OTP to user's email or phone
router.post("/send-otp", sendOtpForLogin);

// Step 2: Verify the OTP entered by the user
router.post("/verify-otp", verifyOtpLogin);

// Register new user
router.post("/register", registerUser);

// Logout
router.get("/logout", logoutUser);

// =====================================================
// 👤 ACCOUNT & PROFILE
// =====================================================

// Account dashboard page (protected)
router.get("/account", authMiddleware, renderAccountPage);

// Profile update (protected)
router.post("/profile/update", authMiddleware, updateContactInfo);

// ✅ Delete account route has been removed

export default router;