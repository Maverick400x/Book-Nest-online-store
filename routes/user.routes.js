import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLoginPage,
  renderRegisterPage,
  renderAccountPage,
  updateContactInfo
} from "../controllers/user.controller.js";

import {
  renderForgotPasswordPage,
  renderResetPasswordPage,
  sendResetLink,
  resetPassword
} from "../controllers/password.controller.js"; // assumed you’re adding this controller

const router = express.Router();

// 📄 Auth Pages
router.get("/login", renderLoginPage);
router.get("/register", renderRegisterPage);

// 🔐 Auth Actions
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

// 👤 User Dashboard & Profile
router.get("/account", renderAccountPage);
router.post("/update-info", updateContactInfo);

// 🔑 Password Reset
router.get("/forgot-password", renderForgotPasswordPage);
router.post("/forgot-password", sendResetLink);
router.get("/reset-password/:token", renderResetPasswordPage);
router.post("/reset-password/:token", resetPassword);

export default router;