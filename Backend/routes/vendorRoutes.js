const express = require("express");
const { getVendorProfile, updateVendorProfile} = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/profile", verifyToken, getVendorProfile);

router.put("/profile", verifyToken, updateVendorProfile);


module.exports = router;