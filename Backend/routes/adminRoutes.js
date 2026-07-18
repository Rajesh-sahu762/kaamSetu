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

module.exports = router;
