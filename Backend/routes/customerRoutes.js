const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getDashboardSummary, getHomeData } = require("../controllers/customerController");

// =======================================
// Customer Dashboard Routes
// =======================================
router.get("/dashboard-summary", verifyToken, getDashboardSummary);

router.get("/home", getHomeData);

module.exports = router;