// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: {
        type: String,
        default: "/src/books/default-book.png"
      }
    }
  ],
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  subtotal: {
    type: String,
    required: true
  },
  grandTotal: {
    type: String,
    required: true
  },
  orderDate: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: String,
    required: true
  },
  deliveryPartner: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Delivered", "Cancelled"],
    default: "Processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the Order model
export const Order = mongoose.model("Order", orderSchema);