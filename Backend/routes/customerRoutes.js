const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  getDashboardSummary,
  getHomeData,
  getExpertProfile,
  getServicesPage,
  getCustomerBookings,
  getCustomerBookingById,
  cancelCustomerBooking,
} = require("../controllers/customerController");

// =======================================
// Customer Dashboard Routes
// =======================================
router.get("/dashboard-summary", verifyToken, getDashboardSummary);

router.get("/home", getHomeData);

router.get("/expert/:vendorId", verifyToken, getExpertProfile );

router.get("/services", getServicesPage);

router.get("/bookings", verifyToken, getCustomerBookings);
router.get("/bookings/:bookingId", verifyToken, getCustomerBookingById);
router.patch("/bookings/:bookingId/cancel", verifyToken, cancelCustomerBooking);

module.exports = router;
