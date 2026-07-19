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

// =======================================
// SERVICE MANAGEMENT
// =======================================

// GET /admin/services?status=all&category=&search=&page=1&limit=20
exports.getServices = async (req, res) => {
  try {
    const { status = "all", category = "", search = "" } = req.query;
    const { page, limit, skip } = paginate(req.query);
    const filter = {};

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;
    if (category && isValidId(category)) filter.categoryId = category;

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ serviceName: regex }, { slug: regex }, { description: regex }];
    }

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate("vendorId", "businessName city state")
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: services,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getServices error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/services/:id/status
exports.updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid service ID." });
    if (typeof req.body.isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean." });
    }

    const service = await Service.findByIdAndUpdate(id, { isActive: req.body.isActive }, { new: true })
      .populate("vendorId", "businessName city state")
      .populate("categoryId", "name slug");
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });

    return res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? "activated" : "deactivated"} successfully.`,
      data: service,
    });
  } catch (error) {
    console.error("updateServiceStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /admin/services/:id
exports.deleteServiceListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid service ID." });

    const service = await Service.findByIdAndDelete(id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });

    return res.status(200).json({ success: true, message: "Service removed successfully." });
  } catch (error) {
    console.error("deleteServiceListing error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// REVIEW MANAGEMENT
// =======================================

// GET /admin/reviews?rating=all&reported=all&search=&page=1&limit=20
exports.getReviews = async (req, res) => {
  try {
    const { rating = "all", reported = "all", search = "" } = req.query;
    const { page, limit, skip } = paginate(req.query);

    const match = {};
    if (rating !== "all" && [1, 2, 3, 4, 5].includes(Number(rating))) {
      match.rating = Number(rating);
    }
    if (reported === "reported") match.isReported = true;
    if (reported === "clean") match.isReported = { $ne: true };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
    ];

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { review: regex },
            { reportReason: regex },
            { "customer.fullName": regex },
            { "vendor.businessName": regex },
            { "service.serviceName": regex },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              rating: 1,
              review: 1,
              vendorReply: 1,
              vendorRepliedAt: 1,
              isReported: 1,
              reportReason: 1,
              reportedAt: 1,
              createdAt: 1,
              "customer._id": 1,
              "customer.fullName": 1,
              "customer.email": 1,
              "vendor._id": 1,
              "vendor.businessName": 1,
              "service._id": 1,
              "service.serviceName": 1,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const [result] = await Review.aggregate(pipeline);
    const reviews = result?.data || [];
    const total = result?.total?.[0]?.count || 0;

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getReviews error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/reviews/:id/resolve-report
exports.resolveReviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid review ID." });

    const review = await Review.findByIdAndUpdate(
      id,
      { isReported: false, reportReason: "", reportedAt: null },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    return res.status(200).json({ success: true, message: "Report dismissed. The review remains published.", data: review });
  } catch (error) {
    console.error("resolveReviewReport error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /admin/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid review ID." });

    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    return res.status(200).json({ success: true, message: "Review removed successfully." });
  } catch (error) {
    console.error("deleteReview error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// TRANSACTION / PAYMENT MANAGEMENT
// =======================================

const TRANSACTION_STATUSES = ["pending", "completed", "failed", "refunded"];
const SETTLEMENT_STATUSES = ["pending", "processing", "settled"];
const PAYMENT_METHODS = ["cash", "card", "online"];

// GET /admin/transactions?status=all&settlement=all&method=all&search=&page=1&limit=20
exports.getTransactions = async (req, res) => {
  try {
    const { status = "all", settlement = "all", method = "all", search = "" } = req.query;
    const { page, limit, skip } = paginate(req.query);

    const match = {};
    if (status !== "all" && TRANSACTION_STATUSES.includes(status)) match.status = status;
    if (settlement !== "all" && SETTLEMENT_STATUSES.includes(settlement)) match.settlementStatus = settlement;
    if (method !== "all" && PAYMENT_METHODS.includes(method)) match.paymentMethod = method;

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
    ];

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { gatewayTransactionId: regex },
            { gatewayOrderId: regex },
            { "customer.fullName": regex },
            { "vendor.businessName": regex },
            { "booking.bookingNumber": regex },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              amount: 1,
              vendorAmount: 1,
              commission: 1,
              commissionRate: 1,
              currency: 1,
              status: 1,
              settlementStatus: 1,
              paymentMethod: 1,
              paymentGateway: 1,
              gatewayTransactionId: 1,
              gatewayOrderId: 1,
              remarks: 1,
              createdAt: 1,
              "customer._id": 1,
              "customer.fullName": 1,
              "customer.mobile": 1,
              "vendor._id": 1,
              "vendor.businessName": 1,
              "booking._id": 1,
              "booking.bookingNumber": 1,
              "booking.bookingDate": 1,
            },
          },
        ],
        summary: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              totalCommission: { $sum: "$commission" },
              totalVendorAmount: { $sum: "$vendorAmount" },
              pendingSettlementAmount: {
                $sum: { $cond: [{ $ne: ["$settlementStatus", "settled"] }, "$vendorAmount", 0] },
              },
              completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
              refundedCount: { $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] } },
              failedCount: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const [result] = await Transaction.aggregate(pipeline);
    const transactions = result?.data || [];
    const total = result?.total?.[0]?.count || 0;
    const summary = result?.summary?.[0] || {
      totalAmount: 0,
      totalCommission: 0,
      totalVendorAmount: 0,
      pendingSettlementAmount: 0,
      completedCount: 0,
      refundedCount: 0,
      failedCount: 0,
    };

    return res.status(200).json({
      success: true,
      data: transactions,
      summary,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getTransactions error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/transactions/:id/settlement
exports.updateSettlementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid transaction ID." });
    if (!SETTLEMENT_STATUSES.includes(req.body.settlementStatus)) {
      return res.status(400).json({ success: false, message: "A valid settlement status is required." });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { settlementStatus: req.body.settlementStatus },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found." });

    return res.status(200).json({
      success: true,
      message: `Payout marked as ${transaction.settlementStatus}.`,
      data: transaction,
    });
  } catch (error) {
    console.error("updateSettlementStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /admin/transactions/:id/status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: "Invalid transaction ID." });
    if (!TRANSACTION_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "A valid transaction status is required." });
    }
    if (req.body.status === "refunded" && !req.body.remarks?.trim()) {
      return res.status(400).json({ success: false, message: "A remark is required when marking a transaction as refunded." });
    }

    const updates = { status: req.body.status };
    if (typeof req.body.remarks === "string") updates.remarks = req.body.remarks.trim();

    const transaction = await Transaction.findByIdAndUpdate(id, updates, { new: true });
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found." });

    return res.status(200).json({
      success: true,
      message: `Transaction marked as ${transaction.status}.`,
      data: transaction,
    });
  } catch (error) {
    console.error("updateTransactionStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};