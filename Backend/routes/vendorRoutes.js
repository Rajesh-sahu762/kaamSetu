const express = require("express");
const { getVendorProfile, updateVendorProfile, updateProfileImage, addService, getVendorServices, updateService} = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const router = express.Router();



router.get("/profile", verifyToken, getVendorProfile);

router.put("/profile", verifyToken, updateVendorProfile);

router.patch("/profile-image", verifyToken, upload("profile").single("profileImage"), updateProfileImage);

router.post("/services", verifyToken, addService);

router.get("/services", verifyToken, getVendorServices);

router.put("/services:id", verifyToken , updateService);

module.exports = router;