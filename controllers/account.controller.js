// controllers/account.controller.js
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

// 🧾 Render User Account Page
export const renderAccountPage = async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  try {
    // ✅ Fetch user from DB
    const dbUser = await User.findById(req.session.user.id);
    if (!dbUser) return res.redirect("/users/login");

    // ✅ Get user's orders sorted by latest first
    const orders = await Order.find({ userId: dbUser._id })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Use latest order details for fallback billing address/phone
    const latestOrder = orders[0];
    const fallbackAddress = latestOrder?.address || "Not provided";
    const fallbackPhone = latestOrder?.phone || "Not provided";

    // ✅ Enrich user data (using latest known address/phone if missing)
    const enrichedUser = {
      id: dbUser._id,
      fullName: dbUser.fullName || "Unnamed User",
      username: dbUser.username || dbUser.fullName || "User",
      email: dbUser.email,
      address: dbUser.address || fallbackAddress,
      phone: dbUser.phone || fallbackPhone,
      billingAddress: dbUser.billingAddress || fallbackAddress, // billing address
    };

    // ✅ Calculate user metrics
    const metrics = {
      totalOrders: orders.length,
      totalSpent: orders.reduce(
        (sum, o) => sum + (o.grandTotal ? parseFloat(o.grandTotal) : 0),
        0
      ),
      deliveredOrders: orders.filter(o => o.status === "Delivered").length,
      cancelledOrders: orders.filter(o => o.status === "Cancelled").length,
      processingOrders: orders.filter(o => o.status === "Processing").length,
    };

    // ✅ Extract top 5 recent orders
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order._id,
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      status: order.status || "Unknown",
      total: order.grandTotal || "0.00",
      products:
        order.items?.map(item => item.title || item.name || "Unnamed Product") ||
        [],
    }));

    // ✅ Render EJS view with all data
    res.render("account", {
      title: "My Account",
      user: enrichedUser,
      metrics,
      orders,
      recentOrders,
    });
  } catch (err) {
    console.error("❌ Failed to load account:", err);
    res.status(500).send("Failed to load account: " + err.message);
  }
};