import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// ======================= AUTH =======================

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
      req.session.error = "❌ Account not found. Please register.";
      return res.redirect("/users/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = "❌ Incorrect password.";
      return res.redirect("/users/login");
    }

    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address
    };

    // Send login email
    await sendMail(
      user.email,
      "📥 Login Notification",
      `Hello ${user.username},\n\nYou logged in on ${timestamp}.`
    );

    res.redirect("/");
  } catch (err) {
    req.session.error = "❌ Login failed: " + err.message;
    res.redirect("/users/login");
  }
};

// Register User
export const registerUser = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  const timestamp = new Date().toLocaleString();
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

  if (!fullName || fullName.trim().length < 3) {
    req.session.error = "❌ Full name must be at least 3 characters.";
    return res.redirect("/users/register");
  }

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
      req.session.error = "❌ Username or Email already exists.";
      return res.redirect("/users/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, username, email, password: hashedPassword });

    await newUser.save();

    await sendMail(
      email,
      "🎉 Welcome to BookNest!",
      `Hello ${username},\n\nThanks for registering on ${timestamp}. Enjoy shopping with BookNest!`
    );

    res.redirect("/users/login");
  } catch (err) {
    req.session.error = "❌ Registration failed: " + err.message;
    res.redirect("/users/register");
  }
};

// ======================= ACCOUNT =======================

// Render Account Page
export const renderAccountPage = async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  try {
    const dbUser = await User.findById(req.session.user.id);
    if (!dbUser) return res.redirect("/users/login");

    const orders = await Order.find({ userId: dbUser._id }).sort({ _id: -1 });
    const latestOrder = orders[0];

    const enrichedUser = {
      id: dbUser._id,
      fullName: dbUser.fullName || "Not provided",
      username: dbUser.username,
      email: dbUser.email,
      address: dbUser.address || latestOrder?.address || "Not provided",
      phone: dbUser.phone || latestOrder?.phone || "Not provided",
      totalOrders: orders.length,
      allBooks: orders.flatMap(order => order.items.map(item => item.title))
    };

    req.session.user = enrichedUser;

    res.render("account", { user: enrichedUser });
  } catch (err) {
    res.status(500).send("❌ Failed to load account: " + err.message);
  }
};

// ======================= PROFILE UPDATE =======================

// Update Contact Info (AJAX)
export const updateContactInfo = async (req, res) => {
  const { fullName, username, phone, address } = req.body;
  const sessionUser = req.session.user;

  if (!sessionUser) {
    return res.status(401).json({ message: "❌ Unauthorized. Please log in." });
  }

  const trimmedFullName = fullName?.trim();
  const trimmedUsername = username?.trim();

  if (!trimmedFullName || trimmedFullName.length < 3 || trimmedFullName.length > 50) {
    return res.status(400).json({ message: "❌ Full name must be 3–50 characters." });
  }

  if (!trimmedUsername || trimmedUsername.length > 20) {
    return res.status(400).json({ message: "❌ Username must be 1–20 characters." });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "❌ Phone number must be exactly 10 digits." });
  }

  try {
    if (trimmedUsername !== sessionUser.username) {
      const existing = await User.findOne({ username: trimmedUsername });
      if (existing) {
        return res.status(400).json({ message: "❌ Username is already taken." });
      }
    }

    const user = await User.findById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }

    user.fullName = trimmedFullName;
    user.username = trimmedUsername;
    user.phone = phone;
    user.address = address;
    await user.save();

    // Update session
    req.session.user.fullName = trimmedFullName;
    req.session.user.username = trimmedUsername;
    req.session.user.phone = phone;
    req.session.user.address = address;

    return res.status(200).json({ message: "✅ Info updated successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "❌ Update failed: " + err.message });
  }
};

// ======================= LOGOUT =======================

// Logout User
export const logoutUser = async (req, res) => {
  const user = req.session.user;
  const timestamp = new Date().toLocaleString();

  if (user) {
    await sendMail(
      user.email,
      "📤 Logout Alert",
      `Hello ${user.username},\n\nYou logged out on ${timestamp}.`
    );
  }

  req.session.destroy(() => res.redirect("/"));
};