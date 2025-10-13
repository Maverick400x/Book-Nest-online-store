// utils/weeklyMetricsMailer.js
import cron from "node-cron";
import { Order } from "../models/order.model.js";
import { sendMail } from "./mailer.js";

// 📬 Weekly Metrics Email
export const sendWeeklyMetrics = () => {
  // Schedule cron: Every Monday at 9:00 AM
  // Format: "minute hour day-of-month month day-of-week"
  cron.schedule("0 9 * * 1", async () => {
    try {
      const today = new Date().toDateString();
      console.log(`📊 Sending weekly user metrics - ${today}`);

      // Fetch all users from your User model
      const users = await import("../models/user.model.js").then(m => m.User.find());

      for (const user of users) {
        const userOrders = await Order.find({ userId: user._id });

        const metrics = {
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((acc, o) => acc + (o.grandTotal ? parseFloat(o.grandTotal) : 0), 0),
          deliveredOrders: userOrders.filter(o => o.status === "Delivered").length,
          cancelledOrders: userOrders.filter(o => o.status === "Cancelled").length,
          processingOrders: userOrders.filter(o => o.status === "Processing").length,
        };

        const plainText = `
Hello ${user.username},

Here is your weekly BookNest summary for ${today}:

📦 Total Orders: ${metrics.totalOrders}
💰 Total Spent: ₹${metrics.totalSpent.toFixed(2)}
✅ Delivered Orders: ${metrics.deliveredOrders}
❌ Cancelled Orders: ${metrics.cancelledOrders}
⏳ Processing Orders: ${metrics.processingOrders}

Thank you for shopping with us!
— Team BookNest
        `.trim();

        const html = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:8px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
    <h2 style="color:#1e81b0;">📊 Weekly Metrics</h2>
    <p><strong>Date:</strong> ${today}</p>
  </div>
  <p>Hi <strong>${user.username}</strong>,</p>
  <p>Here is your weekly BookNest summary:</p>
  <ul>
    <li>📦 Total Orders: ${metrics.totalOrders}</li>
    <li>💰 Total Spent: ₹${metrics.totalSpent.toFixed(2)}</li>
    <li>✅ Delivered Orders: ${metrics.deliveredOrders}</li>
    <li>❌ Cancelled Orders: ${metrics.cancelledOrders}</li>
    <li>⏳ Processing Orders: ${metrics.processingOrders}</li>
  </ul>
  <p>Thank you for shopping with us!<br><strong>— Team BookNest</strong></p>
</div>
        `;

        await sendMail(
          user.email,
          `📊 Your Weekly BookNest Metrics - ${today}`,
          plainText,
          html
        );

        console.log(`✅ Weekly metrics sent to ${user.email}`);
      }

    } catch (err) {
      console.error("❌ Error sending weekly metrics:", err);
    }
  });
};