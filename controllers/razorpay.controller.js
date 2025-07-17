import Razorpay from "razorpay";
import { RazorpayOrder } from "../models/razorpayOrder.model.js";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create QR Payment Link
export const createQRPaymentLink = async (req, res) => {
  const { amount, customer, userId, phone, address } = req.body;

  try {
    // Check if amount is in rupees; Razorpay expects paise
    const amountInPaise = Math.round(parseFloat(amount) * 100); // Convert to paise safely

    const paymentLink = await razorpay.paymentLink.create({
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: "BookNest Purchase via QR",
      customer: {
        name: customer?.name,
        contact: customer?.phone,
        email: customer?.email
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true
    });

    // Save in database (still storing in rupees for clarity)
    const newOrder = new RazorpayOrder({
      razorpay_order_id: paymentLink.id,
      amount: parseFloat(amount), // Save as rupees
      userId,
      phone,
      address,
      status: "created"
    });

    await newOrder.save();

    res.json({
      success: true,
      link: paymentLink.short_url,
      id: paymentLink.id
    });

  } catch (error) {
    console.error("❌ Razorpay QR Payment Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};