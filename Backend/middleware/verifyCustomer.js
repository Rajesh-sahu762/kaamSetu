// middleware/verifyCustomer.js
// Chain AFTER verifyToken — assumes verifyToken has already set req.user = { userId, role, ... }
// from the JWT payload. Mirrors verifyAdmin.js so vendor/admin accounts can't hit customer-only routes.

const verifyCustomer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login again.",
    });
  }

  if (req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Customers only.",
    });
  }

  next();
};

module.exports = verifyCustomer;