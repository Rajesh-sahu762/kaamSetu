const express = require("express");
const { getVendorProfile, updateVendorProfile, updateProfileImage} = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const router = express.Router();



router.get("/profile", verifyToken, getVendorProfile);

router.put("/profile", verifyToken, updateVendorProfile);


router.patch("/profile-image", verifyToken, upload("profile").single("profileImage"), updateProfileImage);


module.exports = router;