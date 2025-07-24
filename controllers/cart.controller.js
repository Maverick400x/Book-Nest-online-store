import { cart } from "../models/cart.model.js";
import { products } from "../models/product.model.js";
import { RazorpayOrder } from "../models/razorpay.model.js";

// Add product to cart
export const addToCart = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    cart.push(product);
    console.log(`Added to cart: ${product.title}`);
  } else {
    console.log("Product not found.");
  }

  res.redirect("/cart");
};

// Get the cart page with optional shipping info
export const getCart = async (req, res) => {
  const user = req.session.user;
  let shippingInfo = {};

  if (user && user._id) {
    try {
      const lastOrder = await RazorpayOrder.findOne({ userId: user._id }).sort({ createdAt: -1 });

      if (lastOrder) {
        shippingInfo = {
          address: lastOrder.address,
          phone: lastOrder.phone
        };
      }
    } catch (error) {
      console.error("Error fetching shipping info:", error);
    }
  }

  res.render("cart", {
    title: "Shopping Cart",
    cart,
    user,
    shippingInfo
  });
};

// Remove item from cart by index
export const removeFromCart = (req, res) => {
  const index = parseInt(req.params.index);

  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1);
    console.log(`Removed from cart: ${removed[0]?.title}`);
  } else {
    console.log("Invalid index for cart removal.");
  }

  res.redirect("/cart");
};