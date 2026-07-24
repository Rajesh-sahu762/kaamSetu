const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Vendor = require("../models/vendor");
const Category = require("../models/category");
const Review = require("../models/review");
const Service = require("../models/service");
const User = require("../models/user");
const Notification = require("../models/notification");

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
// GET /api/customer/bookings
// Customer-facing bookings list for the My Bookings UI.
// =======================================
exports.getCustomerBookings = async (req, res) => {
  try {
    const authUserId = req.user?.userId || req.user?._id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      status = "all",
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (currentPage - 1) * pageSize;

    const filter = {
      customerId: authUserId,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search?.trim()) {
      const searchTerm = search.trim();
      const vendors = await Vendor.find({
        businessName: { $regex: searchTerm, $options: "i" },
      }).select("_id");

      filter.$or = [
        {
          bookingNumber: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          address: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          vendorId: {
            $in: vendors.map((vendor) => vendor._id),
          },
        },
      ];
    }

    const [bookings, totalBookings, pending, accepted, onTheWay, inProgress, completed, cancelled, rejected] =
      await Promise.all([
        Booking.find(filter)
          .populate("vendorId", "businessName city state")
          .populate(
            "serviceId",
            "serviceName description startingPrice duration coverImage",
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize),
        Booking.countDocuments(filter),
        Booking.countDocuments({ customerId: authUserId, status: "pending" }),
        Booking.countDocuments({ customerId: authUserId, status: "accepted" }),
        Booking.countDocuments({ customerId: authUserId, status: "on_the_way" }),
        Booking.countDocuments({ customerId: authUserId, status: "in_progress" }),
        Booking.countDocuments({ customerId: authUserId, status: "completed" }),
        Booking.countDocuments({ customerId: authUserId, status: "cancelled" }),
        Booking.countDocuments({ customerId: authUserId, status: "rejected" }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: bookings,
      stats: {
        total: totalBookings,
        pending,
        accepted,
        onTheWay,
        inProgress,
        completed,
        cancelled,
        rejected,
        active: pending + accepted + onTheWay + inProgress,
      },
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalBookings / pageSize),
        totalBookings,
        pageSize,
      },
    });
  } catch (error) {
    console.error("getCustomerBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =======================================
// GET /api/customer/bookings/:bookingId
// Customer booking detail view for the track-booking flow.
// =======================================
exports.getCustomerBookingById = async (req, res) => {
  try {
    const authUserId = req.user?.userId || req.user?._id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      customerId: authUserId,
    })
      .populate("vendorId", "businessName city state bio")
      .populate(
        "serviceId",
        "serviceName description startingPrice duration coverImage",
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("getCustomerBookingById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =======================================
// PATCH /api/customer/bookings/:bookingId/cancel
// Customer cancellation flow for active bookings.
// =======================================
exports.cancelCustomerBooking = async (req, res) => {
  try {
    const authUserId = req.user?.userId || req.user?._id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      customerId: authUserId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (["completed", "cancelled", "rejected"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "customer";
    booking.cancelReason = req.body?.cancelReason || booking.cancelReason || "";

    await booking.save();

    const vendor = await Vendor.findById(booking.vendorId).select("userId");

    if (vendor?.userId) {
      await Notification.create({
        userId: vendor.userId,
        title: "Booking Cancelled",
        message: `A customer cancelled booking ${booking.bookingNumber}.`,
        type: "booking",
        referenceId: booking._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("cancelCustomerBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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
    // ===========================
    // Categories
    // ===========================

    const categoriesPromise = Category.find(
      { isActive: true },
      "name slug image description"
    ).sort({ name: 1 });

    // ===========================
    // Hero Stats
    // ===========================

    const heroPromise = Promise.all([
      Vendor.countDocuments({
        status: "approved",
      }),

      Category.countDocuments({
        isActive: true,
      }),

      Vendor.distinct("city", {
        status: "approved",
      }),

      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
          },
        },
      ]),
    ]);

    // ===========================
    // Featured Experts
    // ===========================

    const expertsPromise = Vendor.aggregate([
      {
        $match: {
          status: "approved",
        },
      },

      // --------------------------
      // User
      // --------------------------

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
        $match: {
          "user.isActive": true,
          "user.isDeleted": false,
        },
      },

      // --------------------------
      // Services
      // --------------------------

      {
        $lookup: {
          from: "services",
          let: {
            vendorId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$vendorId",
                        "$$vendorId",
                      ],
                    },
                    {
                      $eq: [
                        "$isActive",
                        true,
                      ],
                    },
                  ],
                },
              },
            },

            {
              $sort: {
                startingPrice: 1,
              },
            },

            {
              $project: {
                serviceName: 1,
                startingPrice: 1,
              },
            },
          ],
          as: "services",
        },
      },

      // --------------------------
      // Reviews
      // --------------------------

      {
        $lookup: {
          from: "reviews",
          let: {
            vendorId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$vendorId",
                    "$$vendorId",
                  ],
                },
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
          ],
          as: "reviewStats",
        },
      },

      // --------------------------
      // Bookings
      // --------------------------

      {
        $lookup: {
          from: "bookings",
          let: {
            vendorId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$vendorId",
                        "$$vendorId",
                      ],
                    },
                    {
                      $eq: [
                        "$status",
                        "completed",
                      ],
                    },
                  ],
                },
              },
            },

            {
              $count: "totalBookings",
            },
          ],
          as: "bookingStats",
        },
      },

      // --------------------------
      // Final Shape
      // --------------------------

      {
        $project: {
          businessName: 1,
          businessType: 1,
          city: 1,
          state: 1,
          experience: 1,

          profileImage:
            "$user.profileImage",

          name:
            "$user.fullName",

          servicesAvailable: {
            $size: "$services",
          },

          startingPrice: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$services.startingPrice",
                  0,
                ],
              },
              0,
            ],
          },

          averageRating: {
            $round: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: [
                      "$reviewStats.averageRating",
                      0,
                    ],
                  },
                  0,
                ],
              },
              1,
            ],
          },

          totalReviews: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$reviewStats.totalReviews",
                  0,
                ],
              },
              0,
            ],
          },

          totalBookings: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$bookingStats.totalBookings",
                  0,
                ],
              },
              0,
            ],
          },

          serviceHighlights: {
            $slice: [
              "$services.serviceName",
              3,
            ],
          },

          remainingServices: {
            $max: [
              {
                $subtract: [
                  {
                    $size: "$services",
                  },
                  3,
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $sort: {
          totalBookings: -1,
          averageRating: -1,
        },
      },

      {
        $limit: 6,
      },
    ]);

    // ===========================
    // Execute
    // ===========================

    const [
      categories,
      heroResult,
      featuredExperts,
    ] = await Promise.all([
      categoriesPromise,
      heroPromise,
      expertsPromise,
    ]);

    const hero = {
      verifiedExperts:
        heroResult[0],

      serviceCategories:
        heroResult[1],

      cities:
        heroResult[2].length,

      averageRating:
        heroResult[3].length > 0
          ? Number(
              heroResult[3][0]
                .averageRating.toFixed(1)
            )
          : 0,
    };

    return res.status(200).json({
      success: true,

      message:
        "Services page fetched successfully.",

      data: {
        hero,
        categories,
        featuredExperts,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};
