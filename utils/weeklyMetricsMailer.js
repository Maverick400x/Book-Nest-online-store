// utils/weeklyMetricsMailer.js
import cron from "node-cron";
import { Order } from "../models/order.model.js";
import { sendMail } from "./mailer.js";
import { User } from "../models/user.model.js";

// 📬 Weekly Metrics Email (Every Monday, 9:00 AM IST)
export const sendWeeklyMetrics = () => {
  cron.schedule(
    "0 9 * * 1",
    async () => {
      const today = new Date().toDateString();
      console.log(`📊 [BookNest] Sending weekly metrics — ${today}`);

      try {
        const users = await User.find({}, "email username");
        if (!users.length) {
          console.log("⚠️ No users found for metrics mailing.");
          return;
        }

        for (const user of users) {
          const userOrders = await Order.find({ userId: user._id });

          // Compute key metrics
          const metrics = {
            totalOrders: userOrders.length,
            totalSpent: userOrders.reduce(
              (sum, order) => sum + (parseFloat(order.grandTotal) || 0),
              0
            ),
            deliveredOrders: userOrders.filter(o => o.status === "Delivered").length,
            cancelledOrders: userOrders.filter(o => o.status === "Cancelled").length,
            processingOrders: userOrders.filter(o => o.status === "Processing").length,
          };

          // Plain text format (for fallback)
          const plainText = `
Hello ${user.username},

Here’s your weekly BookNest summary for ${today}:

📦 Total Orders: ${metrics.totalOrders}
💰 Total Spent: ₹${metrics.totalSpent.toFixed(2)}
✅ Delivered Orders: ${metrics.deliveredOrders}
❌ Cancelled Orders: ${metrics.cancelledOrders}
⏳ Processing Orders: ${metrics.processingOrders}

Thank you for being a part of BookNest!
— Team BookNest
          `.trim();

          // Rich HTML email
          const html = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; padding:20px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
    <h2 style="color:#1e81b0;">📊 Weekly Purchase Summary</h2>
    <p><strong>${today}</strong></p>
  </div>

  <p>Hi <strong>${user.username}</strong>,</p>
  <p>Here’s your personalized weekly summary:</p>

  <ul style="line-height:1.8;">
    <li>📦 <strong>Total Orders:</strong> ${metrics.totalOrders}</li>
    <li>💰 <strong>Total Spent:</strong> ₹${metrics.totalSpent.toFixed(2)}</li>
    <li>✅ <strong>Delivered Orders:</strong> ${metrics.deliveredOrders}</li>
    <li>❌ <strong>Cancelled Orders:</strong> ${metrics.cancelledOrders}</li>
    <li>⏳ <strong>Processing Orders:</strong> ${metrics.processingOrders}</li>
  </ul>

  <p style="margin-top:20px;">Thank you for being part of the <strong>BookNest family</strong>! 💙</p>
  <p>Visit your account to track orders: 
    <a href="https://fictional-dollop-book-qow7.vercel.app/profile" target="_blank" style="color:#1e81b0;">View Profile</a>
  </p>

  <p style="margin-top:25px;">Warm regards,<br><strong>Team BookNest</strong></p>
</div>
          `;

          try {
            await sendMail(
              user.email,
              `📊 Your Weekly BookNest Summary - ${today}`,
              plainText,
              html
            );
            console.log(`✅ Weekly metrics sent to ${user.email}`);
          } catch (mailErr) {
            console.error(`❌ Failed to send to ${user.email}:`, mailErr.message);
          }
        }
      } catch (err) {
        console.error("❌ Error during weekly metrics job:", err.message);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // ensures Monday 9:00 AM IST
    }
  );
};
