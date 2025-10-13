import { products } from "../models/product.model.js";

// Get all products (existing route)
export const getAllProducts = (req, res) => {
  const { search = "", sort = "", page = 1 } = req.query;
  const itemsPerPage = 9;

  let filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.author.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "priceLow") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") filteredProducts.sort((a, b) => b.price - a.price);
  if (sort === "titleAZ") filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "titleZA") filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "authorAZ") filteredProducts.sort((a, b) => a.author.localeCompare(b.author));
  if (sort === "authorZA") filteredProducts.sort((a, b) => b.author.localeCompare(a.author));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentPage = parseInt(page);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  res.render("products", {
    user: req.session.user,
    products: paginatedProducts,
    search,
    sort,
    currentPage,
    totalPages
  });
};

// Get single product with related books
export const getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).render("404", { title: "Book Not Found" });
  }

  let relatedBooks = products.filter(p => p.tag === product.tag && p.id !== product.id);

  if (relatedBooks.length === 0) {
    relatedBooks = products.filter(p => p.author === product.author && p.id !== product.id);
  }

  if (relatedBooks.length === 0) {
    relatedBooks = products.filter(p => p.id !== product.id).slice(0, 4);
  }

  res.render("products/detail", {
    user: req.session.user,
    product,
    relatedBooks
  });
};