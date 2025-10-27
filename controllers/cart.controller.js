import { cart } from "../models/cart.model.js";
import { products } from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { sendMail } from "../utils/mailer.js";

// =================== Razorpay Instance ===================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =================== ADD PRODUCT TO CART ===================
export const addToCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      console.log(`🛒 Added to cart: ${product.title}`);
    } else {
      console.log("❌ Product not found.");
    }

    res.redirect("/cart");
  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).send("Error adding to cart.");
  }
};

// =================== GET CART PAGE ===================
export const getCart = async (req, res) => {
  try {
    const user = req.session.user;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) * 100;

    let razorpayOrder = null;
    if (totalAmount > 0) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: totalAmount,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`
        });
      } catch (err) {
        console.error("❌ Error creating Razorpay order:", err);
      }
    }

    res.render("cart", {
      title: "Shopping Cart",
      cart,
      user,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      razorpayOrder
    });
  } catch (err) {
    console.error("❌ getCart error:", err);
    res.status(500).send("Failed to load cart.");
  }
};

// =================== REMOVE ITEM FROM CART ===================
export const removeFromCart = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1);
      console.log(`🗑️ Removed from cart: ${removed[0]?.title}`);
    } else {
      console.log("❌ Invalid index for cart removal.");
    }

    res.redirect("/cart");
  } catch (err) {
    console.error("❌ removeFromCart error:", err);
    res.status(500).send("Error removing from cart.");
  }
};

// =================== HELPER: ORDER SUMMARY TABLE (CONFIRMATION) ===================
const generateOrderTableHtml = (items) => {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: left;">Book</th>
          <th style="border-bottom: 1px solid #eee; text-align: center;">Qty</th>
          <th style="border-bottom: 1px solid #eee; text-align: right;">Price (₹)</th>
          <th style="border-bottom: 1px solid #eee; text-align: right;">Subtotal (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const qty = item.quantity || 1;
          const subtotalItem = (item.price * qty).toFixed(2);
          return `
            <tr>
              <td style="padding: 8px 0;">${item.title}</td>
              <td style="text-align: center;">${qty}</td>
              <td style="text-align: right;">₹${item.price}</td>
              <td style="text-align: right; font-weight: bold;">₹${subtotalItem}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
};

// =================== HELPER: CANCELLED ORDER TABLE ===================
const generateCancellationTableHtml = (items) => {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #eee; text-align: left;">Item (Cancelled)</th>
          <th style="border-bottom: 1px solid #eee; text-align: right;">Refund (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const subtotalItem = (item.price * (item.quantity || 1)).toFixed(2);
          return `
            <tr>
              <td style="padding: 8px 0;">${item.title}</td>
              <td style="text-align: right; font-weight: bold;">₹${subtotalItem}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
};

// =================== VERIFY PAYMENT & PLACE ORDER ===================
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, phone, address } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("❌ Payment verification failed.");
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
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
    cart.length = 0;

    const { email, username } = req.session.user;
    if (email) {
      const orderTableHtml = generateOrderTableHtml(order.items);
      const logo = "https://book-nest-wgrp.onrender.com/src/logo.png";

      const html = `
      <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${logo}" alt="BookNest Logo" style="height: 40px; margin-bottom: 10px;">
          <div style="color: #28a745; font-size: 20px; font-weight: bold;">✅ Order Confirmed</div>
        </div>
        
        <p>Hi <strong>${username}</strong>,</p>
        <p>Your order placed on <strong>${new Date().toLocaleString()}</strong> is confirmed.</p>

        <h3>📦 Order Summary</h3>
        ${orderTableHtml}

        <p><strong>Total:</strong> ₹${order.grandTotal}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

        <h3>🚚 Delivery Details</h3>
        <p>
          📍 Address: ${address}<br>
          📞 Phone: ${phone}<br>
          🚚 Partner: ${deliveryPartner}<br>
          📅 Expected Delivery: ${order.deliveryDate}
        </p>

        <p style="text-align:center;">Thanks for shopping with us!<br><strong>— Team BookNest</strong></p>
      </div>
      `;

      const plainText = `
Hello ${username},

Your order placed on ${new Date().toLocaleString()} is confirmed.

Order Summary:
${order.items.map(item => `- ${item.title} | ₹${item.price} x ${item.quantity || 1}`).join("\n")}

Total: ₹${order.grandTotal}
Payment Method: ${order.paymentMethod}
Expected Delivery: ${order.deliveryDate}

Thank you for shopping with BookNest!
— Team BookNest
      `;

      await sendMail(email, `📦 Order #${order._id} Confirmed - BookNest`, plainText, html);
    }

    console.log(`✅ Order placed successfully: ${order._id}`);
    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// =================== CANCEL ORDER ===================
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = {
      _id: orderId,
      items: [
        { title: "Justice League: Origin", price: 880, quantity: 1 },
        { title: "Superman: Red Son", price: 940, quantity: 1 }
      ],
      grandTotal: (880 + 940).toFixed(2),
      orderDate: 'Oct 04 2025',
      paymentMethod: 'Razorpay'
    };

    const { email, username } = req.session.user;
    if (email) {
      const subject = `❌ Order #${order._id} Cancelled - BookNest`;
      const cancellationTableHtml = generateCancellationTableHtml(order.items);
      const logo = "https://book-nest-wgrp.onrender.com/src/logo.png";

      const html = `
      <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${logo}" alt="BookNest Logo" style="height: 40px; margin-bottom: 10px;">
          <div style="color: #dc3545; font-size: 20px; font-weight: bold;">❌ Order Cancelled</div>
        </div>

        <p>Hello <strong>${username}</strong>,</p>
        <p>Your order placed on <strong>${order.orderDate}</strong> (Order ID: <strong>${order._id}</strong>) has been cancelled successfully.</p>

        <h3>📋 Refund Summary</h3>
        ${cancellationTableHtml}

        <p><strong>Total Refunded:</strong> ₹${order.grandTotal}</p>
        <p>Refund will be processed within 3–5 business days.</p>

        <p style="text-align:center;">Thank you for choosing BookNest.<br><strong>— Team BookNest</strong></p>
      </div>
      `;

      const plainText = `
Hello ${username},

Your order placed on ${order.orderDate} (Order ID: ${order._id}) has been cancelled.

Refund Summary:
${order.items.map(item => `- ${item.title} (₹${item.price})`).join("\n")}
Total Refunded: ₹${order.grandTotal}
Refund will be processed within 3–5 business days.

Thank you for choosing BookNest!
— Team BookNest
      `;

      await sendMail(email, subject, plainText, html);
    }

    console.log(`❌ Order cancelled successfully: ${orderId}`);
    res.json({ success: true, message: `Order ${orderId} cancelled successfully and email sent.` });
  } catch (err) {
    console.error("❌ cancelOrder error:", err);
    res.status(500).json({ success: false, message: "Could not cancel order due to an internal error." });
  }
};
