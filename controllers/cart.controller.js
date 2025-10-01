import { cart } from "../models/cart.model.js";
import { products } from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Add product to cart
export const addToCart = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    cart.push(product);
    console.log(`Added to cart: ${product.title}`);
  } else {
    console.log("Product not found.");
  }

  res.redirect("/cart");
};

// Get cart page
export const getCart = async (req, res) => {
  const user = req.session.user;
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0) * 100;

  let razorpayOrder = null;

  if (totalAmount > 0) {
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`
      });
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
    }
  }

  res.render("cart", {
    title: "Shopping Cart",
    cart,
    user,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
    razorpayOrder
  });
};

// Remove item from cart
export const removeFromCart = (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1);
    console.log(`Removed from cart: ${removed[0]?.title}`);
  } else console.log("Invalid index for cart removal.");

  res.redirect("/cart");
};

// Verify payment & place order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, phone, address } = req.body;

    // Verify Razorpay signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                               .update(sign)
                               .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // ✅ Payment verified → Place order
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const grandTotal = subtotal;

    const orderDate = new Date().toDateString();
    const deliveryDays = Math.floor(Math.random() * 5) + 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const deliveryPartners = ["BlueDart", "FedEx", "DTDC", "Delhivery", "Ecom Express"];
    const deliveryPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

    const order = new Order({
      userId: req.session.user.id,
      items: [...cart],
      address,
      phone,
      subtotal: subtotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      orderDate,
      deliveryDate: deliveryDate.toDateString(),
      deliveryPartner,
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "Processing"
    });

    await order.save();
    cart.length = 0; // clear cart

    // Send order confirmation email with detailed summary
    const { email, username } = req.session.user;
    if (email) {
      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height: 50px;">
          <h2 style="color: #28a745; margin-top: 10px;">Order Confirmed</h2>
        </div>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for your order placed on <strong>${new Date().toLocaleString()}</strong>.</p>

        <h3 style="color: #333;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Book</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p><strong>Total: ₹${order.grandTotal}</strong></p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

        <h3 style="color: #333;">Delivery Details</h3>
        <p>
          📍 <strong>Address:</strong> ${address}<br>
          📞 <strong>Phone:</strong> ${phone}<br>
          🚚 <strong>Partner:</strong> ${deliveryPartner}<br>
          📅 <strong>Expected Delivery:</strong> ${order.deliveryDate}
        </p>

        <p style="margin-top: 20px;">Thanks for shopping with us!<br><strong>— Team BookNest</strong></p>
      </div>
      `;

      const plainText = `
Hello ${username},

Thank you for your order placed on ${new Date().toLocaleString()}.

Order Summary:
${order.items.map(item => `- ${item.title} (₹${item.price})`).join("\n")}

Total: ₹${order.grandTotal}
Payment Method: ${order.paymentMethod}

Delivery Details:
Address: ${address}
Phone: ${phone}
Partner: ${deliveryPartner}
Expected Delivery: ${order.deliveryDate}

Thanks for shopping with us!
— Team BookNest
      `;

      await sendMail(
        email,
        `📦 Order #${order._id} Confirmed - BookNest`,
        plainText,
        html
      );
    }

    console.log(`✅ Order placed: ${order._id}`);
    res.json({ success: true, orderId: order._id });

  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};