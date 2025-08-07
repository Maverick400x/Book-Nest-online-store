import { cart } from "../models/cart.model.js";
import { products } from "../models/product.model.js";

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

// Get the cart page (without Razorpay shipping info)
export const getCart = (req, res) => {
  const user = req.session.user;

  res.render("cart", {
    title: "Shopping Cart",
    cart,
    user,
    shippingInfo: {} // Now empty by default, or you can remove it entirely from the view if unused
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