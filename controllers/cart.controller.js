import { cart } from "../models/cart.model.js";
import { products } from "../models/product.model.js";

export const addToCart = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    cart.push(product);
    console.log(`Added to cart: ${product.title}`);
  }

  res.redirect("/cart");
};

export const getCart = (req, res) => {
  res.render("cart", { title: "Shopping Cart", cart, user: req.session.user });
};

export const removeFromCart = (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
  }
  res.redirect("/cart");
};
