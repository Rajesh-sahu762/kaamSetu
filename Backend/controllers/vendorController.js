const User = require("../models/user");
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const path = require("path");
const { deleteFile } = require("../utils/fileHelper");

// ================================
// Get Vendor Profile
// ================================
const getVendorProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    // ==========================
    // User Details
    // ==========================
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================
    // Vendor Details
    // ==========================
    const vendor = await Vendor.findOne({ userId }).select("-__v");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // ==========================
    // Statistics
    // ==========================

    const [
  totalServices,
  totalReviews,
  completedBookings,
  pendingBookings,
  ratingResult,
  earnings,
   portfolio,
] = await Promise.all([
  Service.countDocuments({
    vendorId: vendor._id,
  }),
  

  Review.countDocuments({
    vendorId: vendor._id,
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "completed",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "pending",
  }),

  Review.aggregate([
    {
      $match: {
        vendorId: vendor._id,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]),

  Transaction.aggregate([
    {
      $match: {
        vendorId: vendor._id,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: {
          $sum: "$amount", // future me vendorAmount kar denge
        },
      },
    },
  ]),

  Service.find(
  { vendorId: vendor._id },
  {
    serviceName: 1,
    coverImage: 1,
    images: 1,
    rating: 1,
    totalBookings: 1,
  }
),


]);



const averageRating =
  ratingResult.length > 0
    ? Number(ratingResult[0].averageRating.toFixed(1))
    : 0;

const totalEarnings =
  earnings.length > 0
    ? earnings[0].totalEarnings
    : 0;

const profileCompletion =
  (
    [
      user.profileImage,
      vendor.bio,
      vendor.skills?.length,
      vendor.serviceAreas?.length,
      vendor.bankDetails?.bankName,
      vendor.aadhaarImage,
      vendor.panImage,
    ].filter(Boolean).length / 7
  ) * 100;

const businessHealth = Math.round(
  (
    profileCompletion +
    averageRating * 20 +
    (portfolio.length > 0 ? 100 : 40)
  ) / 3
);

const aiSuggestions = [];

if (!user.profileImage)
  aiSuggestions.push("Upload a profile photo.");

if (!vendor.skills?.length)
  aiSuggestions.push("Add your professional skills.");

if (!vendor.bankDetails?.bankName)
  aiSuggestions.push("Complete your bank details.");

if (!portfolio.length)
  aiSuggestions.push("Add service images to your portfolio.");

if (!vendor.serviceAreas?.length)
  aiSuggestions.push("Add your service areas.");

    // ==========================
    // Response
    // ==========================

    return res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully",

     data: {
  user,

  vendor,

  stats: {
    averageRating,
    totalReviews,
    totalServices,
    completedBookings,
    pendingBookings,
    totalEarnings,
    businessHealth,
    aiSuggestions,
  },
  profileCompletion,

  portfolio,
}

    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.user;

    // ===========================
    // File Validation
    // ===========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a profile image.",
      });
    }

    // ===========================
    // Find User
    // ===========================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ===========================
    // Delete Old Profile Image
    // ===========================

    if (user.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        user.profileImage
      );

      deleteFile(oldImagePath);
    }

    // ===========================
    // Save New Image
    // ===========================

    user.profileImage = req.file.filename;

    await user.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      fullName,
      mobile,

      businessName,
      businessType,
      experience,
      bio,

      address,
      city,
      state,
      pincode,

      radius,

      skills,

      bankDetails,
    } = req.body;

    // ===========================
    // Find User
    // ===========================

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===========================
    // Find Vendor
    // ===========================

    const vendor = await Vendor.findOne({ userId }).select("-__v");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // ===========================
    // User Update
    // ===========================

    if (fullName !== undefined) user.fullName = fullName;

    if (mobile !== undefined) user.mobile = mobile;

    await user.save();

    // ===========================
    // Vendor Update
    // ===========================

    if (businessName !== undefined)
      vendor.businessName = businessName;

    if (businessType !== undefined)
      vendor.businessType = businessType;

    if (experience !== undefined)
      vendor.experience = experience;

    if (bio !== undefined)
      vendor.bio = bio;

    if (address !== undefined)
      vendor.address = address;

    if (city !== undefined)
      vendor.city = city;

    if (state !== undefined)
      vendor.state = state;

    if (pincode !== undefined)
      vendor.pincode = pincode;

    if (radius !== undefined)
      vendor.radius = radius;

    if (skills !== undefined)
      vendor.skills = skills;

    if (bankDetails !== undefined)
      vendor.bankDetails = bankDetails;

    await vendor.save();

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",

      data: {
        user,
        vendor,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


module.exports = {
  getVendorProfile,
  updateVendorProfile,
  updateProfileImage
};
