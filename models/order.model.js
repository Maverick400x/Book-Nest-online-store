import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      title: String,
      price: Number,
    },
  ],
  address: String,
  phone: String,
  subtotal: String,
  gst: String,
  shipping: Number,
  grandTotal: String,
  deliveryDate: String,
  deliveryPartner: String,
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", orderSchema);
