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
export const addToCart = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    // Check if product is already in cart to increment quantity, otherwise add new item
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 }); // default quantity = 1
    }
    console.log(`🛒 Added to cart: ${product.title}`);
  } else {
    console.log("❌ Product not found.");
  }

  res.redirect("/cart");
};

// =================== GET CART PAGE ===================
export const getCart = async (req, res) => {
  const user = req.session.user;
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) * 100; // Razorpay requires paisa

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
};

// =================== REMOVE ITEM FROM CART ===================
export const removeFromCart = (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1);
    console.log(`🗑️ Removed from cart: ${removed[0]?.title}`);
  } else {
    console.log("❌ Invalid index for cart removal.");
  }

  res.redirect("/cart");
};

// =================== HELPER: GENERATE HTML ORDER TABLE (FOR CONFIRMATION) ===================
/**
 * Generates the HTML structure for the order summary table in the confirmation email.
 * This version is styled to be clean and minimalist.
 * @param {Array} items - The list of items in the order.
 * @returns {string} The HTML table string.
 */
const generateOrderTableHtml = (items) => {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: left; color: #555; font-size: 14px;">Book</th>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: center; color: #555; font-size: 14px;">Qty</th>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: right; color: #555; font-size: 14px;">Price (₹)</th>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: right; color: #555; font-size: 14px;">Subtotal (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const qty = item.quantity || 1;
          const subtotalItem = (item.price * qty).toFixed(2);
          return `
          <tr>
            <td style="padding: 10px 0; text-align: left; color: #333;">${item.title}</td>
            <td style="padding: 10px 0; text-align: center; color: #333;">${qty}</td>
            <td style="padding: 10px 0; text-align: right; color: #333;">₹${item.price}</td>
            <td style="padding: 10px 0; text-align: right; color: #333; font-weight: bold;">₹${subtotalItem}</td>
          </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
};

// =================== HELPER: GENERATE HTML ORDER TABLE (FOR CANCELLATION) ===================
/**
 * Generates the HTML structure for the cancelled order summary table.
 * @param {Array} items - The list of items in the cancelled order.
 * @returns {string} The HTML table string.
 */
const generateCancellationTableHtml = (items) => {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: left; color: #555; font-size: 14px; width: 60%;">Item (Cancelled)</th>
          <th style="border-bottom: 1px solid #eee; padding: 12px 0; text-align: right; color: #555; font-size: 14px; width: 40%;">Refund Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => {
          const subtotalItem = (item.price * (item.quantity || 1)).toFixed(2);
          return `
          <tr>
            <td style="padding: 10px 0; text-align: left; color: #333;">${item.title}</td>
            <td style="padding: 10px 0; text-align: right; color: #333; font-weight: bold;">₹${subtotalItem}</td>
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

    // Step 1: Verify Razorpay Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                               .update(sign)
                               .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("❌ Payment verification failed (signature mismatch).");
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Step 2: Prepare Order Data
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const grandTotal = subtotal;

    const orderDate = new Date().toDateString();
    const deliveryDays = Math.floor(Math.random() * 5) + 3; // random 3–7 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const deliveryPartners = ["BlueDart", "FedEx", "DTDC", "Delhivery", "Ecom Express"];
    const deliveryPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

    // Step 3: Save Order in MongoDB
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
    cart.length = 0; // clear cart after successful order

    // Step 4: Send Order Confirmation Email
    const { email, username } = req.session.user;
    if (email) {
      // Use the helper function to generate the HTML table
      const orderTableHtml = generateOrderTableHtml(order.items);

      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height: 40px; margin-bottom: 10px;">
          <div style="color: #28a745; font-size: 20px; font-weight: bold;">✅ Order Confirmed</div>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${username}</strong>,</p>
        <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
            Thank you for your order placed on <strong>${new Date().toLocaleString()}</strong>.
        </p>

        <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; font-size: 18px;">📦 Order Summary</h3>
        
        ${orderTableHtml}

        <div style="border-top: 2px solid #f0f0f0; padding-top: 15px; margin-top: 15px; font-size: 16px; line-height: 1.8;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Total: <span style="color: #28a745;">₹${order.grandTotal}</span></p>
            <p style="margin: 0;">Payment Method: <strong>${order.paymentMethod}</strong></p>
        </div>

        <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">🚚 Delivery Details</h3>
        <p style="font-size: 14px; color: #333; line-height: 1.8;">
            📍 <strong>Address:</strong> ${address}<br>
            📞 <strong>Phone:</strong> ${phone}<br>
            🚚 <strong>Partner:</strong> ${deliveryPartner}<br>
            📅 <strong>Expected Delivery:</strong> ${order.deliveryDate}
        </p>

        <p style="margin-top: 35px; text-align: center; color: #666; font-size: 14px;">
            Thanks for shopping with us!<br><strong>— Team BookNest</strong>
        </p>
      </div>
      `;

      // The plain text content remains unchanged as it is already clear and functional
      const plainText = `
Hello ${username},

Thank you for your order placed on ${new Date().toLocaleString()}.

Order Summary:
${order.items.map(item => {
  const qty = item.quantity || 1;
  const subtotalItem = (item.price * qty).toFixed(2);
  return `- ${item.title} | ₹${item.price} x ${qty} = ₹${subtotalItem}`;
}).join("\n")}

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

    console.log(`✅ Order placed successfully: ${order._id}`);
    res.json({ success: true, orderId: order._id });

  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// =================== CANCEL ORDER & SEND CANCELLATION EMAIL ===================
export const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // NOTE: In a real application, you would perform these steps:
        // 1. const order = await Order.findById(orderId);
        // 2. if (!order) throw new Error("Order not found");
        // 3. order.status = "Cancelled";
        // 4. await order.save();
        // 5. Trigger refund logic here.

        // --- MOCKING ORDER DATA FOR EMAIL GENERATION ---
        // Replacing the database fetch with mock data for demonstration
        const order = {
            _id: orderId,
            items: [
                { title: "Justice League: Origin", price: 880, quantity: 1 },
                { title: "Superman: Red Son", price: 940, quantity: 1 }
            ],
            grandTotal: (880 + 940).toFixed(2), // 1820.00
            orderDate: 'Oct 04 2025', // Mocked date for email
            paymentMethod: 'Razorpay'
        };
        // ----------------------------------------------


        // Step 1: Send Order Cancellation Email
        const { email, username } = req.session.user;
        if (email) {
            const subject = `❌ Order #${order._id} Cancelled - BookNest`;
            const cancellationTableHtml = generateCancellationTableHtml(order.items);

            // --- HTML EMAIL CONTENT ---
            const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 25px;">
                <img src="https://book-nest-wgrp.onrender.com/src/logo.png" alt="BookNest Logo" style="height: 40px; margin-bottom: 10px;">
                <div style="color: #dc3545; font-size: 20px; font-weight: bold;">❌ Order Cancelled</div>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 15px;">Hello <strong>${username}</strong>,</p>
              <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
                  Your order placed on <strong>${order.orderDate}</strong> with Order ID <strong>${order._id}</strong> has been cancelled successfully.
              </p>
      
              <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; font-size: 18px;">📋 Refund Summary</h3>
              
              ${cancellationTableHtml}
      
              <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; font-size: 16px; line-height: 1.8;">
                  <p style="margin: 0 0 10px 0; font-weight: bold;">Total Refunded: <span style="color: #dc3545;">₹${order.grandTotal}</span></p>
                  <p style="margin: 0 0 20px 0; font-size: 14px; color: #333;">Refund will be processed within <strong>3-5 business days.</strong></p>
                  <p style="margin: 0; font-size: 14px; color: #666;">If not received, please contact support.</p>
              </div>
      
              <p style="margin-top: 35px; text-align: center; color: #666; font-size: 14px;">
                  Thank you for choosing BookNest. Let us know if you need any help!<br><strong>— Team BookNest</strong>
              </p>
            </div>
            `;
            // --- PLAIN TEXT EMAIL CONTENT ---
            const plainText = `
Hello ${username},

Your order placed on ${order.orderDate} with Order ID ${order._id} has been cancelled successfully.

Refund Summary:
${order.items.map(item => {
  const subtotalItem = (item.price * (item.quantity || 1)).toFixed(2);
  return `- ${item.title} (₹${subtotalItem})`;
}).join("\n")}

Total Refunded: ₹${order.grandTotal}
Refund will be processed within 3-5 business days.
If not received, please contact support.

Thank you for choosing BookNest. Let us know if you need any help!
— Team BookNest
            `;

            await sendMail(email, subject, plainText, html);
        }

        console.log(`❌ Order cancelled successfully: ${orderId}`);
        // Respond with success message
        res.json({ success: true, message: `Order ${orderId} cancelled successfully and cancellation email sent.` });

    } catch (err) {
        console.error("❌ cancelOrder error:", err);
        res.status(500).json({ success: false, message: "Could not cancel order due to an internal error." });
    }
};
