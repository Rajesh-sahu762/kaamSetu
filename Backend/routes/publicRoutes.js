const express = require("express");
const router = express.Router();

const {
  getCategories,
  getServices,
  getPopularServices,
  getServiceById,
  getVendorPublicProfile,
  getFeaturedExperts,
  getVendors,
} = require("../controllers/publicController");

// =======================================
// Public Browse Routes (no auth — anonymous visitors + logged-in customers)
// =======================================

router.get("/categories", getCategories);

router.get("/services/popular", getPopularServices);
router.get("/services/:id", getServiceById);
router.get("/services", getServices);

router.get("/vendors/featured", getFeaturedExperts);
router.get("/vendors/:id", getVendorPublicProfile);
router.get("/vendors", getVendors);

module.exports = router;
