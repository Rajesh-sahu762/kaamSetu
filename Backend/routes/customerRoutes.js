const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { getDashboardSummary } = require("../controllers/customerController");

// =======================================
// Customer Dashboard Routes
// =======================================
router.get("/dashboard-summary", verifyToken, getDashboardSummary);

module.exports = router;