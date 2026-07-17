const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { createOrder, verifyPayment, paymentWebhook } = require("../controllers/paymentController");

const router = express.Router();

// =======================================
// Payment Routes
// =======================================

router.post("/create-order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyPayment);
router.post("/webhook", express.raw({type: "application/json"}), paymentWebhook);

module.exports = router;