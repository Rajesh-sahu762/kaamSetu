const User = require("../models/user");
const Vendor = require("../models/vendor");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Service = require("../models/service");
const Review = require("../models/review");
const Category = require("../models/category");

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

const setAccountActivation = async ({ userId, isActive, role }) =>
  User.findOneAndUpdate(
    {
      _id: userId,
      ...(role ? { role } : {}),
      isDeleted: { $ne: true },
    },
    {
      isActive,
      deactivatedAt: isActive ? null : new Date(),
    },
    { new: true }
  ).select("-password -otp -otpExpiresAt");

const toSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

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

    const filter = { role: "customer", isDeleted: { $ne: true } };
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
    const user = await User.findOne({
      _id: req.params.id,
      role: "customer",
      isDeleted: { $ne: true },
    }).select(
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
    const user = await setAccountActivation({
      userId: req.params.id,
      isActive: false,
      role: "customer",
    });

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
    const user = await setAccountActivation({
      userId: req.params.id,
      isActive: true,
      role: "customer",
    });

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
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "customer",
        isDeleted: { $ne: true },
      },
      { isDeleted: true, deletedAt: new Date(), isActive: false },
      { new: true }
    ).select("-password -otp -otpExpiresAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted (soft)", data: user });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// CATEGORY MANAGEMENT
// =======================================

// GET /admin/categories?status=all&search=&page=1&limit=20
exports.getCategories = async (req, res) => {
  try {
    const { status = "all", search = "" } = req.query;
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { slug: regex }, { description: regex }];
    }

    const [categories, total] = await Promise.all([
      Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: categories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /admin/categories
exports.createCategory = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const slug = toSlug(req.body.slug || name);

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "A category name is required." });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({ success: false, message: "A category with this name or slug already exists." });
    }

    const category = await Category.create({
      name,
      slug,
      description: req.body.description?.trim() || "",
      image: req.body.image?.trim() || "",
    });

    return res.status(201).json({ success: true, message: "Category created successfully.", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A category with this name or slug already exists." });
    }
    console.error("createCategory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /admin/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid category ID." });

    const updates = {};
    if (typeof req.body.name === "string") {
      const name = req.body.name.trim();
      if (!name) return res.status(400).json({ success: false, message: "A category name is required." });
      updates.name = name;
    }
    if (typeof req.body.slug === "string") {
      const slug = toSlug(req.body.slug);
      if (!slug) return res.status(400).json({ success: false, message: "A valid category slug is required." });
      updates.slug = slug;
    }
    if (typeof req.body.description === "string") updates.description = req.body.description.trim();
    if (typeof req.body.image === "string") updates.image = req.body.image.trim();

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "Provide at least one category field to update." });
    }

    const duplicateFilter = { _id: { $ne: id }, $or: [] };
    if (updates.name) duplicateFilter.$or.push({ name: new RegExp(`^${updates.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
    if (updates.slug) duplicateFilter.$or.push({ slug: updates.slug });
    if (duplicateFilter.$or.length && await Category.exists(duplicateFilter)) {
      return res.status(409).json({ success: false, message: "A category with this name or slug already exists." });
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    return res.status(200).json({ success: true, message: "Category updated successfully.", data: category });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A category with this name or slug already exists." });
    console.error("updateCategory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/categories/:id/status
exports.updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid category ID." });
    if (typeof req.body.isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean." });
    }

    const category = await Category.findByIdAndUpdate(id, { isActive: req.body.isActive }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    return res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"} successfully.`,
      data: category,
    });
  } catch (error) {
    console.error("updateCategoryStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
