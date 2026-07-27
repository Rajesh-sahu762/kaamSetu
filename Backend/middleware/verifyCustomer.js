// middleware/verifyCustomer.js
// Chain AFTER verifyToken — assumes verifyToken has already set req.user = { userId, role }.
// Unlike vendors, customers don't have a separate profile collection (they're
// just a User with role === "customer"), so there's no extra doc to attach.

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
