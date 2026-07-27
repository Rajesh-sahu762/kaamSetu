// middleware/verifyVendor.js
// Chain AFTER verifyToken — assumes verifyToken has already set req.user = { userId, role, ... }.
// Confirms the account's role is "vendor" and attaches the matching Vendor doc as req.vendor,
// so route handlers that need it (e.g. requireApprovedVendor) don't have to re-query.

const Vendor = require("../models/vendor");

const verifyVendor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendors only.",
      });
    }

    const vendor = await Vendor.findOne({ userId: req.user.userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    req.vendor = vendor;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = verifyVendor;
