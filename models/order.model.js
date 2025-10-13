import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: {
        type: String,
        default: "https://neelkanthpublishers.com/assets/bookcover_cover.png",
      },
    },
  ],
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subtotal: {
    type: String,
    required: true,
  },
  grandTotal: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: String,
    required: true,
  },
  deliveryPartner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Delivered", "Cancelled"],
    default: "Processing",
  },
  // ✅ Payment Fields
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Razorpay", "COD"],
    default: "Razorpay",
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);