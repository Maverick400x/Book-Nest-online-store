// utils/storeUpdatesMailer.js
import cron from "node-cron";
import { User } from "../models/user.model.js";
import { sendMail } from "./mailer.js";

// 📬 Store Updates Email
export const sendStoreUpdates = () => {
  // Weekly on Friday at 11:00 AM
  cron.schedule("0 11 * * 5", async () => {
    const today = new Date().toDateString();
    console.log(`📬 Sending store updates - ${today} 11:00 AM`);

    try {
      const users = await User.find();
      if (!users.length) return console.log("⚠️ No users found.");

      for (const user of users) {
        try {
          const plainText = `
Hello ${user.username},

Exciting news from BookNest this week! 🎉

✨ Upcoming Discounts & Offers:
- Get up to 30% off on select bestsellers.
- Special bundle deals for popular categories.
- Limited-time flash sales coming soon!

📚 Other Insights:
- Check out our new arrivals and trending books.
- Earn reward points for every purchase this week.
- Stay tuned for exclusive members-only deals.

Visit our store now to grab these offers before they're gone!

— Team BookNest
          `.trim();

          const html = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:8px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
    <h2 style="color:#1e81b0;">📢 Store Updates</h2>
    <p><strong>Date:</strong> ${today}</p>
  </div>
  <p>Hi <strong>${user.username}</strong>,</p>
  <p>Exciting news from BookNest this week! 🎉</p>

  <h3>✨ Upcoming Discounts & Offers:</h3>
  <ul>
    <li>Get up to 30% off on select bestsellers.</li>
    <li>Special bundle deals for popular categories.</li>
    <li>Limited-time flash sales coming soon!</li>
  </ul>

  <h3>📚 Other Insights:</h3>
  <ul>
    <li>Check out our new arrivals and trending books.</li>
    <li>Earn reward points for every purchase this week.</li>
    <li>Stay tuned for exclusive members-only deals.</li>
  </ul>

  <p>Visit our store now to grab these offers before they're gone!</p>

  <p style="margin-top:20px;">— Team BookNest</p>
</div>
          `;

          await sendMail(
            user.email,
            `📢 BookNest Store Updates - ${today}`,
            plainText,
            html
          );

          console.log(`✅ Store updates sent to ${user.email}`);
        } catch (userErr) {
          console.error(`❌ Failed to send email to ${user.email}:`, userErr);
        }
      }

    } catch (err) {
      console.error("❌ Error fetching users or sending emails:", err);
    }
  });
};