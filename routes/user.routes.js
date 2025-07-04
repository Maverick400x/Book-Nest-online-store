import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLoginPage,
  renderRegisterPage,
  renderAccountPage,
  updateContactInfo
} from "../controllers/user.controller.js"; // Make sure OTP functions are removed from this file too

const router = express.Router();

// Render login and register pages
router.get("/login", renderLoginPage);
router.get("/register", renderRegisterPage);

// Auth actions
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

// Dashboard and profile updates
router.get("/account", renderAccountPage);
router.post("/update-info", updateContactInfo);

export default router;
