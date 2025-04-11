import { orders } from "../models/order.model.js";
import { cart } from "../models/cart.model.js";
import { sendMail } from "../utils/mailer.js";

// Place an Order
export const placeOrder = async (req, res) => {
  if (cart.length === 0) {
    return res.redirect("/cart");
  }

  const { address, phone } = req.body;
  const timestamp = new Date().toLocaleString();

  let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let gst = subtotal * 0.18;
  let shipping = 50;
  let grandTotal = subtotal + gst + shipping;

  const deliveryDays = Math.floor(Math.random() * 5) + 3;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  const deliveryPartners = ["BlueDart", "FedEx", "DTDC", "Delhivery", "Ecom Express"];
  const deliveryPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

  const order = {
    id: Date.now(),
    items: [...cart],
    address,
    phone,
    subtotal: subtotal.toFixed(2),
    gst: gst.toFixed(2),
    shipping,
    grandTotal: grandTotal.toFixed(2),
    deliveryDate: deliveryDate.toDateString(),
    deliveryPartner,
  };

  orders.push(order);
  cart.length = 0; // Clear cart after placing order

  // ✅ Prepare email message
  const itemList = order.items.map(item => `• ${item.title} - ₹${item.price}`).join("\n");
  const message = `Hello,\n\nYour order has been placed successfully on ${timestamp}.\n\n📚 Ordered Items:\n${itemList}\n\n📍 Address: ${address}\n📞 Phone: ${phone}\n\n💰 Total: ₹${order.grandTotal} (Including GST and Shipping)\n🚚 Delivery Partner: ${deliveryPartner}\n📅 Expected Delivery: ${order.deliveryDate}\n\nThank you for shopping with us!\n- Online Bookstore`;

  const email = req.session.user?.email;
  if (email) {
    await sendMail(
      email,
      `Order Confirmation #${order.id} - Online Bookstore`, // ✅ Subject with Order ID
      message
    );
  }

  console.log(`Order placed: ${order.id}`);
  res.redirect("/orders");
};

// View Orders
export const getOrders = (req, res) => {
  res.render("orders", { title: "Your Orders", orders, user: req.session.user });
};
