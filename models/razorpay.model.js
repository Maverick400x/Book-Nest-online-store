// models/razorpay.model.js
import mongoose from "mongoose";

const razorpayOrderSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  amount: { type: Number, required: true }, // In paise
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

export const RazorpayOrder = mongoose.model("RazorpayOrder", razorpayOrderSchema);