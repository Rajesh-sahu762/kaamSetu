const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Vendor = require("../models/vendor");
const Category = require("../models/category");
const Review = require("../models/review");
const Service = require("../models/service");
const User = require("../models/user");

// =======================================
// helpers
// =======================================
const ACTIVE_STATUSES = ["pending", "accepted", "on_the_way", "in_progress"];

const STATUS_LABEL = {
  pending: "Booking placed",
  accepted: "Booking accepted",
  on_the_way: "Vendor on the way",
  in_progress: "Service in progress",
  completed: "Booking completed",
  cancelled: "Booking cancelled",
  rejected: "Booking rejected",
};

// =======================================
// GET /api/customer/dashboard-summary
// Powers the client dashboard (profile page) with real, per-user data.
// =======================================
exports.getDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.user;
    const customerObjectId = new mongoose.Types.ObjectId(userId);

    const [user, statusCounts, distinctAddresses, recentBookings] =
      await Promise.all([
        User.findById(userId).select(
          "fullName email mobile profileImage isVerified createdAt",
        ),
        Booking.aggregate([
          { $match: { customerId: customerObjectId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Booking.distinct("address", { customerId: userId }),
        Booking.find({ customerId: userId })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate("serviceId", "serviceName")
          .populate("vendorId", "businessName"),
      ]);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const countsByStatus = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalBookings = Object.values(countsByStatus).reduce(
      (sum, value) => sum + value,
      0,
    );
    const completedBookings = countsByStatus.completed || 0;
    const activeBookings = ACTIVE_STATUSES.reduce(
      (sum, status) => sum + (countsByStatus[status] || 0),
      0,
    );

    const recentActivity = recentBookings.map((booking) => ({
      id: booking._id,
      title: `${booking.serviceId?.serviceName || "Service"} · ${STATUS_LABEL[booking.status] || booking.status}`,
      vendor: booking.vendorId?.businessName || "",
      status: booking.status,
      time: booking.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: {
        profile: user,
        stats: {
          totalBookings,
          activeBookings,
          completedBookings,
          savedAddresses: distinctAddresses.filter(Boolean).length,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error("getDashboardSummary error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// HOME PAGE
// GET /api/customer/home
// =======================================
exports.getHomeData = async (req, res) => {
  try {
    const [
  verifiedExperts,
  jobsCompleted,
  happyCustomers,
  categoryData,
  serviceCategories,
  featuredExperts,
  reviewStats,
  testimonials,
] = await Promise.all([
      // Hero Stats
      Vendor.countDocuments({
        status: "approved",
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      User.countDocuments({
        role: "customer",
        isVerified: true,
        isDeleted: false,
        isActive: true,
      }),

      // Popular Categories
      Category.find({ isActive: true })
        .select("name image slug")
        .sort({ name: 1 }),

        Category.countDocuments({
   isActive:true
}),

    // Featured Experts
Vendor.aggregate([
  {
    $match: {
      status: "approved",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $project: {
      _id: 1,
      name: "$user.fullName",
      image: "$user.profileImage",
      city: 1,
      experience: 1,
      rating: {
        $ifNull: ["$rating", 0],
      },
      jobs: {
        $ifNull: ["$completedJobs", 0],
      },
    },
  },
  {
    $sort: {
      approvedAt: -1,
    },
  },
  {
    $limit: 6,
  },
]),
      // Review Stats
      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),

      // Latest Testimonials
      Review.find({
  isReported: false,
})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("customerId", "fullName profileImage")
        .populate("serviceId", "serviceName"),
    ]);

    const averageRating =
reviewStats.length > 0
? Number(reviewStats[0].averageRating.toFixed(1))
:0;

    const satisfactionRate = Math.round((averageRating / 5) * 100);

    return res.status(200).json({
  success: true,
  data: {
    hero: {
      verifiedExperts,
      jobsCompleted,
      satisfactionRate,
    },

    stats: {
      happyCustomers,
      verifiedExperts,
      serviceCategories,
      averageRating,
      customerReviews:
        reviewStats.length > 0 ? reviewStats[0].totalReviews : 0,
      satisfactionRate,
    },

    categories: categoryData,

    featuredExperts,

    testimonials,
  },
});
  } catch (error) {
    console.error("getHomeData:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =======================================
// GET /api/customer/expert/:vendorId
// =======================================
exports.getExpertProfile = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor id",
      });
    }

    const [
      vendor,
      services,
      reviews,
      reviewStats,
      completedJobs,
      ratingBreakdown,
    ] = await Promise.all([
      Vendor.findOne({
        _id: vendorId,
        status: "approved",
      }).populate({
        path: "userId",
        select: "fullName profileImage",
      }),

      Service.find({
        vendorId,
        isActive: true,
      })
        .select(
          "serviceName description startingPrice duration coverImage"
        )
        .sort({ serviceName: 1 }),

      Review.find({
        vendorId,
        isReported: false,
      })
        .populate("customerId", "fullName profileImage")
        .sort({ createdAt: -1 }),

      Review.aggregate([
        {
          $match: {
            vendorId: new mongoose.Types.ObjectId(vendorId),
            isReported: false,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
            totalReviews: {
              $sum: 1,
            },
          },
        },
      ]),

      Booking.countDocuments({
        vendorId,
        status: "completed",
      }),

      Review.aggregate([
        {
          $match: {
            vendorId: new mongoose.Types.ObjectId(vendorId),
            isReported: false,
          },
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Expert not found",
      });
    }

    const averageRating =
      reviewStats.length > 0
        ? Number(reviewStats[0].averageRating.toFixed(1))
        : 0;

    const totalReviews =
      reviewStats.length > 0
        ? reviewStats[0].totalReviews
        : 0;

    const breakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingBreakdown.forEach((item) => {
      breakdown[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,

      data: {
        expert: {
    _id: vendor._id,

    businessName: vendor.businessName,

    name: vendor.userId.fullName,

    image: vendor.userId.profileImage,

    bio: vendor.bio,

    city: vendor.city,

    state: vendor.state,

    experience: vendor.experience,

    verified: vendor.status === "approved",

    servicesAvailable: services.length,
},

        stats: {
          averageRating,

          totalReviews,

          completedJobs,
        },

        services,

        reviews,

        ratingBreakdown: breakdown,
      },
    });
  } catch (error) {
    console.error("getExpertProfile:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.getServicesPage = async (req, res) => {
  try {

    const [
      categories,
      vendors,
      reviews
    ] = await Promise.all([

      Category.find({
        isActive: true,
      })
      .sort({
        name: 1,
      }),

      Vendor.find()
      .populate(
        "userId",
        "fullName profileImage"
      ),

      Review.find()
    ]);

    const vendorCards = await Promise.all(

      vendors.map(async (vendor) => {

        const vendorServices =
          await Service.find({
            vendorId: vendor._id,
            isActive: true,
          });

        const vendorReviews =
          reviews.filter(
            (review) =>
              review.vendorId.toString() ===
              vendor._id.toString()
          );

        const totalReviews =
          vendorReviews.length;

        const averageRating =
          totalReviews > 0
            ? (
                vendorReviews.reduce(
                  (sum, review) =>
                    sum + review.rating,
                  0
                ) / totalReviews
              ).toFixed(1)
            : 0;

        const startingPrice =
          vendorServices.length > 0
            ? Math.min(
                ...vendorServices.map(
                  (service) =>
                    service.startingPrice
                )
              )
            : 0;

        return {

          _id: vendor._id,

          businessName:
            vendor.businessName,

          businessType:
            vendor.businessType,

          city: vendor.city,

          state: vendor.state,

          experience:
            vendor.experience,

          servicesAvailable:
            vendorServices.length,

          averageRating,

          totalReviews,

          startingPrice,

          profileImage:
            vendor.userId?.profileImage,

          name:
            vendor.userId?.fullName,

          verified: true,
        };
      })
    );

    const hero = {

      verifiedExperts:
        vendorCards.length,

      serviceCategories:
        categories.length,

      cities: new Set(
        vendorCards.map(
          (vendor) => vendor.city
        )
      ).size,

      averageRating:
        vendorCards.length > 0
          ? (
              vendorCards.reduce(
                (sum, vendor) =>
                  sum +
                  Number(
                    vendor.averageRating
                  ),
                0
              ) /
              vendorCards.length
            ).toFixed(1)
          : 0,
    };

    res.status(200).json({

      success: true,

      data: {

        hero,

        categories,

        vendors: vendorCards,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch services page.",
    });

  }
};

