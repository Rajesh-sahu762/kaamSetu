const User = require("../models/user");
const Vendor = require("../models/vendor");

// ================================
// Get Vendor Profile
// ================================
const getVendorProfile = async (req, res) => {
  try {
    // Logged in user id (JWT se aayegi)
    const { userId } = req.user;

    // User details
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Vendor details
    const vendor = await Vendor.findOne({ userId }).select("-__v");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // Merge User + Vendor Data
    const profile = {
      ...user.toObject(),
      ...vendor.toObject(),
    };

    // Duplicate field remove
    delete profile._id;
    delete profile.userId;

    return res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully",
      data: profile,
    });

  } catch (error) {
    console.error("Get Vendor Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateVendorProfile = async (req, res) =>   {

    res.status(200).json({ message: "Vendor profile updated successfully" });
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
};
