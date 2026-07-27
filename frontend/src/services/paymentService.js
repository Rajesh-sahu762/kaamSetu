import api from "./api";

// =======================================
// Razorpay Checkout Script Loader
// =======================================

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// =======================================
// Create Order
// =======================================

export const createOrder = async (bookingId) => {
  try {
    const response = await api.post("/payment/create-order", { bookingId });

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
// Verify Payment
// =======================================

export const verifyPayment = async (payload) => {
  try {
    const response = await api.post("/payment/verify", payload);

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
