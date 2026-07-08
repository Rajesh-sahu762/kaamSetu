const express = require("express");
const { getVendorProfile, updateVendorProfile, updateProfileImage } = require("../controllers/vendorController");
const router = express.Router();

router.get("/profile", getVendorProfile);

router.put("/profile", updateVendorProfile);

module.exports = router;