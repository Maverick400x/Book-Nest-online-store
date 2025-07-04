import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// Render Pages
export const renderLoginPage = (req, res) => res.render("login", { title: "Login" });
export const renderRegisterPage = (req, res) => res.render("register", { title: "Register" });

// Traditional Login
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    if (!identifier || !password) return res.send("❌ Please enter both username/email and password.");

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) return res.send("❌ Account not found. Please register first.");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Incorrect password.");

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
    res.status(500).send("❌ Login failed: " + err.message);
  }
};

// Register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const timestamp = new Date().toLocaleString();

  // Validation: username
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
  if (!usernameRegex.test(username)) {
    return res.send("❌ Username must start with a letter and be 3–20 characters long (letters, numbers, underscores only).");
  }

  // Validation: email must be Gmail
  if (!email.endsWith("@gmail.com")) {
    return res.send("❌ Only Gmail addresses are allowed. Please use an email ending with @gmail.com.");
  }

  // Validation: password length
  if (!password || password.length < 6) {
    return res.send("❌ Password must be at least 6 characters long.");
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.send("❌ Username or Email already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    await sendMail(
      email,
      "Welcome to BookNest",
      `Hello ${username},\n\nWelcome to BookNest! 🎉 You registered on: ${timestamp}`
    );

    res.redirect("/users/login");
  } catch (err) {
    res.status(500).send("❌ Registration failed: " + err.message);
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

// Update contact info
export const updateContactInfo = async (req, res) => {
  const { phone, address } = req.body;
  const sessionUser = req.session.user;

  if (!sessionUser) return res.redirect("/users/login");

  // ✅ Phone number validation (10 digits only)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.send("❌ Phone number must be exactly 10 digits.");
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
