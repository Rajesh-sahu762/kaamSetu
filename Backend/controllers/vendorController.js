const User = require("../models/user");
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Review = require("../models/review");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Category = require("../models/category")
const Notification = require("../models/notification")
const path = require("path");
const { deleteFile } = require("../utils/fileHelper");

// ================================
//  Vendor Profile Controller
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


// =======================================
// Services Controllers
// =======================================


const addService = async (req, res) => {
  try {
    const { userId } = req.user;
    const images = req.files?.map(file => file.filename) || [];
    const {
      categoryId,
      serviceScope,
      serviceName,
      description,
      priceType,
      startingPrice,
      duration,
      
    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (
      !categoryId ||
      !serviceName ||
      !description ||
      !priceType ||
      !startingPrice ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Category Check
    // ==========================

    const category = await Category.findById(categoryId);

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ==========================
    // Duplicate Service
    // ==========================

const existingService = await Service.findOne({

vendorId:vendor._id,

categoryId,

serviceName:{
    $regex:new RegExp(`^${serviceName.trim()}$`,"i")
}

});
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Service already exists",
      });
    }

    // ==========================
// Generate Unique Slug
// ==========================

let slug = serviceName
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-");

const slugExists = await Service.findOne({ slug });

if (slugExists) {
  slug = `${slug}-${Date.now().toString().slice(-6)}`;
}

    // ==========================
    // Create Service
    // ==========================

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

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


const getVendorServices = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find Vendor
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get Services
    const services = await Service.find({
      vendorId: vendor._id,
    })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const updateService = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const {
      categoryId,
      serviceScope,
      serviceName,
      description,
      priceType,
      startingPrice,
      duration,
    } = req.body;

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Find Service
    // ==========================

    const service = await Service.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ==========================
    // Category Validation
    // ==========================

    if (categoryId) {
      const category = await Category.findById(categoryId);

      if (!category || !category.isActive) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      service.categoryId = categoryId;
    }

    // ==========================
    // Duplicate Service Check
    // ==========================

if (serviceName) {

  const existingService = await Service.findOne({
    vendorId: vendor._id,
    serviceName: serviceName.trim(),
    _id: { $ne: id },
  });

  if (existingService) {
    return res.status(400).json({
      success: false,
      message: "Service already exists",
    });
  }

  service.serviceName = serviceName.trim();

  let slug = serviceName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const slugExists = await Service.findOne({
    slug,
    _id: { $ne: id },
  });

  if (slugExists) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

  service.slug = slug;
}
    if (description !== undefined)
      service.description = description;

    if (priceType !== undefined)
      service.priceType = priceType;

    if (startingPrice !== undefined)
      service.startingPrice = startingPrice;

    if (duration !== undefined)
      service.duration = duration;

    await service.save();

    const updatedService = await Service.findById(service._id)
      .populate("categoryId", "name slug");

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const deleteService = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Find Service
    // ==========================

    const service = await Service.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ==========================
    // Delete Images (Future)
    // ==========================

    // coverImage
    // images[]

    // ==========================
    // Delete Service
    // ==========================

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const toggleServiceStatus = async (req, res) => {
  try {

    const { userId } = req.user;
    const { id } = req.params;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const service = await Service.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isActive = !service.isActive;

    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${
        service.isActive ? "Activated" : "Deactivated"
      } successfully`,
      data: service,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


// =======================================
// Booking Controllers
// =======================================

const getVendorBookings = async (req, res) => {
  
  try {
  
    const { userId } = req.user;
console.log(req.user);
    const {
      page = 1,
      limit = 10,
      status,
      search = "",
      sort = "newest",
    } = req.query;

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });
    console.log(vendor);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Filters
    // ==========================

    const filter = {
      vendorId: vendor._id,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    // ==========================
    // Search
    // ==========================

    if (search.trim()) {
      const customers = await User.find({
        fullName: {
          $regex: search.trim(),
          $options: "i",
        },
      }).select("_id");

      filter.$or = [
        {
          bookingNumber: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          customerId: {
            $in: customers.map((c) => c._id),
          },
        },
      ];
    }

    // ==========================
    // Sorting
    // ==========================

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "amountHigh") {
      sortOption = {
        totalAmount: -1,
      };
    }

    if (sort === "amountLow") {
      sortOption = {
        totalAmount: 1,
      };
    }

    // ==========================
    // Pagination
    // ==========================

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const skip = (currentPage - 1) * pageSize;

    console.log(filter);

    // ==========================
    // Fetch Bookings
    // ==========================

    const bookings = await Booking.find(filter)
      .populate(
        "customerId",
        "fullName mobile profileImage"
      )
      .populate(
        "serviceId",
        "serviceName coverImage startingPrice duration"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const totalBookings =
      await Booking.countDocuments(filter);

      console.log(bookings);

      const [
  total,
  pending,
  accepted,
  inProgress,
  completed,
  cancelled,
  rejected,
] = await Promise.all([
  Booking.countDocuments({
    vendorId: vendor._id,
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "pending",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "accepted",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "in_progress",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "completed",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "cancelled",
  }),

  Booking.countDocuments({
    vendorId: vendor._id,
    status: "rejected",
  }),
]);
    // ==========================
    // Response
    // ==========================

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",

      data: bookings,

      stats:{

total,

pending,

accepted,

inProgress,

completed,

cancelled,

rejected

},

      pagination: {
        currentPage,

        totalPages: Math.ceil(
          totalBookings / pageSize
        ),

        totalBookings,

        pageSize,
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

const getVendorBookingById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Find Booking
    // ==========================

    const booking = await Booking.findOne({
      _id: bookingId,
      vendorId: vendor._id,
    })
      .populate(
        "customerId",
        "fullName email mobile profileImage"
      )
      .populate(
        "serviceId",
        `
        serviceName
        description
        startingPrice
        duration
        priceType
        coverImage
        images
        `
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==========================
    // Response
    // ==========================

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookingId } = req.params;
    const { status } = req.body;

    // ==========================
    // Validation
    // ==========================

    const allowedStatus = [
      "accepted",
      "in_progress",
      "completed",
      "cancelled",
      "rejected",
    ];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    // ==========================
    // Find Vendor
    // ==========================

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ==========================
    // Find Booking
    // ==========================

    const booking = await Booking.findOne({
      _id: bookingId,
      vendorId: vendor._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==========================
    // Status Flow Validation
    // ==========================

    if (booking.status === "completed") {

      await Service.findByIdAndUpdate(
  booking.serviceId,
  {
    $inc: {
      totalBookings: 1,
    },
  }
);

      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be updated.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled booking cannot be updated.",
      });
    }

    if (booking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected booking cannot be updated.",
      });
    }

    const validTransitions = {
      pending: ["accepted", "cancelled", "rejected"],

      accepted: ["in_progress", "cancelled"],

      in_progress: ["completed"],
    };

    if (
      validTransitions[booking.status] &&
      !validTransitions[booking.status].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking from ${booking.status} to ${status}.`,
      });
    }

    // ==========================
    // Update Status
    // ==========================

    booking.status = status;

    if (status === "cancelled") {
      booking.cancelledBy = "vendor";
    }

    await booking.save();


    // ==========================
// Create Notification
// ==========================

const statusMessages = {
  accepted: {
    title: "Booking Accepted",
    message: `Your booking ${booking.bookingNumber} has been accepted by the vendor.`,
  },

  rejected: {
    title: "Booking Rejected",
    message: `Unfortunately your booking ${booking.bookingNumber} was rejected.`,
  },

  in_progress: {
    title: "Service Started",
    message: `Your service for booking ${booking.bookingNumber} is now in progress.`,
  },

  completed: {
    title: "Service Completed",
    message: `Your booking ${booking.bookingNumber} has been completed successfully.`,
  },

  cancelled: {
    title: "Booking Cancelled",
    message: `Your booking ${booking.bookingNumber} has been cancelled.`,
  },
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

    // ==========================
    // Response
    // ==========================

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: booking,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Categories Controllers
// =======================================

const getCategories = async (req, res) => {
  try {

    const categories = await Category.find(
      { isActive: true },
      {
        name: 1,
        slug: 1,
        image: 1,
      }
    ).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


// =======================================
// Get Vendor Reviews
// =======================================

const getVendorReviews = async (req, res) => {
  try {

    const { userId } = req.user;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search?.trim() || "";

    const rating = req.query.rating || "all";

    const skip = (page - 1) * limit;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    const query = {
      vendorId: vendor._id,
    };

    if (rating !== "all") {
      query.rating = Number(rating);
    }

    let reviews = await Review.find(query)

      .populate("customerId", "fullName profileImage")

      .populate("serviceId", "serviceName")

      .sort({ createdAt: -1 });

    if (search) {

      const keyword = search.toLowerCase();

      reviews = reviews.filter((review) => {

        const customerName =
          review.customerId?.fullName?.toLowerCase() || "";

        const serviceName =
          review.serviceId?.serviceName?.toLowerCase() || "";

        return (
          customerName.includes(keyword) ||
          serviceName.includes(keyword)
        );

      });

    }

    const totalReviews = reviews.length;

    const paginatedReviews = reviews.slice(skip, skip + limit);

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, item) => sum + item.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    const pendingReplies = reviews.filter(
      (item) => !item.vendorReply
    ).length;

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

      stats: {

        totalReviews,

        averageRating,

        pendingReplies,

        ratingDistribution,

      },

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

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Reply Review
// =======================================

const replyReview = async (req, res) => {
  try {

    const { userId } = req.user;

    const { id } = req.params;

    const { vendorReply } = req.body;

    if (!vendorReply?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply is required.",
      });
    }

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    const review = await Review.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

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

    return res.status(200).json({
      success: true,
      message: "Reply saved successfully.",
      data: review,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Report Review
// =======================================

const reportReview = async (req, res) => {
  try {

    const { userId } = req.user;

    const { id } = req.params;

    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report reason is required.",
      });
    }

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    const review = await Review.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (review.isReported) {
      return res.status(400).json({
        success: false,
        message: "This review has already been reported.",
      });
    }


    const allowedReasons = [
  "Spam",
  "Fake Review",
  "Abusive Language",
  "Wrong Information",
  "Other",
];

if (!allowedReasons.includes(reason)) {
  return res.status(400).json({
    success: false,
    message: "Invalid report reason.",
  });
}

    review.isReported = true;

    review.reportReason = reason.trim();

    review.reportedAt = new Date();

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review reported successfully.",
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
  
};
