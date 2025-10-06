import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

export const renderAccountPage = async (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");

  try {
    const dbUser = await User.findById(req.session.user.id);
    if (!dbUser) return res.redirect("/users/login");

    const orders = await Order.find({ userId: dbUser._id }).sort({ _id: -1 });
    const latestOrder = orders[0];

    const fallbackAddress = latestOrder?.address || "Not provided";
    const fallbackPhone = latestOrder?.phone || "Not provided";

    const enrichedUser = {
      id: dbUser._id,
      fullName: dbUser.fullName,
      username: dbUser.username,
      email: dbUser.email,
      address: dbUser.address || fallbackAddress,
      phone: dbUser.phone || fallbackPhone,
      totalOrders: orders.length,
      allBooks: orders.flatMap(order =>
        Array.isArray(order.items) ? order.items.map(item => item.title) : []
      )
    };

    req.session.user = enrichedUser;

    res.render("account", { user: enrichedUser });
  } catch (err) {
    res.status(500).send("❌ Failed to load account: " + err.message);
  }
};