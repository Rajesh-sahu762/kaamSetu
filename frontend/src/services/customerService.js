import api from "./api";

// =======================================
// Bookings
// =======================================

export const createBooking = async (payload) => {
  try {
    const response = await api.post("/customer/bookings", payload);

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

export const getMyBookings = async (params = {}) => {
  try {
    const response = await api.get("/customer/bookings", { params });

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

export const getMyBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/customer/bookings/${bookingId}`);

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

export const cancelMyBooking = async (bookingId, reason) => {
  try {
    const response = await api.patch(
      `/customer/bookings/${bookingId}/cancel`,
      { reason },
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
// Profile
// =======================================

export const getCustomerProfile = async () => {
  try {
    const response = await api.get("/customer/profile");

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

export const updateCustomerProfile = async (payload) => {
  try {
    const response = await api.put("/customer/profile", payload);

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

export const updateCustomerProfileImage = async (formData) => {
  try {
    const response = await api.patch("/customer/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
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

// =======================================
// Reviews
// =======================================

export const createReview = async (payload) => {
  try {
    const response = await api.post("/customer/reviews", payload);

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

export const getMyReviews = async () => {
  try {
    const response = await api.get("/customer/reviews");

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
