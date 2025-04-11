import { products } from "../models/product.model.js";

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
