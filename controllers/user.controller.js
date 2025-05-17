import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// Render Pages
export const renderLoginPage = (req, res) => res.render("login", { title: "Login" });
export const renderRegisterPage = (req, res) => res.render("register", { title: "Register" });

// Traditional Login (added this as it was missing)
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) return res.send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid credentials");

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    await sendMail(
      user.email,
      "Login Notification",
      `Hello ${user.username},\n\nYou logged in on ${timestamp}.\n\nIf this wasn't you, please secure your account.`
    );

    res.redirect("/users/account");
  } catch (err) {
    res.status(500).send("Login failed: " + err.message);
  }
};

// OTP login - Step 1
export const requestOtpLogin = async (req, res) => {
  const { identifier } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) return res.send("User not found!");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = { code: otp, expiresAt: otpExpiry };
    await user.save();

    await sendMail(
  user.email,
  "BookNest Login - Your One-Time Password (OTP)",
  `Hello ${user.username},

  Thank you for choosing BookNest.

  Your One-Time Password (OTP) is: ${otp}
  🔒 This code is valid for the next 5 minutes.

  Please enter this OTP on the verification page to complete your login process.

  If you did not initiate this request, please ignore this email or contact our support team immediately.

  Happy Reading,
  📚 The BookNest Team

  —
  Need help? Reach out to us at support@booknest.com
  `
  );

    res.render("verify-otp", { email: user.email, title: "Verify OTP" });
  } catch (err) {
    res.status(500).send("Failed to send OTP: " + err.message);
  }
};

// OTP login - Step 2
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.send("Invalid or expired OTP!");

    const { code, expiresAt } = user.otp;

    if (Date.now() > expiresAt) return res.send("OTP expired!");
    if (otp !== code) return res.send("Incorrect OTP!");

    user.otp = undefined;
    await user.save();

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    await sendMail(
      user.email,
      "Login Successful",
      `Hello ${user.username},\n\nYou logged in using OTP on ${timestamp}.`
    );

    res.redirect("/users/account");
  } catch (err) {
    res.status(500).send("Failed to verify OTP: " + err.message);
  }
};

// Register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.send("Username or Email already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    await sendMail(
      email,
      "Welcome to BookNest",
      `Hello ${username},\n\nWelcome to BookNest! 🎉 Registered on: ${timestamp}`
    );

    res.redirect("/users/login");
  } catch (err) {
    res.status(500).send("Registration failed: " + err.message);
  }
};

// Render Account Dashboard
export const renderAccountPage = async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  try {
    const dbUser = await User.findById(req.session.user.id);
    if (!dbUser) return res.redirect("/users/login");

    const userOrders = await Order.find({ userId: dbUser._id.toString() }).sort({ _id: -1 });
    const latestOrder = userOrders[0];

    const enrichedUser = {
      id: dbUser._id,
      username: dbUser.username,
      email: dbUser.email,
      address: dbUser.address || latestOrder?.address || "Not available",
      phone: dbUser.phone || latestOrder?.phone || "Not available",
      totalOrders: userOrders.length,
      allBooks: userOrders.flatMap(order => order.items.map(item => item.title))
    };

    req.session.user = enrichedUser;
    res.render("account", { user: enrichedUser });
  } catch (err) {
    res.status(500).send("Failed to load account: " + err.message);
  }
};

// Logout
export const logoutUser = async (req, res) => {
  const user = req.session.user;
  const timestamp = new Date().toLocaleString();

  if (user) {
    await sendMail(
      user.email,
      "Logout Alert",
      `Hello ${user.username},\n\nYou logged out on ${timestamp}.`
    );
  }

  req.session.destroy(() => res.redirect("/"));
};

// Update contact info
export const updateContactInfo = async (req, res) => {
  const { phone, address } = req.body;
  const sessionUser = req.session.user;

  if (!sessionUser) return res.redirect("/users/login");

  try {
    const user = await User.findById(sessionUser.id);
    if (!user) return res.redirect("/users/login");

    user.phone = phone;
    user.address = address;
    await user.save();

    req.session.user.phone = phone;
    req.session.user.address = address;

    res.redirect("/users/account");
  } catch (err) {
    res.status(500).send("Failed to update info: " + err.message);
  }
};
