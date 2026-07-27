const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerProfileImage,
  createReview,
  getMyReviews,
} = require("../controllers/customerController");

const verifyToken = require("../middleware/verifyToken");
const verifyCustomer = require("../middleware/verifyCustomer");
const upload = require("../middleware/upload");

// Every route below requires a valid token AND role === "customer".
router.use(verifyToken, verifyCustomer);

// =======================================
// Profile Routes
// =======================================

router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);
router.patch(
  "/profile-image",
  upload("profile").single("profileImage"),
  updateCustomerProfileImage,
);

// =======================================
// Booking Routes
// =======================================

router.post("/bookings", createBooking);
router.get("/bookings", getMyBookings);
router.get("/bookings/:bookingId", getMyBookingById);
router.patch("/bookings/:bookingId/cancel", cancelMyBooking);

// =======================================
// Review Routes
// =======================================

router.post("/reviews", createReview);
router.get("/reviews", getMyReviews);

module.exports = router;
