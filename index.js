import dotenv from "dotenv";
dotenv.config();

import "./db.js"; // MongoDB connection

import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";

// Routes
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";

// Middlewares
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

// Models
import { products } from "./models/product.model.js";
import { Order } from "./models/order.model.js";

// Cron Jobs
import { sendWeeklyMetrics } from "./utils/weeklyMetricsMailer.js";
import { sendStoreUpdates } from "./utils/storeUpdatesMailer.js";

const app = express();

// ========================
// Middlewares
// ========================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(loggerMiddleware);

// ========================
// View Engine
// ========================
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// ========================
// Routes
// ========================
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/contact", contactRoutes);

// Custom Pages
app.get("/discounts", (req, res) => {
  res.render("discounts", { user: req.session.user });
});

app.get("/future-updates", (req, res) => {
  res.render("futureUpdates", {
    title: "Future Updates",
    user: req.session.user,
  });
});

// User Account Page
app.get("/users/account", async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  const user = req.session.user;
  const userOrders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
  const latestOrder = userOrders[userOrders.length - 1];

  const allBooks = userOrders.flatMap((order) =>
    order.items.map((item) => item.title)
  );

  const enrichedUser = {
    ...user,
    address: latestOrder?.address || "Not available",
    phone: latestOrder?.phone || "Not available",
    totalOrders: userOrders.length,
    allBooks,
  };

  res.render("account", { user: enrichedUser });
});

// Home Page
app.get("/", (req, res) => {
  res.render("home", {
    title: "Online Bookstore",
    user: req.session.user,
    products,
  });
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});

// ========================
// Cron Jobs
// ========================
sendWeeklyMetrics(); // Weekly metrics for all users (cron inside the module)
sendStoreUpdates();   // Store updates for all users (cron inside the module)

// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);