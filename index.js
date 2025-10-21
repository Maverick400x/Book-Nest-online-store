import dotenv from "dotenv";
dotenv.config();

import "./db.js"; // MongoDB connection
import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { sendMail } from "./utils/mailer.js";

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

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // secure cookie in prod
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(loggerMiddleware);

// Passport Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 12);

          user = new User({
            fullName: profile.displayName,
            username: email.split("@")[0],
            email,
            password: hashedPassword,
            isVerified: true,
            googleId: profile.id,
          });

          await user.save();

          // Send Welcome Email asynchronously
          setImmediate(async () => {
            try {
              const text = `Hello ${user.fullName}, welcome to BookNest! You logged in using Google.`;
              const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; line-height: 1.6;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://book-nest-wgrp.onrender.com/logo.png" alt="BookNest Logo" style="height: 60px;">
                    <h2 style="color: #333;">🎉 Welcome to <strong>BookNest</strong>, ${user.fullName}!</h2>
                  </div>
                  <p>Welcome back! You logged in using your Google account.</p>
                  <p style="margin-top: 20px;">Best regards,<br><strong>— Team BookNest</strong></p>
                </div>
              `;
              await sendMail(user.email, "🎉 Welcome to BookNest", text, html);
            } catch (err) {
              console.error("Google login email failed:", err);
            }
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Global template variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});

// Routes
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/contact", contactRoutes);

// Google OAuth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    if (!req.user) return res.redirect("/users/login");

    req.session.user = {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      username: req.user.username,
    };
    res.redirect("/");
  }
);

// User Account Page
app.get("/users/account", async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  const user = req.session.user;
  const userOrders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
  const latestOrder = userOrders[userOrders.length - 1];

  const allBooks = userOrders.flatMap(order =>
    order.items.map(item => item.title)
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

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
