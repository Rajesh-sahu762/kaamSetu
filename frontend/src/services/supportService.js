import api from "./api";

export const submitSupportRequest = async (payload) => {
  try {
    const response = await api.post("/support/contact", payload);

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
