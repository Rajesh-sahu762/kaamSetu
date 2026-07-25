const mongoose = require("mongoose");

const User = require("../models/user");
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Booking = require("../models/booking");
const Review = require("../models/review");
const Notification = require("../models/notification");
const Category = require("../models/category");

// =======================================
// Helpers
// =======================================

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const RESPONSE_WINDOW_HOURS = 2;

// Matches the Booking.status enum exactly — single source of truth for
// human-readable labels so every response (list/detail/dashboard) agrees.
const STATUS_LABEL = {
  pending: "Pending",
  accepted: "Accepted",
  on_the_way: "On The Way",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

// Buckets power the tab filters on MyBookingsPage (Active / Completed / Cancelled)
// without the frontend needing to know every individual status value.
const BUCKET_BY_STATUS = {
  pending: "active",
  accepted: "active",
  on_the_way: "active",
  in_progress: "active",
  completed: "completed",
  cancelled: "cancelled",
  rejected: "cancelled",
};

const BUCKET_STATUSES = {
  active: ["pending", "accepted", "on_the_way", "in_progress"],
  completed: ["completed"],
  cancelled: ["cancelled", "rejected"],
};

// Drives the step-tracker on TrackBookingPage.
const TIMELINE_STEPS = ["pending", "accepted", "on_the_way", "in_progress", "completed"];
const TIMELINE_LABELS = ["Booking Placed", "Accepted", "On The Way", "Service Started", "Completed"];

const CANCELLABLE_STATUSES = ["pending", "accepted"];

const formatDateLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

// Generates booking numbers in the same KS-<year>-<6 digits> shape already used
// across the product (admin/vendor tables, mock UI data) and guarantees uniqueness.
const generateBookingNumber = async () => {
  const year = new Date().getFullYear();
  let bookingNumber;
  let exists = true;

  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    bookingNumber = `KS-${year}-${random}`;
    exists = await Booking.exists({ bookingNumber });
  }

  return bookingNumber;
};

// One shared shape for every booking the client panel renders — list, detail, dashboard —
// so the frontend never has to reformat dates/status/labels itself.
const formatBookingSummary = (booking, hasReview = false) => {
  const vendor = booking.vendorId && typeof booking.vendorId === "object" ? booking.vendorId : null;
  const service = booking.serviceId && typeof booking.serviceId === "object" ? booking.serviceId : null;

  return {
    id: booking._id,
    bookingNumber: booking.bookingNumber,
    expert: vendor?.businessName || "Vendor",
    vendorId: vendor?._id || booking.vendorId,
    service: service?.serviceName || "Service",
    serviceId: service?._id || booking.serviceId,
    image: service?.coverImage || "",
    date: formatDateLabel(booking.bookingDate),
    bookingDate: booking.bookingDate,
    time: booking.bookingTime,
    location: booking.address,
    notes: booking.notes,
    status: STATUS_LABEL[booking.status] || booking.status,
    statusValue: booking.status,
    bucket: BUCKET_BY_STATUS[booking.status] || "active",
    paymentStatus: booking.paymentStatus,
    paymentMethod: booking.paymentMethod,
    totalAmount: booking.totalAmount,
    cancelledBy: booking.cancelledBy || "",
    cancelReason: booking.cancelReason || "",
    canCancel: CANCELLABLE_STATUSES.includes(booking.status),
    canReview: booking.status === "completed" && !hasReview,
    hasReview,
    createdAt: booking.createdAt,
  };
};

// =======================================
// PROFILE
// =======================================

// GET /api/customer/profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const [totalBookings, completedBookings, distinctAddresses] = await Promise.all([
      Booking.countDocuments({ customerId: userId }),
      Booking.countDocuments({ customerId: userId, status: "completed" }),
      Booking.distinct("address", { customerId: userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: {
        user,
        stats: {
          totalBookings,
          completedBookings,
          savedAddresses: distinctAddresses.filter(Boolean).length,
        },
      },
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/customer/profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fullName, mobile } = req.body;

    const updates = {};

    if (typeof fullName === "string") {
      if (!fullName.trim()) {
        return res.status(400).json({ success: false, message: "Full name cannot be empty." });
      }
      updates.fullName = fullName.trim();
    }

    if (typeof mobile === "string") {
      const trimmedMobile = mobile.trim();
      if (trimmedMobile && !/^\d{10}$/.test(trimmedMobile)) {
        return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
      }
      if (trimmedMobile) {
        const mobileTaken = await User.findOne({ mobile: trimmedMobile, _id: { $ne: userId } });
        if (mobileTaken) {
          return res.status(409).json({ success: false, message: "This mobile number is already in use." });
        }
        updates.mobile = trimmedMobile;
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "Nothing to update." });
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// DASHBOARD
// =======================================

// GET /api/customer/dashboard-summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.user;
    const customerObjectId = new mongoose.Types.ObjectId(userId);

    const [user, statusCounts, distinctAddresses, recentBookings] = await Promise.all([
      User.findById(userId).select("fullName email mobile profileImage isVerified createdAt"),
      Booking.aggregate([
        { $match: { customerId: customerObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Booking.distinct("address", { customerId: userId }),
      Booking.find({ customerId: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("serviceId", "serviceName coverImage")
        .populate("vendorId", "businessName"),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const countsByStatus = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalBookings = Object.values(countsByStatus).reduce((sum, value) => sum + value, 0);
    const completedBookings = countsByStatus.completed || 0;
    const activeBookings = BUCKET_STATUSES.active.reduce((sum, status) => sum + (countsByStatus[status] || 0), 0);

    const recentActivity = recentBookings.map((booking) => ({
      id: booking._id,
      title: `${booking.serviceId?.serviceName || "Service"} · ${STATUS_LABEL[booking.status] || booking.status}`,
      vendor: booking.vendorId?.businessName || "",
      status: booking.status,
      time: booking.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully.",
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
// BOOKINGS
// =======================================

// POST /api/customer/bookings
exports.createBooking = async (req, res) => {
  try {
    const { userId } = req.user;
    const { vendorId, serviceId, bookingDate, bookingTime, address, notes = "", paymentMethod = "cash" } = req.body;

    if (!vendorId || !serviceId || !bookingDate || !bookingTime || !address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vendor, service, date, time, and address are required.",
      });
    }

    if (!isValidId(vendorId) || !isValidId(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor or service ID." });
    }

    if (!["cash", "card", "online"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method." });
    }

    const parsedDate = new Date(bookingDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid booking date." });
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (parsedDate < startOfToday) {
      return res.status(400).json({ success: false, message: "Booking date cannot be in the past." });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }
    if (vendor.status !== "approved") {
      return res.status(400).json({ success: false, message: "This vendor is not approved for bookings yet." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }
    if (service.vendorId.toString() !== vendorId) {
      return res.status(400).json({ success: false, message: "This service does not belong to the selected vendor." });
    }
    if (!service.isActive) {
      return res.status(400).json({ success: false, message: "This service is currently unavailable." });
    }

    const bookingNumber = await generateBookingNumber();
    const responseDeadline = new Date(Date.now() + RESPONSE_WINDOW_HOURS * 60 * 60 * 1000);

    const booking = await Booking.create({
      customerId: userId,
      vendorId,
      serviceId,
      bookingNumber,
      bookingDate: parsedDate,
      bookingTime,
      address: address.trim(),
      notes: notes?.trim() || "",
      totalAmount: service.startingPrice,
      paymentMethod,
      responseDeadline,
    });

    await Notification.create({
      userId: vendor.userId,
      title: "New Booking Request",
      message: `You have a new booking request (${bookingNumber}) for ${service.serviceName}.`,
      type: "booking",
      referenceId: booking._id,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("vendorId", "businessName city state")
      .populate("serviceId", "serviceName coverImage startingPrice priceType duration");

    return res.status(201).json({
      success: true,
      message: "Booking placed successfully.",
      data: formatBookingSummary(populatedBooking),
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/customer/bookings?status=active&search=&page=1&limit=10
exports.getMyBookings = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status = "all", search = "", page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = { customerId: userId };

    if (status !== "all") {
      if (BUCKET_STATUSES[status]) {
        filter.status = { $in: BUCKET_STATUSES[status] };
      } else if (STATUS_LABEL[status]) {
        filter.status = status;
      }
    }

    if (search.trim()) {
      filter.bookingNumber = { $regex: search.trim(), $options: "i" };
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("vendorId", "businessName city state")
        .populate("serviceId", "serviceName coverImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(filter),
    ]);

    const completedIds = bookings.filter((b) => b.status === "completed").map((b) => b._id);
    const existingReviews = completedIds.length
      ? await Review.find({ bookingId: { $in: completedIds }, customerId: userId }).select("bookingId")
      : [];
    const reviewedBookingIds = new Set(existingReviews.map((r) => r.bookingId.toString()));

    const data = bookings.map((booking) =>
      formatBookingSummary(booking, reviewedBookingIds.has(booking._id.toString())),
    );

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("getMyBookings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/customer/bookings/:bookingId
exports.getBookingById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID." });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId })
      .populate("vendorId", "businessName city state address userId")
      .populate(
        "serviceId",
        "serviceName description startingPrice priceType duration coverImage images",
      );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    let vendorContact = null;
    if (booking.vendorId?.userId) {
      vendorContact = await User.findById(booking.vendorId.userId).select("fullName mobile profileImage");
    }

    const existingReview = await Review.findOne({ bookingId: booking._id, customerId: userId });

    const isTerminatedEarly = ["cancelled", "rejected"].includes(booking.status);
    const currentStep = isTerminatedEarly ? -1 : TIMELINE_STEPS.indexOf(booking.status);

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully.",
      data: {
        ...formatBookingSummary(booking, Boolean(existingReview)),
        vendor: {
          id: booking.vendorId?._id,
          name: booking.vendorId?.businessName || "",
          city: booking.vendorId?.city || "",
          state: booking.vendorId?.state || "",
          contactName: vendorContact?.fullName || "",
          contactPhone: vendorContact?.mobile || "",
          profileImage: vendorContact?.profileImage || "",
        },
        service: {
          id: booking.serviceId?._id,
          name: booking.serviceId?.serviceName || "",
          description: booking.serviceId?.description || "",
          priceType: booking.serviceId?.priceType,
          duration: booking.serviceId?.duration,
          coverImage: booking.serviceId?.coverImage || "",
          images: booking.serviceId?.images || [],
        },
        timeline: {
          steps: TIMELINE_LABELS,
          currentStep,
          isCancelled: isTerminatedEarly,
        },
      },
    });
  } catch (error) {
    console.error("getBookingById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/customer/bookings/:bookingId/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;
    const { reason = "" } = req.body;

    if (!isValidId(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID." });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId }).populate(
      "vendorId",
      "userId businessName",
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (!CANCELLABLE_STATUSES.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `A booking that is ${STATUS_LABEL[booking.status] || booking.status} can no longer be cancelled.`,
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "customer";
    booking.cancelReason = reason?.trim() || "Cancelled by customer.";
    await booking.save();

    if (booking.vendorId?.userId) {
      await Notification.create({
        userId: booking.vendorId.userId,
        title: "Booking Cancelled",
        message: `Booking ${booking.bookingNumber} was cancelled by the customer.`,
        type: "booking",
        referenceId: booking._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: formatBookingSummary(booking),
    });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================================
// REVIEWS
// =======================================

// POST /api/customer/bookings/:bookingId/review
exports.createReview = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;
    const { rating, review = "" } = req.body;

    if (!isValidId(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID." });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "A rating between 1 and 5 is required." });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId }).populate(
      "vendorId",
      "userId businessName",
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ success: false, message: "You can only review a completed booking." });
    }

    const existingReview = await Review.findOne({ bookingId: booking._id, customerId: userId });
    if (existingReview) {
      return res.status(409).json({ success: false, message: "You have already reviewed this booking." });
    }

    const newReview = await Review.create({
      customerId: userId,
      vendorId: booking.vendorId._id,
      serviceId: booking.serviceId,
      bookingId: booking._id,
      rating: numericRating,
      review: review?.trim() || "",
    });

    if (booking.vendorId?.userId) {
      await Notification.create({
        userId: booking.vendorId.userId,
        title: "New Review Received",
        message: `You received a ${numericRating}-star review for booking ${booking.bookingNumber}.`,
        type: "review",
        referenceId: newReview._id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: newReview,
    });
  } catch (error) {
    console.error("createReview error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// =======================================
// GET /customer/services
// =======================================

exports.getServices = async (req, res) => {
  try {
    const {
      category = "",
      search = "",
      sort = "newest",
    } = req.query;

    const { page, limit, skip } = paginate(req.query);

    const filter = {
      isActive: true,
    };

    // Category Filter
    if (category && isValidId(category)) {
      filter.categoryId = category;
    }

    // Search
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");

      filter.$or = [
        { serviceName: regex },
        { description: regex },
        { slug: regex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "price-low":
        sortOption = { startingPrice: 1 };
        break;

      case "price-high":
        sortOption = { startingPrice: -1 };
        break;

      case "popular":
        sortOption = { totalBookings: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const [services, total, categories] = await Promise.all([
  Service.find(filter)
    .populate("vendorId", "businessName city state profileImage")
    .populate("categoryId", "name slug")
    .sort(sortOption)
    .skip(skip)
    .limit(limit),

  Service.countDocuments(filter),

  Category.find({ isActive: true })
    .select("name slug")
    .sort({ name: 1 }),
]);

   return res.status(200).json({
  success: true,

  data: {
    services,
    categories,
  },

  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
});
  } catch (error) {
    console.error("Customer getServices error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};