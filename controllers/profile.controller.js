import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

// ===================== UPDATE CONTACT INFO ===================== //
export const updateContactInfo = async (req, res) => {
  const { fullName, username, phone, address } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: "❌ Please log in to update your profile." });
  }

  const trimmedFullName = fullName?.trim();
  const trimmedUsername = username?.trim();

  if (!trimmedFullName || trimmedFullName.length < 3 || trimmedFullName.length > 50) {
    return res.status(400).json({ message: "❌ Full Name must be between 3 and 50 characters." });
  }

  if (!trimmedUsername || trimmedUsername.length < 1 || trimmedUsername.length > 20) {
    return res.status(400).json({ message: "❌ Username must be between 1 and 20 characters." });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "❌ Phone number must be exactly 10 digits." });
  }

  try {
    const currentUser = await User.findById(req.session.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "❌ User not found." });
    }

    if (trimmedUsername !== currentUser.username) {
      const usernameTaken = await User.findOne({ username: trimmedUsername });
      if (usernameTaken) {
        return res.status(400).json({ message: "❌ Username already in use." });
      }
    }

    currentUser.fullName = trimmedFullName;
    currentUser.username = trimmedUsername;
    currentUser.phone = phone;
    currentUser.address = address;
    await currentUser.save();

    Object.assign(req.session.user, {
      fullName: trimmedFullName,
      username: trimmedUsername,
      phone,
      address,
    });

    return res.status(200).json({ message: "✅ Profile updated successfully!" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "❌ Server error. Please try again later." });
  }
};