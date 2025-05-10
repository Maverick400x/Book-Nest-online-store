import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLoginPage,
  renderRegisterPage,
  renderAccountPage,
  updateContactInfo,
  requestOtpLogin,
  verifyOtp
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/login", renderLoginPage);
router.get("/register", renderRegisterPage);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.get("/account", renderAccountPage);
router.post("/update-info", updateContactInfo);

// OTP-based login routes
router.post("/request-otp", requestOtpLogin);
router.post("/verify-otp", verifyOtp);

export default router;
