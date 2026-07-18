import api from "./api";

// Get Vendor Profile
export const getVendorProfile = async () => {
  try {
    const response = await api.get("/vendor/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfileImage = async (formData) => {
  const response = await api.patch(
    "/vendor/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateVendorProfile = async (data) => {
  const response = await api.put(
    "/vendor/profile",
    data
  );

  return response.data;
};

// =======================================
// Bookings
// =======================================

export const getVendorBookings = async ({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
  sort = "newest",
}) => {
  try {
    const response = await api.get("/vendor/bookings", {
      params: {
        page,
        limit,
        status,
        search,
        sort,
      },
    });

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};

export const getVendorBookingById = async (bookingId) => {

  try {

    const response = await api.get(
      `/vendor/bookings/${bookingId}`
    );

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }

};

export const updateBookingStatus = async (
  bookingId,
  status
) => {

  try {

    const response = await api.patch(
      `/vendor/bookings/${bookingId}/status`,
      {
        status,
      }
    );

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }

};




// =======================================
// Reviews
// =======================================

export const getVendorReviews = async (params) => {
  try {

    const response = await api.get("/vendor/reviews", {
      params,
    });

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};

export const replyReview = async (reviewId, vendorReply) => {
  try {

    const response = await api.patch(
      `/vendor/reviews/${reviewId}/reply`,
      {
        vendorReply,
      }
    );

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};

export const reportReview = async (reviewId, reason) => {
  try {

    const response = await api.patch(
      `/vendor/reviews/${reviewId}/report`,
      {
        reason,
      }
    );

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};


// =======================================
// Earnings
// =======================================

export const getVendorEarnings = async () => {
  try {
    const response = await api.get("/vendor/earnings");

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};

export const getVendorTransactions = async (params = {}) => {
  try {

    const response = await api.get(
      "/vendor/transactions",
      {
        params,
      }
    );

    return response.data;

  } catch (error) {

    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }
};