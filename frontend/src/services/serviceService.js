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

export const addService = async (formData) => {

    const response = await api.post(
        "/vendor/services",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

// ==========================
// Update Service
// ==========================

export const updateService = async(id,formData)=>{
    const response=await api.put(
        `/vendor/services/${id}`,
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );
    return response.data;
}

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

export const getCategories = async () => {

    const response = await api.get("/vendor/categories");

    return response.data;

};

