const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
  getDashboardSummary,
  getHomeData,
  getExpertProfile,
} = require("../controllers/customerController");

// =======================================
// Customer Dashboard Routes
// =======================================
router.get("/dashboard-summary", verifyToken, getDashboardSummary);

router.get("/home", getHomeData);

router.get("/expert/:vendorId", verifyToken, getExpertProfile );

module.exports = router;
