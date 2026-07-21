import api from "./api";

// Get the logged-in customer's dashboard summary (profile + live stats + recent activity)
export const getDashboardSummary = async () => {
  const response = await api.get("/customer/dashboard-summary");
  return response.data;
};