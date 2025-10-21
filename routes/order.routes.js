import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  placeOrder,
  getOrders,
  cancelOrder, // ✅ Import cancelOrder
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/place", authMiddleware, placeOrder);

// ✅ Route to cancel an order (same-day only)
router.post("/cancel/:orderId", authMiddleware, cancelOrder);

export default router;