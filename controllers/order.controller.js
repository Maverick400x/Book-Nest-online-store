import { Order } from "../models/order.model.js";
import { cart } from "../models/cart.model.js";
import { sendMail } from "../utils/mailer.js";

// 📦 Place an Order
export const placeOrder = async (req, res) => {
  if (cart.length === 0) return res.redirect("/cart");

  const { address, phone } = req.body;
  const timestamp = new Date().toLocaleString();
  const orderDate = new Date().toDateString();

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = subtotal;

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
    status: "Processing"
  });

  try {
    await order.save();
    cart.length = 0;

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
        <h2>🛒 <u><strong>Order Confirmation - BookNest</strong></u></h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for your order placed on <strong>${timestamp}</strong>.</p>
        <p><u><strong>Delivery by:</strong></u> <strong>${order.deliveryDate}</strong></p>
        <p><u><strong>Total:</strong></u> <strong>₹${order.grandTotal}</strong></p>
        <p><u><strong>Address:</strong></u> ${address}<br>
           <u><strong>Phone:</strong></u> ${phone}<br>
           <u><strong>Partner:</strong></u> ${deliveryPartner}</p>
        <p style="margin-top: 20px;">Thanks for shopping with us!<br><strong>— Team BookNest</strong></p>
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

// 📄 Get All Orders for Current User
export const getOrders = async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 });

    const today = new Date();

    // Auto-update order status if delivery date has passed
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
      today: today.toDateString()
    });
  } catch (err) {
    res.status(500).send("Failed to load orders: " + err.message);
  }
};

// ❌ Cancel Order — Only allowed on same day as order
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId: req.session.user.id });

    if (!order) return res.status(404).send("Order not found.");

    const today = new Date().toDateString();
    if (order.orderDate !== today) {
      return res.status(400).send("❌ You can only cancel orders on the same day of purchase.");
    }

    if (order.status !== "Processing") {
      return res.status(400).send("❌ Only processing orders can be cancelled.");
    }

    order.status = "Cancelled";
    await order.save();

    const { email, username } = req.session.user;

    if (email) {
      const plainText = `
Hello ${username},

Your order placed on ${order.orderDate} with Order ID ${order._id} has been cancelled successfully.

Order Summary:
${order.items.map(item => `- ${item.title} (₹${item.price})`).join("\n")}

Total Refunded: ₹${order.grandTotal} , will be processed within 3-5 business days.
If not received, please contact support.

Thank you for choosing BookNest. Let us know if you need any help!

— Team BookNest
      `.trim();

      const html = `
        <h2 style="color: red;"><u><strong>❌ Order Cancelled - BookNest</strong></u></h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p><u><strong>Your order placed on</strong></u> <strong>${order.orderDate}</strong> with 
        <u><strong>Order ID:</strong></u> <strong>${order._id}</strong> has been 
        <span style="color: red;"><u><strong>cancelled</strong></u></span>.</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;"><strong>Book</strong></th>
              <th style="border: 1px solid #ddd; padding: 8px;"><strong>Price</strong></th>
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

        <p style="margin-top: 20px;"><u><strong>Total Refunded:</strong></u> <strong>₹${order.grandTotal}</strong></p>
        <p>Thank you for choosing BookNest. Let us know if you need any help.</p>
        <p style="margin-top: 20px;">— <strong>Team BookNest</strong></p>
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
