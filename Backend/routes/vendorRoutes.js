const express = require("express");
const { getVendorProfile, updateVendorProfile, updateProfileImage, addService, getVendorServices, updateService, deleteService, toggleServiceStatus, getCategories} = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const router = express.Router();



// =======================================
// Profile Routes
// =======================================

router.get("/profile", verifyToken, getVendorProfile);

router.put("/profile", verifyToken, updateVendorProfile);

router.patch("/profile-image", verifyToken, upload("profile").single("profileImage"), updateProfileImage);


// =======================================
// Services Routes
// =======================================

router.post("/services", verifyToken, upload("services").array("images", 8), addService);

router.get("/services", verifyToken, getVendorServices);

router.put("/services/:id", verifyToken , upload("services").array("images", 8), updateService);

router.delete("/services/:id" , verifyToken, deleteService);

router.patch("/services/:id/status", verifyToken, toggleServiceStatus);


// =======================================
// Category Routes
// =======================================

router.get("/categories", getCategories);

module.exports = router;