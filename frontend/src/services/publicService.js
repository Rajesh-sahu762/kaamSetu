import api from "./api";

// =======================================
// Categories
// =======================================

export const getCategories = async () => {
  try {
    const response = await api.get("/public/categories");

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
// Services
// =======================================

export const getServices = async (params = {}) => {
  try {
    const response = await api.get("/public/services", { params });

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

export const getPopularServices = async () => {
  try {
    const response = await api.get("/public/services/popular");

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

export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/public/services/${serviceId}`);

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
// Vendors
// =======================================

export const getFeaturedExperts = async () => {
  try {
    const response = await api.get("/public/vendors/featured");

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

export const getVendors = async (params = {}) => {
  try {
    const response = await api.get("/public/vendors", { params });

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

export const getVendorPublicProfile = async (vendorId) => {
  try {
    const response = await api.get(`/public/vendors/${vendorId}`);

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
