# 📖 **Online Bookstore E-commerce**

A **simple and efficient e-commerce platform** for books, built using **Node.js, Express, and EJS**, following the **MVC architecture** (without a database). 📚

---

## 📌 **Features**

✅ **User Authentication** – Login/Register using **email or username**
✅ **Book Listings** – Browse books with **prices and author details**
✅ **Shopping Cart** – Add/remove books & manage cart items
✅ **Order Placement** – Place orders with **address & phone number**
✅ **GST & Shipping Charges Calculation** – Auto-applied at checkout
✅ **Expected Delivery Date & Delivery Partner** – Shown on checkout
✅ **Order History** – Track previously placed orders
✅ **Session-Based Storage** – Cart & orders stored in session ( **No database used** )
✅ **Bootstrap for Styling** – Fully responsive UI
✅ **Custom Logger** – **Winston** middleware for logging requests and errors
✅ **Secure Authentication** – Session-based login/logout system
✅ **Email Notifications** – **Nodemailer** integration for **login & registration emails**

---

## 🚀 **Tech Stack**

| Technology                | Description             |
| ------------------------- | ----------------------- |
| **Node.js**         | Backend runtime         |
| **Express.js**      | Web framework           |
| **EJS**             | Templating engine       |
| **Bootstrap**       | Responsive UI           |
| **express-session** | Session handling        |
| **body-parser**     | Parse request bodies    |
| **Nodemailer**      | Email service           |
| **Winston Logger**  | Logging requests/errors |

---

## 📦 **API Routes**

### 📚 **Product Routes**

| Route                     | Method | Description    |
| ------------------------- | ------ | -------------- |
| `/products`             | GET    | View all books |
| `/products?search=book` | GET    | Search books   |

### 🛒 **Cart Routes**

| Route                | Method | Description      |
| -------------------- | ------ | ---------------- |
| `/cart`            | GET    | View cart        |
| `/cart/add/:id`    | GET    | Add book to cart |
| `/cart/remove/:id` | GET    | Remove from cart |

### 👤 **User Routes**

| Route               | Method   | Description   |
| ------------------- | -------- | ------------- |
| `/users/login`    | GET/POST | Login user    |
| `/users/register` | GET/POST | Register user |
| `/users/logout`   | GET      | Logout user   |

### 📦 **Order Routes**

| Route             | Method | Description |
| ----------------- | ------ | ----------- |
| `/orders`       | GET    | View orders |
| `/orders/place` | POST   | Place order |

---

## 🧩 **Project Structure**

```
📁 online-bookstore-ecommerce
│
├── 📁 routes               # Route definitions
├── 📁 controllers          # Route logic (controllers)
├── 📁 models               # Data structures & business logic
├── 📁 middlewares          # Logger, error handlers
├── 📁 utils                # Email, system info utilities
├── app.js                 # Main server file
├── package.json
└── README.md              # Project documentation
```

---

## 🛠 **Usage Guide**

### 🔹 User Authentication

- Register at `/users/register`
- Login at `/users/login`
- Logout at `/users/logout`

### 🔹 Browse Books

- View books on `/products`
- Search books using **search bar**

### 🔹 Shopping Cart

- Add/remove books to/from cart
- Checkout with **Address** & **Phone Number**

### 🔹 Order Management

- Place orders with **GST + Shipping**
- View past orders at `/orders`

---

## 📬 **Contact**

For queries, suggestions, or bug reports:
📧 Email: **ranganathsrinivasa95@gmail.com**
🔗 LinkedIn: [Srinivasa Ranganath](https://www.linkedin.com/in/b-srinivasa-ranganath-b3562b329)
🌐 GitHub: [Maverick400x](https://github.com/Maverick400x)

---

## 💡 **Future Updates**

🚧 Planned Enhancements:

- 📦 **Add product categories & filtering**
- 🔐 **Password encryption using bcrypt**
- 🛠 **Admin panel for adding/editing books**
- 📊 **Dashboard for order analytics**
- 📧 **Email invoice generation**

---

## 🤝 **Contributing** *(Optional)*

Contributions are welcome! Please open an issue or submit a pull request for any suggestions, improvements, or bug fixes.

---

## 📜 **License**

This project is **open-source** and available under the **MIT License**.

---

🚀 **Happy Coding & Enjoy Your Online Bookstore!** 😊📚
