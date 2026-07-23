import api from "./api";

// Get the logged-in customer's dashboard summary (profile + live stats + recent activity)
export const getDashboardSummary = async () => {
  const response = await api.get("/customer/dashboard-summary");
  return response.data;
};

// Home Page
export const getHomeData = async () => {
  const response = await api.get("/customer/home");
  return response.data;
};

// Expert Profile
export const getExpertProfile = async (vendorId) => {
  const response = await api.get(`/customer/expert/${vendorId}`);
  return response.data;
};