import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// Render Login Page
export const renderLoginPage = (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render("login", { title: "Login", error });
};

// Render Register Page
export const renderRegisterPage = (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render("register", { title: "Register", error });
};

// Login User
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    if (!identifier || !password) {
      req.session.error = "❌ Please enter both username/email and password.";
      return res.redirect("/users/login");
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      req.session.error = "❌ Account not found. Please register first.";
      return res.redirect("/users/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = "❌ Incorrect password.";
      return res.redirect("/users/login");
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    await sendMail(
      user.email,
      "Login Notification",
      `Hello ${user.username},\n\nYou logged in on ${timestamp}.`
    );

    // ✅ Redirect to home page instead of /users/account
    res.redirect("/");

  } catch (err) {
    req.session.error = "❌ Login failed: " + err.message;
    res.redirect("/users/login");
  }
};

// Register User
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const timestamp = new Date().toLocaleString();

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

  if (!usernameRegex.test(username)) {
    req.session.error = "❌ Username must start with a letter and be 3–20 characters.";
    return res.redirect("/users/register");
  }

  if (!email.endsWith("@gmail.com")) {
    req.session.error = "❌ Only Gmail addresses are allowed.";
    return res.redirect("/users/register");
  }

  if (!password || password.length < 6) {
    req.session.error = "❌ Password must be at least 6 characters.";
    return res.redirect("/users/register");
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      req.session.error = "❌ Username or Email already exists!";
      return res.redirect("/users/register");
    }

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
    req.session.error = "❌ Registration failed: " + err.message;
    res.redirect("/users/register");
  }
};

// Render Account Page (optional if needed later)
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
    res.status(500).send("❌ Failed to load account: " + err.message);
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

// Update Contact Info
export const updateContactInfo = async (req, res) => {
  const { phone, address } = req.body;
  const sessionUser = req.session.user;

  if (!sessionUser) return res.redirect("/users/login");

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    req.session.error = "❌ Phone number must be 10 digits.";
    return res.redirect("/users/account");
  }

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
    res.status(500).send("❌ Failed to update info: " + err.message);
  }
};
