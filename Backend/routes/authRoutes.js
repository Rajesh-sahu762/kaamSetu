const express = require("express");
const router = express.Router();

const {
  registerUser,
  LoginUser,
  vendorRegister,
  verifyEmailOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  googleLogin
} = require("../controllers/authController");

// Register Route

router.post("/register", registerUser);

// Login Route
router.post("/login", LoginUser);

// Vendor Register Route
router.post("/vendor/register", vendorRegister);

// email verification
router.post("/verify-email", verifyEmailOtp);

// reset otp
router.post("/resend-otp", resendOtp);

// forgot-password
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/google", googleLogin);

module.exports = router;
