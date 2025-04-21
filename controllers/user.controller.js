import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// Render Pages
export const renderLoginPage = (req, res) => res.render("login", { title: "Login" });
export const renderRegisterPage = (req, res) => res.render("register", { title: "Register" });

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
      "Welcome to Online Bookstore",
      `Hello ${username},\n\nWelcome to Online Bookstore! 🎉\nRegistered on: ${timestamp}\n\nWe're excited to have you on board. Explore our vast collection of books, enjoy exclusive discounts, and discover amazing deals!\n\nIf you have any questions or need assistance, feel free to reach out to our support team.\n\nHappy reading!\nThe Online Bookstore Team`
    );

    res.redirect("/users/login");
  } catch (err) {
    res.status(500).send("Registration failed: " + err.message);
  }
};

// Login
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      if (identifier.includes("@")) {
        await sendMail(
          identifier,
          "Failed Login Attempt",
          `Hello,\n\nFailed login attempt on ${timestamp}`
        );
      }
      return res.send("Invalid credentials!");
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    await sendMail(
      user.email,
      "Login Alert",
      `Hello ${user.username},\n\nYou just logged in on ${timestamp}.\n\nIf this was you, no action is needed. However, if you did not log in, please secure your account immediately by changing your password.\n\nStay safe!\nOnline Bookstore`
    );

    res.redirect("/users/account");
  } catch (err) {
    res.status(500).send("Login failed: " + err.message);
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
      `Hello ${user.username},\n\nYou logged out on ${timestamp}.\n\nIf this was not you, please change your password immediately.\n\nThanks for using Online Bookstore!`
    );
  }

  req.session.destroy(() => res.redirect("/"));
};

// Update contact info (phone & address)
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
