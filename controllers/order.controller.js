// controllers/order.controller.js
import { Order } from "../models/order.model.js";
import { cart } from "../models/cart.model.js";
import { sendMail } from "../utils/mailer.js";

// 📦 PLACE AN ORDER
export const placeOrder = async (req, res) => {
  try {
    if (!cart.length) return res.redirect("/cart");

    const { address, phone } = req.body;
    const timestamp = new Date().toLocaleString();
    const orderDate = new Date().toDateString();

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const grandTotal = subtotal.toFixed(2);

    const deliveryDays = Math.floor(Math.random() * 5) + 3; // random 3–7 days
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
      grandTotal,
      orderDate,
      deliveryDate: deliveryDate.toDateString(),
      deliveryPartner,
      status: "Processing",
    });

    await order.save();
    cart.length = 0; // clear cart

    const { email, username } = req.session.user;
    if (email) {
      const plainText = `
Hello ${username},

Thank you for your order placed on ${timestamp}.

Order Summary:
${order.items.map(item => `- ${item.title} (₹${item.price})`).join("\n")}

Total: ₹${order.grandTotal}

Delivery Details:
📍 Address: ${address}
📞 Phone: ${phone}
🚚 Partner: ${deliveryPartner}
📅 Expected Delivery: ${order.deliveryDate}

Thanks for shopping with us!
— Team BookNest
      `.trim();

      const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:8px;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
          <h2 style="color:#28a745; margin-top:10px;">✅ Order Confirmed</h2>
        </div>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for your order placed on <strong>${timestamp}</strong>.</p>

        <h3 style="color:#333;">📦 Order Summary</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd; padding:8px;">Book</th>
              <th style="border:1px solid #ddd; padding:8px;">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="border:1px solid #ddd; padding:8px;">${item.title}</td>
                <td style="border:1px solid #ddd; padding:8px;">₹${item.price}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p><strong>Total: ₹${order.grandTotal}</strong></p>

        <h3 style="color:#333;">🚚 Delivery Details</h3>
        <p>
          📍 <strong>Address:</strong> ${address}<br>
          📞 <strong>Phone:</strong> ${phone}<br>
          🚚 <strong>Partner:</strong> ${deliveryPartner}<br>
          📅 <strong>Expected Delivery:</strong> ${order.deliveryDate}
        </p>

        <p style="margin-top:20px;">Thanks for shopping with us!<br><strong>— Team BookNest</strong></p>
      </div>
      `;

      await sendMail(
        email,
        `📦 Order #${order._id} Confirmed - BookNest`,
        plainText,
        html
      );
    }

    console.log(`✅ Order placed: ${order._id}`);
    res.redirect("/orders");
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).send("Failed to place the order: " + err.message);
  }
};

// 📄 GET ALL ORDERS FOR CURRENT USER
export const getOrders = async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
    const today = new Date();

    // Auto-update status if delivery date passed
    for (let order of userOrders) {
      const delivery = new Date(order.deliveryDate);
      if (order.status === "Processing" && delivery < today) {
        order.status = "Delivered";
        await order.save();
      }
    }

    res.render("orders", {
      title: "Your Orders",
      orders: userOrders,
      user: req.session.user,
      today: today.toDateString(),
    });
  } catch (err) {
    console.error("❌ Error loading orders:", err);
    res.status(500).send("Failed to load orders: " + err.message);
  }
};

// ❌ CANCEL ORDER (Same-day Only)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId: req.session.user.id });

    if (!order) return res.status(404).send("Order not found.");

    const today = new Date().toDateString();
    if (order.orderDate !== today)
      return res.status(400).send("❌ You can only cancel orders on the same day of purchase.");

    if (order.status !== "Processing")
      return res.status(400).send("❌ Only processing orders can be cancelled.");

    order.status = "Cancelled";
    await order.save();

    const { email, username } = req.session.user;
    if (email) {
      const plainText = `
Hello ${username},

Your order placed on ${order.orderDate} with Order ID ${order._id} has been cancelled successfully.

Order Summary:
${order.items.map(item => `- ${item.title} (₹${item.price})`).join("\n")}

Total Refunded: ₹${order.grandTotal}  
Refund will be processed within 3-5 business days.  

Thank you for choosing BookNest!
— Team BookNest
      `.trim();

      const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:8px;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
          <h2 style="color:red; margin-top:10px;">❌ Order Cancelled</h2>
        </div>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Your order placed on <strong>${order.orderDate}</strong> with <strong>Order ID:</strong> ${order._id} has been <span style="color:red;"><strong>cancelled</strong></span>.</p>

        <h3 style="color:#333;">📦 Order Summary</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd; padding:8px;">Book</th>
              <th style="border:1px solid #ddd; padding:8px;">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="border:1px solid #ddd; padding:8px;">${item.title}</td>
                <td style="border:1px solid #ddd; padding:8px;">₹${item.price}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top:20px;"><strong>Total Refunded:</strong> ₹${order.grandTotal}</p>
        <p>Refund will be processed within 3-5 business days.</p>
        <p style="margin-top:20px;">— Team BookNest</p>
      </div>
      `;

      await sendMail(
        email,
        `❌ Order #${order._id} Cancelled - BookNest`,
        plainText,
        html
      );
    }

    console.log(`❌ Order cancelled: ${order._id}`);
    res.redirect("/orders");
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    res.status(500).send("Failed to cancel order: " + err.message);
  }
};