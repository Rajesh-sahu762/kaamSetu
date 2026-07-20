const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  getDashboardStats,
  getDashboardCharts,
  getRecentActivity,
  getVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  requestVendorReupload,
  suspendVendor,
  activateVendor,
  getUsers,
  getUserById,
  suspendUser,
  activateUser,
  deleteUser,
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  getServices,
  updateServiceStatus,
  deleteServiceListing,
  getReviews,
  resolveReviewReport,
  deleteReview,
  getTransactions,
  updateSettlementStatus,
  updateTransactionStatus,
  getNotifications,
  getNotificationRecipients,
  broadcastNotification,
  deleteAdminNotification,
  getBookings,
  getBookingById,
} = require("../controllers/adminController");

// Every route below requires a valid token AND role === "admin"
router.use(verifyToken, verifyAdmin);

// =======================================
// Dashboard
// =======================================
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts", getDashboardCharts);
router.get("/dashboard/recent-activity", getRecentActivity);

// =======================================
// Vendor Management & Verification
// =======================================
router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendorById);
router.patch("/vendors/:id/approve", approveVendor);
router.patch("/vendors/:id/reject", rejectVendor);
router.patch("/vendors/:id/request-reupload", requestVendorReupload);
router.patch("/vendors/:id/suspend", suspendVendor);
router.patch("/vendors/:id/activate", activateVendor);

// =======================================
// User (Customer) Management
// =======================================
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/activate", activateUser);
router.delete("/users/:id", deleteUser);

// =======================================
// Category Management
// =======================================
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.patch("/categories/:id/status", updateCategoryStatus);

// =======================================
// Service Management
// =======================================
router.get("/services", getServices);
router.patch("/services/:id/status", updateServiceStatus);
router.delete("/services/:id", deleteServiceListing);

// =======================================
// Review Management
// =======================================
router.get("/reviews", getReviews);
router.patch("/reviews/:id/resolve-report", resolveReviewReport);
router.delete("/reviews/:id", deleteReview);

// =======================================
// Transaction / Payment Management
// =======================================
router.get("/transactions", getTransactions);
router.patch("/transactions/:id/settlement", updateSettlementStatus);
router.patch("/transactions/:id/status", updateTransactionStatus);

// =======================================
// Notification Management
// =======================================
router.get("/notifications", getNotifications);
router.get("/notifications/recipients", getNotificationRecipients);
router.post("/notifications/broadcast", broadcastNotification);
router.delete("/notifications/:id", deleteAdminNotification);

// =======================================
// Booking Management
// =======================================
router.get("/bookings", getBookings);
router.get("/bookings/:id", getBookingById);

module.exports = router;