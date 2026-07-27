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

// import token
const verifyToken = require("../middleware/verifyToken");

// Register Route

router.post("/register", registerUser);

// Login Route
router.post("/login", LoginUser);

// deactivateAccount Route
router.patch("/deactivate-account", verifyToken, deactivateAccount);

// Vendor Register Route
router.post("/vendor/register", vendorRegister);

// email verification
router.post("/verify-email", verifyEmailOtp);

// reset otp
router.post("/resend-otp", resendOtp);

// forgot-password
router.post("/forgot-password", forgotPassword);

// requires the token issued by /verify-email's OTP check — see resetPassword
// in authController for why this can no longer be a bare, unauthenticated call.
router.post("/reset-password", verifyToken, resetPassword);

router.post("/google", googleLogin);

router.post("/facebook", facebookLogin);

module.exports = router;
