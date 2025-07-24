import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  removeFromCart
} from "../controllers/cart.controller.js";

const router = express.Router();

// View Cart Page
router.get("/", authMiddleware, getCart);

// Add product to cart
router.get("/add/:id", authMiddleware, addToCart);

// Remove product from cart
router.get("/remove/:index", authMiddleware, removeFromCart);

export default router;