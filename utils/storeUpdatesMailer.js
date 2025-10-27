// utils/storeUpdatesMailer.js
import cron from "node-cron";
import { User } from "../models/user.model.js";
import { sendMail } from "./mailer.js";

// 📬 Schedule: Weekly every Friday at 11:00 AM
export const sendStoreUpdates = () => {
  cron.schedule(
    "0 11 * * 5",
    async () => {
      const today = new Date().toDateString();
      console.log(`📬 [BookNest] Sending store updates — ${today} (11:00 AM)`);

      try {
        const users = await User.find({}, "email username"); // fetch only needed fields
        if (!users.length) {
          console.log("⚠️ No registered users found.");
          return;
        }

        for (const user of users) {
          const plainText = `
Hello ${user.username},

Exciting news from BookNest this week! 🎉

✨ Upcoming Discounts & Offers:
- Up to 30% off on select bestsellers.
- Special bundle deals for popular categories.
- Limited-time flash sales coming soon!

📚 Other Insights:
- Explore new arrivals and trending books.
- Earn reward points for every purchase this week.
- Stay tuned for exclusive members-only deals.

Visit our store now to grab these offers before they're gone!

— Team BookNest
          `.trim();

          const html = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:8px;">
  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height:50px;">
    <h2 style="color:#1e81b0;">📢 BookNest Weekly Updates</h2>
    <p><strong>Date:</strong> ${today}</p>
  </div>

  <p>Hi <strong>${user.username}</strong>,</p>
  <p>We’ve got some exciting updates for you this week! 🎉</p>

  <h3>✨ Upcoming Discounts & Offers</h3>
  <ul>
    <li>Up to <strong>30% off</strong> on select bestsellers.</li>
    <li>Special <strong>bundle deals</strong> on popular categories.</li>
    <li><strong>Flash sales</strong> starting soon — don’t miss out!</li>
  </ul>

  <h3>📚 Other Insights</h3>
  <ul>
    <li>Discover our <strong>new arrivals</strong> and trending titles.</li>
    <li>Earn <strong>reward points</strong> for every purchase this week.</li>
    <li>Exclusive <strong>members-only</strong> offers coming soon.</li>
  </ul>

  <p>👉 Visit our store now and explore: <a href="https://fictional-dollop-book-qow7.vercel.app" target="_blank" style="color:#1e81b0; text-decoration:none;">BookNest Store</a></p>

  <p style="margin-top:25px;">Warm regards,<br><strong>Team BookNest</strong></p>
</div>
          `;

          try {
            await sendMail(
              user.email,
              `📢 BookNest Store Updates - ${today}`,
              plainText,
              html
            );
            console.log(`✅ Store update email sent to ${user.email}`);
          } catch (mailErr) {
            console.error(`❌ Failed to send to ${user.email}:`, mailErr.message);
          }
        }
      } catch (err) {
        console.error("❌ Error during store updates email job:", err.message);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // ✅ ensure correct local timing
    }
  );
};
