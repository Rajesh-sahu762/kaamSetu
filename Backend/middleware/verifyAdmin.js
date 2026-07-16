// middleware/verifyAdmin.js
// Chain AFTER verifyToken — assumes verifyToken has already set req.user = { id, role, ... }
// from the JWT payload. If your verifyToken sets a different shape (e.g. req.userId only),
// tell me and I'll adjust this.

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login again.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  next();
};

module.exports = verifyAdmin;