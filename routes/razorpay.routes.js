// routes/razorpay.routes.js
import express from "express";
import { razorpayInstance } from "../utils/razorpay.js";
import { RazorpayOrder } from "../models/razorpay.model.js";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount, userId, phone, address } = req.body;

  if (!amount || !userId) {
    return res.status(400).json({ success: false, message: "Amount and userId are required." });
  }

  const options = {
    amount: amount * 100, // Convert ₹ to paise
    currency: "INR",
    receipt: `rcpt_${Math.floor(Math.random() * 1000000)}`,
    payment_capture: 1
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newRazorpayOrder = new RazorpayOrder({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: "created",
      userId,
      phone,
      address
    });

    await newRazorpayOrder.save();

    res.json({
      success: true,
      order: razorpayOrder
    });

  } catch (err) {
    console.error("❌ Razorpay Create Order Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message
    });
  }
});

export default router;