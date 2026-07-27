const express = require("express");
const { getVendorProfile, updateVendorProfile, updateProfileImage, addService, getVendorServices, updateService, deleteService, toggleServiceStatus, getCategories, getVendorBookings, getVendorBookingById, updateBookingStatus, getVendorReviews, replyReview, reportReview, getVendorEarnings, getVendorTransactions} = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken");
const verifyVendor = require("../middleware/verifyVendor");
const requireApprovedVendor = require("../middleware/requireApprovedVendor");
const upload = require("../middleware/upload");
const router = express.Router();

// Every route below requires a valid token AND role === "vendor".
// (Previously only verifyToken ran here, so any logged-in account —
// customer or admin — could technically hit these endpoints.)
router.use(verifyToken, verifyVendor);

// =======================================
// Profile Routes
// =======================================
// Read routes stay open to any vendor status (pending/rejected/suspended
// vendors still need to see their own profile/approval state).

router.get("/profile", getVendorProfile);

router.put("/profile", updateVendorProfile);

router.patch("/profile-image", upload("profile").single("profileImage"), updateProfileImage);


// =======================================
// Services Routes
// =======================================
// Writing/publishing services is gated to approved vendors only.

router.post("/services", requireApprovedVendor, upload("services").array("images", 8), addService);

router.get("/services", getVendorServices);

router.put("/services/:id", requireApprovedVendor, upload("services").array("images", 8), updateService);

router.delete("/services/:id", requireApprovedVendor, deleteService);

router.patch("/services/:id/status", requireApprovedVendor, toggleServiceStatus);

// =======================================
// Booking Routes
// =======================================
// Accepting/rejecting/updating a booking is gated to approved vendors only.

router.get("/bookings", getVendorBookings);
router.get("/bookings/:bookingId", getVendorBookingById);
router.patch("/bookings/:bookingId/status", requireApprovedVendor, updateBookingStatus);

// =======================================
// Category Routes
// =======================================

router.get("/categories", getCategories);

// =======================================
// Review Routes
// =======================================

router.get("/reviews", getVendorReviews);
router.patch("/reviews/:id/reply", replyReview);
router.patch("/reviews/:id/report", reportReview);

// =======================================
// Earnings Routes
// =======================================

router.get("/earnings", getVendorEarnings);
router.get("/transactions", getVendorTransactions);


module.exports = router;