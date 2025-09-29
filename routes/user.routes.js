import express from "express";

// Controllers
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

// Middleware
import { authMiddleware } from "../middlewares/auth.middleware.js";

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

// ===================== ACCOUNT & PROFILE =====================

// Account page (protected)
router.get("/account", authMiddleware, renderAccountPage);

// Update profile (protected)
router.post("/profile/update", authMiddleware, updateContactInfo);

export default router;
