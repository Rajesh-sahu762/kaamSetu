import api from "./api";

// ==========================
// Get All Services
// ==========================

export const getVendorServices = async () => {
  const response = await api.get("/vendor/services");
  return response.data;
};

// ==========================
// Add Service
// ==========================

export const addService = async (data) => {
  const response = await api.post("/vendor/services", data);
  return response.data;
};

// ==========================
// Update Service
// ==========================

export const updateService = async (id, data) => {
  const response = await api.put(`/vendor/services/${id}`, data);
  return response.data;
};

// ==========================
// Delete Service
// ==========================

export const deleteService = async (id) => {
  const response = await api.delete(`/vendor/services/${id}`);
  return response.data;
};

// ==========================
// Toggle Service Status
// ==========================

export const toggleServiceStatus = async (id) => {
  const response = await api.patch(`/vendor/services/${id}/status`);
  return response.data;
};