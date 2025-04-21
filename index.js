import dotenv from "dotenv";
dotenv.config();

import "./db.js"; // MongoDB connection

import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";

import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";

import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { products } from "./models/product.model.js";
import { orders } from "./models/order.model.js";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || "secret-key",
  resave: false,
  saveUninitialized: true
}));
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

// Custom Routes
app.get("/discounts", (req, res) => {
  res.render("discounts", { user: req.session.user });
});

app.get("/future-updates", (req, res) => {
  res.render("futureUpdates", {
    title: "Future Updates",
    user: req.session.user
  });
});

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

app.get("/", (req, res) => {
  res.render("home", {
    title: "Online Bookstore",
    user: req.session.user,
    products
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
