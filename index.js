// app.js
import "./db.js"; // ✅ Connect to MongoDB first

import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import path from "path";
import { products } from "./models/product.model.js"; // Product data
import { orders } from "./models/order.model.js";     // Orders data
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));
app.use(loggerMiddleware);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Routes
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/contact", contactRoutes);

// Discounts Page
app.get("/discounts", (req, res) => {
  res.render("discounts", { user: req.session.user });
});

// Future Updates Page
app.get("/future-updates", (req, res) => {
  res.render("futureUpdates", {
    title: "Future Updates",
    user: req.session.user
  });
});

// User Account Dashboard
app.get('/users/account', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  const user = req.session.user;
  const userOrders = orders.filter(order => order.userId === user.id);
  const latestOrder = userOrders[userOrders.length - 1];

  const allBooks = userOrders.flatMap(order =>
    order.items.map(item => item.title)
  );

  const enrichedUser = {
    ...user,
    address: latestOrder?.address || "Not available",
    phone: latestOrder?.phone || "Not available",
    totalOrders: userOrders.length,
    allBooks
  };

  res.render('account', { user: enrichedUser });
});

// Homepage
app.get("/", (req, res) => {
  res.render("home", {
    title: "Online Bookstore",
    user: req.session.user,
    products
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

// Start Server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
