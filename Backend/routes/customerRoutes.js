const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyCustomer = require("../middleware/verifyCustomer");
const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  getDashboardSummary,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  createReview,
} = require("../controllers/customerController");

// Profile image upload is generic on the User model (not vendor-specific),
// so we reuse the vendor panel's existing controller instead of duplicating it.
const { updateProfileImage } = require("../controllers/vendorController");

// =======================================
// Profile Routes
// =======================================
router.get("/profile", verifyToken, verifyCustomer, getProfile);
router.put("/profile", verifyToken, verifyCustomer, updateProfile);
router.patch(
  "/profile-image",
  verifyToken,
  verifyCustomer,
  upload("profile").single("profileImage"),
  updateProfileImage,
);

// =======================================
// Dashboard Route
// =======================================
router.get("/dashboard-summary", verifyToken, verifyCustomer, getDashboardSummary);

// =======================================
// Booking Routes
// =======================================
router.post("/bookings", verifyToken, verifyCustomer, createBooking);
router.get("/bookings", verifyToken, verifyCustomer, getMyBookings);
router.get("/bookings/:bookingId", verifyToken, verifyCustomer, getBookingById);
router.patch("/bookings/:bookingId/cancel", verifyToken, verifyCustomer, cancelBooking);

// =======================================
// Review Routes
// =======================================
router.post("/bookings/:bookingId/review", verifyToken, verifyCustomer, createReview);

module.exports = router;