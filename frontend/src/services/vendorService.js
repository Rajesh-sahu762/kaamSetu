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