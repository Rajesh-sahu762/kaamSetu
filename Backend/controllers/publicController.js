// controllers/publicController.js
//
// Public, unauthenticated read-only endpoints for the customer-facing site
// (home page, /services, /experts, /experts/:id). Nothing here existed
// before — vendorRoutes.js is entirely gated behind verifyVendor now, so
// there was no way for a customer (or a logged-out visitor) to browse
// categories/services/vendors at all. These only ever read data that
// vendors and admins already write through their own existing APIs.

const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Category = require("../models/category");
const Review = require("../models/review");

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

// ==========================================
// Get Categories (for filters / home page / ServiceGrid)
// Each category includes aggregate stats — how many approved vendors
// offer an active service in it, the average rating, and the lowest
// starting price — since ServiceGrid's cards show "120 experts",
// a rating, and a "starting ₹X" price per category.
// ==========================================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });

    const approvedVendors = await Vendor.find({ status: "approved" }).select(
      "_id",
    );
    const approvedVendorIds = approvedVendors.map((v) => v._id);

    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const activeServices = await Service.find({
          categoryId: category._id,
          isActive: true,
          vendorId: { $in: approvedVendorIds },
        }).select("vendorId startingPrice rating");

        const distinctVendors = new Set(
          activeServices.map((s) => s.vendorId.toString()),
        );

        const avgRating =
          activeServices.length > 0
            ? activeServices.reduce((sum, s) => sum + (s.rating || 0), 0) /
              activeServices.length
            : 0;

        const startingPrice =
          activeServices.length > 0
            ? Math.min(...activeServices.map((s) => s.startingPrice))
            : 0;

        return {
          ...category.toObject(),
          expertsCount: distinctVendors.size,
          rating: avgRating,
          startingPrice,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categoriesWithStats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get Services (list, filter, search, paginate)
// GET /api/public/services?category=&search=&minPrice=&maxPrice=&city=&sort=&page=&limit=
// ==========================================
const getServices = async (req, res) => {
  try {
    const {
      category,
      search = "",
      minPrice,
      maxPrice,
      city,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    if (category && isValidId(category)) {
      filter.categoryId = category;
    }

    if (search.trim()) {
      filter.serviceName = { $regex: search.trim(), $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.startingPrice = {};
      if (minPrice) filter.startingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.startingPrice.$lte = Number(maxPrice);
    }

    // Only show services whose vendor is actually approved & live.
    let vendorIds = null;

    if (city) {
      const vendorsInCity = await Vendor.find({
        status: "approved",
        city: { $regex: city.trim(), $options: "i" },
      }).select("_id");

      vendorIds = vendorsInCity.map((v) => v._id);
      filter.vendorId = { $in: vendorIds };
    } else {
      const approvedVendors = await Vendor.find({ status: "approved" }).select(
        "_id",
      );
      vendorIds = approvedVendors.map((v) => v._id);
      filter.vendorId = { $in: vendorIds };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "priceLow") sortOption = { startingPrice: 1 };
    if (sort === "priceHigh") sortOption = { startingPrice: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "popular") sortOption = { totalBookings: -1 };

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const [services, totalServices] = await Promise.all([
      Service.find(filter)
        .populate({
          path: "vendorId",
          select: "businessName city rating",
          populate: { path: "userId", select: "fullName profileImage" },
        })
        .populate("categoryId", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize),
      Service.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      data: services,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalServices / pageSize),
        totalServices,
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
// Get Popular Services (top by totalBookings)
// GET /api/public/services/popular
// ==========================================
const getPopularServices = async (req, res) => {
  try {
    const approvedVendors = await Vendor.find({ status: "approved" }).select(
      "_id",
    );

    const services = await Service.find({
      isActive: true,
      vendorId: { $in: approvedVendors.map((v) => v._id) },
    })
      .populate({
        path: "vendorId",
        select: "businessName city rating",
        populate: { path: "userId", select: "fullName profileImage" },
      })
      .populate("categoryId", "name slug")
      .sort({ totalBookings: -1, rating: -1 })
      .limit(8);

    return res.status(200).json({
      success: true,
      message: "Popular services fetched successfully.",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get Single Service Detail (for BookingPage/CheckoutPage)
// GET /api/public/services/:id
// ==========================================
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service id.",
      });
    }

    const service = await Service.findOne({ _id: id, isActive: true })
      .populate({
        path: "vendorId",
        select:
          "businessName city state bio skills experience availability radius status",
        populate: { path: "userId", select: "fullName profileImage" },
      })
      .populate("categoryId", "name slug");

    if (!service || service.vendorId?.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const reviewStats = await Review.aggregate([
      { $match: { serviceId: service._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully.",
      data: {
        service,
        rating: reviewStats[0]?.avgRating || service.rating || 0,
        totalReviews: reviewStats[0]?.totalReviews || 0,
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
// Get Vendor Public Profile (for ExpertProfile page)
// GET /api/public/vendors/:id
// ==========================================
const getVendorPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor id.",
      });
    }

    const vendor = await Vendor.findOne({ _id: id, status: "approved" })
      .select(
        "businessName businessType experience city state bio skills serviceAreas availability radius createdAt userId",
      )
      .populate("userId", "fullName profileImage");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const services = await Service.find({ vendorId: id, isActive: true });

    const reviews = await Review.find({ vendorId: id })
      .populate("customerId", "fullName profileImage")
      .populate("serviceId", "serviceName")
      .sort({ createdAt: -1 })
      .limit(20);

    const reviewStats = await Review.aggregate([
      { $match: { vendorId: vendor._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully.",
      data: {
        vendor,
        services,
        reviews,
        rating: reviewStats[0]?.avgRating || 0,
        totalReviews: reviewStats[0]?.totalReviews || 0,
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
// Get Featured Experts (top rated approved vendors, for home page)
// GET /api/public/vendors/featured
// ==========================================
const getFeaturedExperts = async (req, res) => {
  try {
    const services = await Service.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$vendorId",
          avgRating: { $avg: "$rating" },
          totalBookings: { $sum: "$totalBookings" },
        },
      },
      { $sort: { avgRating: -1, totalBookings: -1 } },
      { $limit: 8 },
    ]);

    const vendorIds = services.map((s) => s._id);

    const vendors = await Vendor.find({
      _id: { $in: vendorIds },
      status: "approved",
    })
      .select("businessName city bio skills experience userId")
      .populate("userId", "fullName profileImage");

    // Preserve the ranking order from the aggregation above, and attach the
    // rating/jobs-count already computed per vendor plus one representative
    // category (cheapest active service) for the card's category label.
    const orderedVendors = await Promise.all(
      vendorIds
        .map((id) => vendors.find((v) => v._id.toString() === id.toString()))
        .filter(Boolean)
        .map(async (vendor) => {
          const stats = services.find(
            (s) => s._id.toString() === vendor._id.toString(),
          );

          const primaryService = await Service.findOne({
            vendorId: vendor._id,
            isActive: true,
          })
            .populate("categoryId", "name")
            .sort({ startingPrice: 1 });

          return {
            ...vendor.toObject(),
            rating: stats?.avgRating || 0,
            jobsCount: stats?.totalBookings || 0,
            category: primaryService?.categoryId?.name || "Service Provider",
          };
        }),
    );

    return res.status(200).json({
      success: true,
      message: "Featured experts fetched successfully.",
      data: orderedVendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==========================================
// Get Vendors (list, filter, search, paginate — for the /experts page)
// GET /api/public/vendors?category=&search=&city=&minExperience=&minRating=&minPrice=&maxPrice=&sort=&page=&limit=
// ==========================================
const getVendors = async (req, res) => {
  try {
    const {
      category,
      search = "",
      city,
      minExperience,
      minRating,
      minPrice,
      maxPrice,
      sort = "rating",
      page = 1,
      limit = 9,
    } = req.query;

    const vendorFilter = { status: "approved" };

    if (search.trim()) {
      vendorFilter.businessName = { $regex: search.trim(), $options: "i" };
    }

    if (city) {
      vendorFilter.city = { $regex: city.trim(), $options: "i" };
    }

    if (category && isValidId(category)) {
      const servicesInCategory = await Service.find({
        categoryId: category,
        isActive: true,
      }).select("vendorId");

      vendorFilter._id = {
        $in: servicesInCategory.map((s) => s.vendorId),
      };
    }

    if (minExperience) {
      vendorFilter.experience = { $gte: Number(minExperience) };
    }

    const vendors = await Vendor.find(vendorFilter)
      .select("businessName city experience skills userId")
      .populate("userId", "fullName profileImage");

    // Each card needs one representative service (category + price) and a
    // rating/review count — attach the vendor's cheapest active service and
    // review stats without inventing any new fields on Vendor itself.
    let vendorsWithSummary = await Promise.all(
      vendors.map(async (vendor) => {
        const primaryService = await Service.findOne({
          vendorId: vendor._id,
          isActive: true,
        })
          .populate("categoryId", "name slug")
          .sort({ startingPrice: 1 });

        const reviewStats = await Review.aggregate([
          { $match: { vendorId: vendor._id } },
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ]);

        return {
          vendor,
          primaryService,
          rating: reviewStats[0]?.avgRating || 0,
          totalReviews: reviewStats[0]?.totalReviews || 0,
        };
      }),
    );

    // Rating/price depend on the computed summary above, not the raw Vendor
    // doc, so they can only be filtered here — not as part of vendorFilter.
    if (minRating) {
      vendorsWithSummary = vendorsWithSummary.filter(
        (v) => v.rating >= Number(minRating),
      );
    }

    if (minPrice) {
      vendorsWithSummary = vendorsWithSummary.filter(
        (v) => (v.primaryService?.startingPrice || 0) >= Number(minPrice),
      );
    }

    if (maxPrice) {
      vendorsWithSummary = vendorsWithSummary.filter(
        (v) => (v.primaryService?.startingPrice || 0) <= Number(maxPrice),
      );
    }

    let sorted = vendorsWithSummary;
    if (sort === "rating") {
      sorted = [...vendorsWithSummary].sort((a, b) => b.rating - a.rating);
    } else if (sort === "priceLow") {
      sorted = [...vendorsWithSummary].sort(
        (a, b) =>
          (a.primaryService?.startingPrice || 0) -
          (b.primaryService?.startingPrice || 0),
      );
    } else if (sort === "priceHigh") {
      sorted = [...vendorsWithSummary].sort(
        (a, b) =>
          (b.primaryService?.startingPrice || 0) -
          (a.primaryService?.startingPrice || 0),
      );
    } else if (sort === "experience") {
      sorted = [...vendorsWithSummary].sort(
        (a, b) => (b.vendor.experience || 0) - (a.vendor.experience || 0),
      );
    }

    const totalVendors = sorted.length;
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;
    const paginated = sorted.slice(skip, skip + pageSize);

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully.",
      data: paginated,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalVendors / pageSize),
        totalVendors,
        pageSize,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getCategories,
  getServices,
  getPopularServices,
  getServiceById,
  getVendorPublicProfile,
  getFeaturedExperts,
  getVendors,
};
