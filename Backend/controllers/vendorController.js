const User = require("../models/user");
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Category = require("../models/category");
const Notification = require("../models/notification");
const { deleteImage, getPublicId } = require("../helpers/cloudinaryHelper");

// ================================
//  Vendor Profile Controller
// ================================
const getVendorProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v",
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const vendor = await Vendor.findOne({ userId }).select("-__v");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor profile not found" });
    }

    const [
      totalServices,
      totalReviews,
      completedBookings,
      pendingBookings,
      ratingResult,
      earnings,
      portfolio,
    ] = await Promise.all([
      Service.countDocuments({ vendorId: vendor._id }),
      Review.countDocuments({ vendorId: vendor._id }),
      Booking.countDocuments({ vendorId: vendor._id, status: "completed" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "pending" }),
      Review.aggregate([
        { $match: { vendorId: vendor._id } },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]),
      Transaction.aggregate([
        { $match: { vendorId: vendor._id, status: "completed" } },
        { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
      ]),
      Service.find(
        { vendorId: vendor._id },
        { serviceName: 1, coverImage: 1, images: 1, rating: 1, totalBookings: 1 },
      ),
    ]);

    const averageRating =
      ratingResult.length > 0 ? Number(ratingResult[0].averageRating.toFixed(1)) : 0;

    const totalEarnings = earnings.length > 0 ? earnings[0].totalEarnings : 0;

    const profileCompletion =
      ([
        user.profileImage,
        vendor.bio,
        vendor.skills?.length,
        vendor.serviceAreas?.length,
        vendor.bankDetails?.bankName,
        vendor.aadhaarImage,
        vendor.panImage,
      ].filter(Boolean).length / 7) * 100;

    const businessHealth = Math.round(
      (profileCompletion + averageRating * 20 + (portfolio.length > 0 ? 100 : 40)) / 3,
    );

    const aiSuggestions = [];
    if (!user.profileImage) aiSuggestions.push("Upload a profile photo.");
    if (!vendor.skills?.length) aiSuggestions.push("Add your professional skills.");
    if (!vendor.bankDetails?.bankName) aiSuggestions.push("Complete your bank details.");
    if (!portfolio.length) aiSuggestions.push("Add service images to your portfolio.");
    if (!vendor.serviceAreas?.length) aiSuggestions.push("Add your service areas.");

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
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------
// FIXED: was using path.join(...) + deleteFile(...) against a local
// uploads/profile/<filename> path, but neither `path` nor `deleteFile`
// are imported in this file anymore, and files no longer live on disk
// at all — they live on Cloudinary. That combination meant:
//   1) ReferenceError crash the moment a vendor who already HAS a
//      profileImage tries to upload a new one (first-ever upload was
//      fine since the `if (user.profileImage)` block never ran).
//   2) Even if it didn't crash, it would never actually delete
//      anything from Cloudinary.
// Also switched `req.file.filename` -> `req.file.path`: with
// CloudinaryStorage, `.filename` is just the bare public_id
// ("kaamsetu/profile/abc123"), not a URL. Saving that to the DB would
// silently break every <img> tag again, because frontend's
// getImageUrl() only passes a value through untouched if it already
// looks like a full http(s) URL - otherwise it re-prefixes it with the
// OLD local /uploads/<folder>/ path, producing a broken link.
// `.path` is the actual Cloudinary secure_url.
// ---------------------------------------------------------------------
const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a profile image." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.profileImage) {
      const oldPublicId = getPublicId(user.profileImage);
      await deleteImage(oldPublicId);
    }

    user.profileImage = req.file.path; // Cloudinary secure_url

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      fullName, mobile, businessName, businessType, experience, bio,
      address, city, state, pincode, radius, skills, bankDetails,
    } = req.body;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiresAt -googleId -facebookId -__v",
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const vendor = await Vendor.findOne({ userId }).select("-__v");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found" });

    if (fullName !== undefined) user.fullName = fullName;
    if (mobile !== undefined) user.mobile = mobile;
    await user.save();

    if (businessName !== undefined) vendor.businessName = businessName;
    if (businessType !== undefined) vendor.businessType = businessType;
    if (experience !== undefined) vendor.experience = experience;
    if (bio !== undefined) vendor.bio = bio;
    if (address !== undefined) vendor.address = address;
    if (city !== undefined) vendor.city = city;
    if (state !== undefined) vendor.state = state;
    if (pincode !== undefined) vendor.pincode = pincode;
    if (radius !== undefined) vendor.radius = radius;
    if (skills !== undefined) vendor.skills = skills;
    if (bankDetails !== undefined) vendor.bankDetails = bankDetails;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      data: { user, vendor },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------
// FIXED: `file.filename` -> `file.path` for the same public_id-vs-URL
// reason as above. This one was silent (no crash) but every uploaded
// service image would have rendered broken on the customer side.
// ---------------------------------------------------------------------
const addService = async (req, res) => {
  try {
    const { userId } = req.user;
    const images = req.files?.map((file) => file.path) || [];
    const { categoryId, serviceScope, serviceName, description, priceType, startingPrice, duration } = req.body;

    if (!categoryId || !serviceName || !description || !priceType || !startingPrice || !duration) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const existingService = await Service.findOne({
      vendorId: vendor._id,
      categoryId,
      serviceName: { $regex: new RegExp(`^${serviceName.trim()}$`, "i") },
    });
    if (existingService) {
      return res.status(400).json({ success: false, message: "Service already exists" });
    }

    let slug = serviceName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const slugExists = await Service.findOne({ slug });
    if (slugExists) slug = `${slug}-${Date.now().toString().slice(-6)}`;

    const service = await Service.create({
      vendorId: vendor._id,
      categoryId,
      serviceScope,
      serviceName: serviceName.trim(),
      slug,
      description,
      images,
      coverImage: images[0] || "",
      priceType,
      startingPrice,
      duration,
    });

    return res.status(201).json({ success: true, message: "Service added successfully", data: service });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorServices = async (req, res) => {
  try {
    const { userId } = req.user;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const services = await Service.find({ vendorId: vendor._id })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, message: "Services fetched successfully", data: services });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------
// FIXED: same file.filename -> file.path swap for new images, PLUS the
// old-image cleanup below used to try deleting from local disk
// (path.join + deleteFile, neither imported) - replaced with the
// Cloudinary equivalent: pull the public_id back out of each stored
// URL and destroy it on Cloudinary.
// ---------------------------------------------------------------------
const updateService = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const newImages = req.files?.map((file) => file.path) || [];

    const { categoryId, serviceScope, serviceName, description, priceType, startingPrice, duration } = req.body;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const service = await Service.findOne({ _id: id, vendorId: vendor._id });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category || !category.isActive) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      service.categoryId = categoryId;
    }

    if (serviceName) {
      const existingService = await Service.findOne({
        vendorId: vendor._id,
        serviceName: serviceName.trim(),
        _id: { $ne: id },
      });
      if (existingService) {
        return res.status(400).json({ success: false, message: "Service already exists" });
      }
      service.serviceName = serviceName.trim();

      let slug = serviceName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
      const slugExists = await Service.findOne({ slug, _id: { $ne: id } });
      if (slugExists) slug = `${slug}-${Date.now().toString().slice(-6)}`;
      service.slug = slug;
    }

    if (description !== undefined) service.description = description;
    if (priceType !== undefined) service.priceType = priceType;
    if (startingPrice !== undefined) service.startingPrice = startingPrice;
    if (duration !== undefined) service.duration = duration;

    if (newImages.length > 0) {
      const oldImages = service.images || [];
      for (const oldUrl of oldImages) {
        const oldPublicId = getPublicId(oldUrl);
        await deleteImage(oldPublicId);
      }

      service.images = newImages;
      service.coverImage = newImages[0];
    }

    await service.save();

    const updatedService = await Service.findById(service._id).populate("categoryId", "name slug");

    return res.status(200).json({ success: true, message: "Service updated successfully", data: updatedService });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------
// FIXED: same story - was deleting from a local uploads/services/
// path that no longer holds anything. Now removes the matching
// Cloudinary asset per stored URL.
// ---------------------------------------------------------------------
const deleteService = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const service = await Service.findOne({ _id: id, vendorId: vendor._id });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    for (const url of service.images || []) {
      const publicId = getPublicId(url);
      await deleteImage(publicId);
    }

    await service.deleteOne();

    return res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const toggleServiceStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const service = await Service.findOne({ _id: id, vendorId: vendor._id });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    service.isActive = !service.isActive;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? "Activated" : "Deactivated"} successfully`,
      data: service,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// (Booking / category / review / earnings / transactions controllers below
// are UNCHANGED from what you pasted - they don't touch file storage at
// all, so nothing there was affected by the Cloudinary migration.)

const getVendorBookings = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, status, search = "", sort = "newest" } = req.query;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const filter = { vendorId: vendor._id };
    if (status && status !== "all") filter.status = status;

    if (search.trim()) {
      const customers = await User.find({ fullName: { $regex: search.trim(), $options: "i" } }).select("_id");
      filter.$or = [
        { bookingNumber: { $regex: search.trim(), $options: "i" } },
        { customerId: { $in: customers.map((c) => c._id) } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "amountHigh") sortOption = { totalAmount: -1 };
    if (sort === "amountLow") sortOption = { totalAmount: 1 };

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const bookings = await Booking.find(filter)
      .populate("customerId", "fullName mobile profileImage")
      .populate("serviceId", "serviceName coverImage startingPrice duration")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const totalBookings = await Booking.countDocuments(filter);

    const [total, pending, accepted, inProgress, completed, cancelled, rejected] = await Promise.all([
      Booking.countDocuments({ vendorId: vendor._id }),
      Booking.countDocuments({ vendorId: vendor._id, status: "pending" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "accepted" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "in_progress" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "completed" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "cancelled" }),
      Booking.countDocuments({ vendorId: vendor._id, status: "rejected" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
      stats: { total, pending, accepted, inProgress, completed, cancelled, rejected },
      pagination: { currentPage, totalPages: Math.ceil(totalBookings / pageSize), totalBookings, pageSize },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorBookingById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const booking = await Booking.findOne({ _id: bookingId, vendorId: vendor._id })
      .populate("customerId", "fullName email mobile profileImage")
      .populate("serviceId", "serviceName description startingPrice duration priceType coverImage images");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    return res.status(200).json({ success: true, message: "Booking fetched successfully", data: booking });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["accepted", "in_progress", "completed", "cancelled", "rejected"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid booking status." });
    }

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const booking = await Booking.findOne({ _id: bookingId, vendorId: vendor._id });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status === "completed") {
      await Service.findByIdAndUpdate(booking.serviceId, { $inc: { totalBookings: 1 } });
      return res.status(400).json({ success: false, message: "Completed booking cannot be updated." });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cancelled booking cannot be updated." });
    }
    if (booking.status === "rejected") {
      return res.status(400).json({ success: false, message: "Rejected booking cannot be updated." });
    }

    const validTransitions = {
      pending: ["accepted", "cancelled", "rejected"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["completed"],
    };
    if (validTransitions[booking.status] && !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking from ${booking.status} to ${status}.`,
      });
    }

    booking.status = status;
    if (status === "cancelled") booking.cancelledBy = "vendor";
    await booking.save();

    const statusMessages = {
      accepted: { title: "Booking Accepted", message: `Your booking ${booking.bookingNumber} has been accepted by the vendor.` },
      rejected: { title: "Booking Rejected", message: `Unfortunately your booking ${booking.bookingNumber} was rejected.` },
      in_progress: { title: "Service Started", message: `Your service for booking ${booking.bookingNumber} is now in progress.` },
      completed: { title: "Service Completed", message: `Your booking ${booking.bookingNumber} has been completed successfully.` },
      cancelled: { title: "Booking Cancelled", message: `Your booking ${booking.bookingNumber} has been cancelled.` },
    };

    const notification = statusMessages[status];
    if (notification) {
      await Notification.create({
        userId: booking.customerId,
        title: notification.title,
        message: notification.message,
        type: "booking",
        referenceId: booking._id,
      });
    }

    return res.status(200).json({ success: true, message: "Booking status updated successfully.", data: booking });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }, { name: 1, slug: 1, image: 1 }).sort({ name: 1 });
    return res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorReviews = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const rating = req.query.rating || "all";
    const skip = (page - 1) * limit;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found." });

    const query = { vendorId: vendor._id };
    if (rating !== "all") query.rating = Number(rating);

    let reviews = await Review.find(query)
      .populate("customerId", "fullName profileImage")
      .populate("serviceId", "serviceName")
      .sort({ createdAt: -1 });

    if (search) {
      const keyword = search.toLowerCase();
      reviews = reviews.filter((review) => {
        const customerName = review.customerId?.fullName?.toLowerCase() || "";
        const serviceName = review.serviceId?.serviceName?.toLowerCase() || "";
        return customerName.includes(keyword) || serviceName.includes(keyword);
      });
    }

    const totalReviews = reviews.length;
    const paginatedReviews = reviews.slice(skip, skip + limit);
    const averageRating =
      totalReviews > 0 ? (reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1) : 0;
    const pendingReplies = reviews.filter((item) => !item.vendorReply).length;
    const ratingDistribution = {
      5: reviews.filter((item) => item.rating === 5).length,
      4: reviews.filter((item) => item.rating === 4).length,
      3: reviews.filter((item) => item.rating === 3).length,
      2: reviews.filter((item) => item.rating === 2).length,
      1: reviews.filter((item) => item.rating === 1).length,
    };

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: paginatedReviews,
      stats: { totalReviews, averageRating, pendingReplies, ratingDistribution },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page * limit < totalReviews,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const replyReview = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { vendorReply } = req.body;

    if (!vendorReply?.trim()) {
      return res.status(400).json({ success: false, message: "Reply is required." });
    }

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found." });

    const review = await Review.findOne({ _id: id, vendorId: vendor._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    review.vendorReply = vendorReply.trim();
    review.vendorRepliedAt = new Date();
    await review.save();

    await Notification.create({
      userId: review.customerId,
      title: "Vendor Replied",
      message: "The vendor has replied to your review.",
      type: "review",
      referenceId: review._id,
    });

    return res.status(200).json({ success: true, message: "Reply saved successfully.", data: review });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const reportReview = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({ success: false, message: "Report reason is required." });
    }

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor profile not found." });

    const review = await Review.findOne({ _id: id, vendorId: vendor._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    if (review.isReported) {
      return res.status(400).json({ success: false, message: "This review has already been reported." });
    }

    const allowedReasons = ["Spam", "Fake Review", "Abusive Language", "Wrong Information", "Other"];
    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({ success: false, message: "Invalid report reason." });
    }

    review.isReported = true;
    review.reportReason = reason.trim();
    review.reportedAt = new Date();
    await review.save();

    return res.status(200).json({ success: true, message: "Review reported successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorEarnings = async (req, res) => {
  try {
    const { userId } = req.user;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found." });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [summary, monthly, pendingSettlement, completedSettlement, recentTransactions, pendingSettlements, monthlyAnalytics] =
      await Promise.all([
        Transaction.aggregate([
          { $match: { vendorId: vendor._id, status: "completed" } },
          { $group: { _id: null, totalEarnings: { $sum: "$vendorAmount" }, totalCommission: { $sum: "$commission" }, totalTransactions: { $sum: 1 } } },
        ]),
        Transaction.aggregate([
          { $match: { vendorId: vendor._id, status: "completed", createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, thisMonthEarnings: { $sum: "$vendorAmount" } } },
        ]),
        Transaction.aggregate([
          { $match: { vendorId: vendor._id, status: "completed", settlementStatus: "pending" } },
          { $group: { _id: null, pendingSettlement: { $sum: "$vendorAmount" } } },
        ]),
        Transaction.aggregate([
          { $match: { vendorId: vendor._id, status: "completed", settlementStatus: "settled" } },
          { $group: { _id: null, completedSettlement: { $sum: "$vendorAmount" } } },
        ]),
        Transaction.find({ vendorId: vendor._id, status: "completed" })
          .populate({ path: "bookingId", select: "bookingNumber bookingDate serviceId", populate: { path: "serviceId", select: "serviceName" } })
          .populate("customerId", "fullName profileImage")
          .sort({ createdAt: -1 })
          .limit(5),
        Transaction.find({ vendorId: vendor._id, status: "completed", settlementStatus: { $in: ["pending", "processing"] } })
          .populate({ path: "bookingId", select: "bookingNumber serviceId", populate: { path: "serviceId", select: "serviceName" } })
          .sort({ createdAt: -1 }),
        Transaction.aggregate([
          { $match: { vendorId: vendor._id, status: "completed" } },
          { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, earnings: { $sum: "$vendorAmount" }, transactions: { $sum: 1 } } },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
      ]);

    return res.status(200).json({
      success: true,
      message: "Vendor earnings fetched successfully.",
      data: {
        totalEarnings: summary[0]?.totalEarnings || 0,
        thisMonthEarnings: monthly[0]?.thisMonthEarnings || 0,
        pendingSettlement: pendingSettlement[0]?.pendingSettlement || 0,
        completedSettlement: completedSettlement[0]?.completedSettlement || 0,
        totalCommission: summary[0]?.totalCommission || 0,
        totalTransactions: summary[0]?.totalTransactions || 0,
        recentTransactions: recentTransactions.map((item) => ({
          transactionId: item._id,
          bookingNumber: item.bookingId?.bookingNumber || "-",
          bookingDate: item.bookingId?.bookingDate || null,
          customerName: item.customerId?.fullName || "-",
          customerImage: item.customerId?.profileImage || "",
          serviceName: item.bookingId?.serviceId?.serviceName || "-",
          amount: item.vendorAmount,
          paymentMethod: item.paymentMethod,
          paymentStatus: item.status,
          settlementStatus: item.settlementStatus,
          createdAt: item.createdAt,
        })),
        pendingSettlements: pendingSettlements.map((item) => ({
          transactionId: item._id,
          bookingNumber: item.bookingId?.bookingNumber || "-",
          serviceName: item.bookingId?.serviceId?.serviceName || "-",
          amount: item.vendorAmount,
          settlementStatus: item.settlementStatus,
        })),
        monthlyAnalytics: monthlyAnalytics.map((item) => ({
          year: item._id.year,
          monthName: item._id.month,
          earnings: item.earnings,
          transactions: item.transactions,
        })),
        grossRevenue: summary[0]?.totalEarnings || 0,
        netEarnings: (summary[0]?.totalEarnings || 0) - (summary[0]?.totalCommission || 0),
        transferDetails: {
          bankName: vendor.bankDetails?.bankName || "Not Added",
          accountNumber: vendor.bankDetails?.accountNumber || "",
          accountHolder: vendor.bankDetails?.accountHolder || "",
          ifscCode: vendor.bankDetails?.ifscCode || "",
          upiId: vendor.bankDetails?.upiId || "",
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorTransactions = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, search = "", status = "all", settlement = "all", paymentMethod = "all", sort = "newest" } = req.query;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found." });

    const filter = { vendorId: vendor._id };
    if (status !== "all") filter.status = status;
    if (settlement !== "all") filter.settlementStatus = settlement;
    if (paymentMethod !== "all") filter.paymentMethod = paymentMethod;

    if (search.trim()) {
      const customers = await User.find({ fullName: { $regex: search.trim(), $options: "i" } }).select("_id");
      filter.customerId = { $in: customers.map((item) => item._id) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "amountHigh") sortOption = { amount: -1 };
    if (sort === "amountLow") sortOption = { amount: 1 };

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const transactions = await Transaction.find(filter)
      .populate("customerId", "fullName profileImage mobile")
      .populate("bookingId", "bookingNumber bookingDate")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const totalTransactions = await Transaction.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully.",
      data: transactions,
      pagination: { currentPage, totalPages: Math.ceil(totalTransactions / pageSize), totalTransactions, pageSize },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  updateProfileImage,
  addService,
  getVendorServices,
  updateService,
  deleteService,
  toggleServiceStatus,
  getCategories,
  getVendorBookings,
  getVendorBookingById,
  updateBookingStatus,
  getVendorReviews,
  replyReview,
  reportReview,
  getVendorEarnings,
  getVendorTransactions,
};