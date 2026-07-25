import api from "@/services/api";

// =======================================
// Home
// =======================================

export const getHomeData = async () => {
  const { data } = await api.get("/customer/home");
  return data;
};

// =======================================
// Services
// =======================================

export const getServices = async (params) => {
  const { data } = await api.get("/customer/services", { params });
  return data;
};

// =======================================
// Expert
// =======================================

export const getExpertDetails = async (vendorId) => {
  const { data } = await api.get(`/customer/expert/${vendorId}`);
  return data;
};

// =======================================
// Profile
// =======================================

export const getProfile = async () => {
  const { data } = await api.get("/customer/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/customer/profile", payload);
  return data;
};

export const updateProfileImage = async (formData) => {
  const { data } = await api.patch(
    "/customer/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// =======================================
// Dashboard
// =======================================

export const getDashboardSummary = async () => {
  const { data } = await api.get("/customer/dashboard-summary");
  return data;
};

// =======================================
// Bookings
// =======================================

export const createBooking = async (payload) => {
  const { data } = await api.post("/customer/bookings", payload);
  return data;
};

export const getMyBookings = async (params) => {
  const { data } = await api.get("/customer/bookings", {
    params,
  });

  return data;
};

export const getBookingById = async (bookingId) => {
  const { data } = await api.get(`/customer/bookings/${bookingId}`);
  return data;
};

export const cancelBooking = async (bookingId, payload) => {
  const { data } = await api.patch(
    `/customer/bookings/${bookingId}/cancel`,
    payload
  );

  return data;
};

// =======================================
// Reviews
// =======================================

export const createReview = async (bookingId, payload) => {
  const { data } = await api.post(
    `/customer/bookings/${bookingId}/review`,
    payload
  );

  return data;
};