const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const Service = require("../models/Service");
const Review = require("../models/Review");

// =======================================
// Helpers
// =======================================
const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
  return { start, end };
};

const paginate = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// =======================================
// DASHBOARD
// =======================================

// GET /admin/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const thisMonth = getMonthRange(0);
    const lastMonth = getMonthRange(1);

    const [
      revenueAgg,
      commissionAgg,
      totalBookings,
      activeVendors,
      activeCustomers,
      pendingVendorApprovals,
      ongoingServices,
      completedServices,
      cancelledBookings,
      revenueThisMonthAgg,
      revenueLastMonthAgg,
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$commission" } } },
      ]),
      Booking.countDocuments({}),
      Vendor.countDocuments({ status: "approved" }),
      User.countDocuments({ role: "customer", isActive: true }),
      Vendor.countDocuments({ status: "pending" }),
      Booking.countDocuments({
        status: { $in: ["accepted", "on_the_way", "in_progress"] },
      }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: { $in: ["cancelled", "rejected"] } }),
      Transaction.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: thisMonth.start, $lt: thisMonth.end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: lastMonth.start, $lt: lastMonth.end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const platformCommission = commissionAgg[0]?.total || 0;
    const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;
    const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

    let monthlyGrowth = 0;
    if (revenueLastMonth > 0) {
      monthlyGrowth =
        ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;
    } else if (revenueThisMonth > 0) {
      monthlyGrowth = 100;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        activeVendors,
        activeCustomers,
        pendingVendorApprovals,
        ongoingServices,
        completedServices,
        cancelledBookings,
        platformCommission,
        monthlyGrowth: Number(monthlyGrowth.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/dashboard/charts?range=30 (days)
exports.getDashboardCharts = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.range) || 30, 365);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [revenueTrend, bookingTrend, cityWiseBookings, categoryPerformance] =
      await Promise.all([
        Transaction.aggregate([
          { $match: { status: "completed", createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              revenue: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Booking.aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Booking.aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $lookup: {
              from: "vendors",
              localField: "vendorId",
              foreignField: "_id",
              as: "vendor",
            },
          },
          { $unwind: "$vendor" },
          { $group: { _id: "$vendor.city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        Service.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $group: {
              _id: "$category.name",
              totalBookings: { $sum: "$totalBookings" },
            },
          },
          { $sort: { totalBookings: -1 } },
          { $limit: 10 },
        ]),
      ]);

    return res.status(200).json({
      success: true,
      data: { revenueTrend, bookingTrend, cityWiseBookings, categoryPerformance },
    });
  } catch (error) {
    console.error("getDashboardCharts error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/dashboard/recent-activity
exports.getRecentActivity = async (req, res) => {
  try {
    const [newVendors, newBookings, recentReviews] = await Promise.all([
      Vendor.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "fullName email"),
      Booking.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customerId", "fullName")
        .populate("vendorId", "businessName"),
      Review.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customerId", "fullName")
        .populate("vendorId", "businessName"),
    ]);

    return res.status(200).json({
      success: true,
      data: { newVendors, newBookings, recentReviews },
    });
  } catch (error) {
    console.error("getRecentActivity error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// VENDOR MANAGEMENT
// =======================================

// GET /admin/vendors?status=pending&search=&page=1&limit=20
exports.getVendors = async (req, res) => {
  try {
    const { status, search } = req.query;
    const { page, limit, skip } = paginate(req.query);

    const filter = {};
    if (status && status !== "all") filter.status = status;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { businessName: regex },
        { city: regex },
        { pincode: regex },
      ];
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .populate("userId", "fullName email mobile isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Vendor.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: vendors,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getVendors error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/vendors/:id
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate(
      "userId",
      "fullName email mobile isActive createdAt"
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const [services, bookingCount, avgRatingAgg] = await Promise.all([
      Service.find({ vendorId: vendor._id }),
      Booking.countDocuments({ vendorId: vendor._id }),
      Review.aggregate([
        { $match: { vendorId: vendor._id } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        vendor,
        services,
        bookingCount,
        rating: avgRatingAgg[0]?.avg || 0,
        reviewCount: avgRatingAgg[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("getVendorById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/vendors/:id/approve
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: "approved", approvedAt: new Date(), rejectionReason: "" },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // TODO: trigger notification/email to vendor here

    return res.status(200).json({ success: true, message: "Vendor approved", data: vendor });
  } catch (error) {
    console.error("approveVendor error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/vendors/:id/reject   body: { reason }
exports.rejectVendor = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: reason.trim() },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // TODO: trigger notification/email to vendor here

    return res.status(200).json({ success: true, message: "Vendor rejected", data: vendor });
  } catch (error) {
    console.error("rejectVendor error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/vendors/:id/request-reupload   body: { reason }
exports.requestVendorReupload = async (req, res) => {
  try {
    const { reason } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status: "pending",
        rejectionReason: reason?.trim() || "Please re-upload your documents.",
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Re-upload requested",
      data: vendor,
    });
  } catch (error) {
    console.error("requestVendorReupload error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/vendors/:id/suspend
exports.suspendVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    await User.findByIdAndUpdate(vendor.userId, {
      isActive: false,
      deactivatedAt: new Date(),
    });

    return res.status(200).json({ success: true, message: "Vendor suspended" });
  } catch (error) {
    console.error("suspendVendor error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/vendors/:id/activate
exports.activateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    await User.findByIdAndUpdate(vendor.userId, {
      isActive: true,
      deactivatedAt: null,
    });

    return res.status(200).json({ success: true, message: "Vendor activated" });
  } catch (error) {
    console.error("activateVendor error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// USER (CUSTOMER) MANAGEMENT
// =======================================

// GET /admin/users?search=&status=&page=1&limit=20
exports.getUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const { page, limit, skip } = paginate(req.query);

    const filter = { role: "customer" };
    if (status === "active") filter.isActive = true;
    if (status === "suspended") filter.isActive = false;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ fullName: regex }, { email: regex }, { mobile: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -otp -otpExpiresAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getUsers error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otp -otpExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const bookingHistory = await Booking.find({ customerId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("vendorId", "businessName")
      .populate("serviceId", "serviceName");

    return res.status(200).json({ success: true, data: { user, bookingHistory } });
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/users/:id/suspend
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, deactivatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User suspended", data: user });
  } catch (error) {
    console.error("suspendUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/users/:id/activate
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true, deactivatedAt: null },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User activated", data: user });
  } catch (error) {
    console.error("activateUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /admin/users/:id  (soft delete)
// NOTE: your User schema does not yet have an `isDeleted` field.
// Add this to models/User.js before using this endpoint:
//   isDeleted: { type: Boolean, default: false },
//   deletedAt: { type: Date, default: null },
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date(), isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted (soft)", data: user });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};