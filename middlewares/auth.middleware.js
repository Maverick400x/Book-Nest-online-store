export const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/users/login"); // Redirect to login page if not authenticated
    }
    next();
  };
  