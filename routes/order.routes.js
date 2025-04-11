import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { placeOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/place", authMiddleware, placeOrder); // ✅ Ensure POST request for checkout

export default router;
