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
  googleLogin,
  facebookLogin,
  deactivateAccount
} = require("../controllers/authController");

// Register Route

router.post("/register", registerUser);

// Login Route
router.post("/login", LoginUser);

// deactivateAccount Route
router.patch("/deactivate-account", deactivateAccount);

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

router.post("/facebook", facebookLogin);

module.exports = router;
