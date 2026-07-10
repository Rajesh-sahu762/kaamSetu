const User = require("../models/user");
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

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
]);

const averageRating =
  ratingResult.length > 0
    ? Number(ratingResult[0].averageRating.toFixed(1))
    : 0;

const totalEarnings =
  earnings.length > 0
    ? earnings[0].totalEarnings
    : 0;

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
        },
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

const updateVendorProfile = async (req, res) =>   {

    res.status(200).json({ message: "Vendor profile updated successfully" });
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
};
