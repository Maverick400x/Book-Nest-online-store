import { products } from "../models/product.model.js";

// Get all products (with search, sort, pagination, tag, price, limited, hotSale filter)
export const getAllProducts = (req, res) => {
  let {
    search = "",
    sort = "priceHigh",
    tag = "",
    page = 1,
    price = "",
    limited = "0",
    hotSale = "0",
  } = req.query;

  const itemsPerPage = 9;

  // Convert checkbox query params to boolean
  limited = limited === "1";
  hotSale = hotSale === "1";

  // Calculate min and max prices dynamically
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Filter products based on search, tag, max price, limited, hotSale
  let filteredProducts = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.author.toLowerCase().includes(search.toLowerCase());

    const matchesTag = tag ? product.tag.toLowerCase() === tag.toLowerCase() : true;

    const matchesPrice = price ? product.price <= parseFloat(price) : true;

    const matchesLimited = limited ? product.limitedEdition === true : true;
    const matchesHotSale = hotSale ? product.hotSale === true : true;

    return matchesSearch && matchesTag && matchesPrice && matchesLimited && matchesHotSale;
  });

  // Sorting
  switch (sort) {
    case "priceLow":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "priceHigh":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "titleAZ":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "titleZA":
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "authorAZ":
      filteredProducts.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "authorZA":
      filteredProducts.sort((a, b) => b.author.localeCompare(a.author));
      break;
    default:
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentPage = parseInt(page);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get all unique tags for filter dropdown
  const allTags = [...new Set(products.map(p => p.tag))];

  res.render("products", {
    user: req.session.user,
    products: paginatedProducts,
    search,
    sort,
    tag,
    currentPage,
    totalPages,
    allTags,
    minPrice,
    maxPrice,
    selectedPrice: price ? parseFloat(price) : maxPrice,
    limited,
    hotSale, // ✅ Pass checkbox values to template
  });
};

// Get single product with related books
export const getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).render("404", { title: "Book Not Found" });
  }

  // Related books: first by same tag, then same author, fallback to other books
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