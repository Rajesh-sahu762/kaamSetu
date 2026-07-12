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
