// controllers/customerController.js
//
// Everything a logged-in customer needs for the booking flow that didn't
// exist before: create a booking, see their own bookings, cancel one,
// manage their profile, and leave a review after a completed booking.
// Payment itself is NOT duplicated here — CheckoutPage still calls the
// existing /api/payment/create-order + /api/payment/verify (paymentService.js),
// which already expects a Booking to exist first. createBooking below is
// exactly that missing first step.

const Booking = require("../models/booking");
const Service = require("../models/service");
const Vendor = require("../models/vendor");
const Review = require("../models/review");
const User = require("../models/user");
const Notification = require("../models/notification");
const generateBookingNumber = require("../utils/generateBookingNumber");
const path = require("path");
const { deleteFile } = require("../utils/fileHelper");

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

// ==========================================
// Create Booking
// POST /api/customer/bookings
// body: { serviceId, bookingDate, bookingTime, address, notes, paymentMethod }
// ==========================================
const createBooking = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      serviceId,
      bookingDate,
      bookingTime,
      address,
      notes,
      paymentMethod,
    } = req.body;

    if (!serviceId || !isValidId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "A valid service is required.",
      });
    }

    if (!bookingDate || !bookingTime || !address) {
      return res.status(400).json({
        success: false,
        message: "Booking date, time and address are required.",
      });
    }

    const service = await Service.findOne({ _id: serviceId, isActive: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const vendor = await Vendor.findById(service.vendorId);

    if (!vendor || vendor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This service is not currently available for booking.",
      });
    }

    // Vendor gets a fixed window to accept/reject before the booking
    // auto-expires — matches the responseDeadline field already on the
    // Booking model (read by the vendor flow, never written until now).
    const responseDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const booking = await Booking.create({
      customerId: userId,
      vendorId: vendor._id,
      serviceId: service._id,
      bookingNumber: generateBookingNumber(),
      bookingDate,
      bookingTime,
      address,
      notes: notes || "",
      totalAmount: service.startingPrice,
      paymentMethod: paymentMethod || "cash",
      responseDeadline,
    });

    await Notification.create({
      userId: vendor.userId,
      title: "New Booking Request",
      message: `You have a new booking request (${booking.bookingNumber}) for ${service.serviceName}.`,
      type: "booking",
      referenceId: booking._id,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get My Bookings
// GET /api/customer/bookings?status=&page=&limit=
// ==========================================
const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { customerId: userId };

    if (status && status !== "all") {
      filter.status = status;
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .populate("serviceId", "serviceName coverImage startingPrice duration")
        .populate("vendorId", "businessName city")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Booking.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: bookings,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalBookings / pageSize),
        totalBookings,
        pageSize,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get My Booking By Id (for TrackBookingPage)
// GET /api/customer/bookings/:bookingId
// ==========================================
const getMyBookingById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id.",
      });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId })
      .populate("serviceId", "serviceName coverImage startingPrice duration")
      .populate({
        path: "vendorId",
        select: "businessName city bio",
        populate: { path: "userId", select: "fullName mobile profileImage" },
      });

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
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Cancel My Booking
// PATCH /api/customer/bookings/:bookingId/cancel
// body: { reason }
// ==========================================
const cancelMyBooking = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;
    const { reason } = req.body;

    if (!isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id.",
      });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (["completed", "cancelled", "rejected"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking already ${booking.status}, cannot cancel.`,
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "customer";
    booking.cancelReason = reason || "";

    await booking.save();

    const vendor = await Vendor.findById(booking.vendorId);

    if (vendor) {
      await Notification.create({
        userId: vendor.userId,
        title: "Booking Cancelled",
        message: `Booking ${booking.bookingNumber} was cancelled by the customer.`,
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
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get My Profile
// GET /api/customer/profile
// ==========================================
const getCustomerProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select(
      "fullName email mobile profileImage createdAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Update My Profile
// PUT /api/customer/profile
// body: { fullName, mobile }
// ==========================================
const updateCustomerProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fullName, mobile } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (mobile && mobile !== user.mobile) {
      const mobileTaken = await User.findOne({
        mobile,
        _id: { $ne: userId },
      });

      if (mobileTaken) {
        return res.status(400).json({
          success: false,
          message: "This mobile number is already in use.",
        });
      }

      user.mobile = mobile;
    }

    if (fullName) user.fullName = fullName;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Create Review (only for a completed booking, one review per booking)
// POST /api/customer/reviews
// body: { bookingId, rating, review }
// ==========================================
const createReview = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId, rating, review } = req.body;

    if (!bookingId || !isValidId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "A valid booking is required.",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review a completed booking.",
      });
    }

    const existingReview = await Review.findOne({ bookingId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    const newReview = await Review.create({
      customerId: userId,
      vendorId: booking.vendorId,
      serviceId: booking.serviceId,
      bookingId: booking._id,
      rating,
      review: review || "",
    });

    // Keep the service's aggregate rating in sync — same field
    // (Service.rating) the vendor side and public browse API already read.
    const stats = await Review.aggregate([
      { $match: { serviceId: booking.serviceId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    await Service.findByIdAndUpdate(booking.serviceId, {
      rating: stats[0]?.avgRating || rating,
    });

    const vendor = await Vendor.findById(booking.vendorId);

    if (vendor) {
      await Notification.create({
        userId: vendor.userId,
        title: "New Review",
        message: `You received a new ${rating}-star review for booking ${booking.bookingNumber}.`,
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
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get My Reviews
// GET /api/customer/reviews
// ==========================================
const getMyReviews = async (req, res) => {
  try {
    const { userId } = req.user;

    const reviews = await Review.find({ customerId: userId })
      .populate("vendorId", "businessName")
      .populate("serviceId", "serviceName coverImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Update My Profile Image
// PATCH /api/customer/profile-image
// ==========================================
const updateCustomerProfileImage = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a profile image.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        user.profileImage,
      );

      deleteFile(oldImagePath);
    }

    user.profileImage = req.file.filename;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerProfileImage,
  createReview,
  getMyReviews,
};
