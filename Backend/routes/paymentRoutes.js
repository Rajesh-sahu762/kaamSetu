const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { createOrder } = require("../controllers/paymentController");

const router = express.Router();

// =======================================
// Payment Routes
// =======================================

router.post("/create-order", verifyToken, createOrder);

module.exports = router;