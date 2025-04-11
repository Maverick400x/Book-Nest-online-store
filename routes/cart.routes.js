import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.get("/add/:id", authMiddleware, addToCart);  // Ensure it's a GET request
router.get("/remove/:index", authMiddleware, removeFromCart);

export default router;
