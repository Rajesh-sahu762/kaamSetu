// middleware/requireApprovedVendor.js
// Chain AFTER verifyVendor (needs req.vendor). Use ONLY on sensitive write actions
// (creating/editing services, accepting bookings) — NOT on read routes like
// profile/dashboard, which pending/suspended vendors still need to see their status.

const requireApprovedVendor = (req, res, next) => {
  if (!req.vendor) {
    return res.status(401).json({
      success: false,
      message: "Vendor verification required.",
    });
  }

  if (req.vendor.status !== "approved") {
    return res.status(403).json({
      success: false,
      message: `Your vendor account is ${req.vendor.status}. This action requires an approved account.`,
    });
  }

  next();
};

module.exports = requireApprovedVendor;
