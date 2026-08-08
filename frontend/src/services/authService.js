import api from './api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const googleLogin =
  async (data) => {

    const response =
      await api.post(
        "/auth/google",
        data
      );

    return response.data;
};

export const facebookLogin = async (data) => {
  const response = await api.post(
    "/auth/facebook",
    data
  );

  return response.data;
};

export const verifyEmailOtp = async (data) => {
  const response = await api.post('/auth/verify-email', data);

  return response.data;
};

export const resendOtp = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });

  return response.data;
};

export const deactivateAccount = async () => {
  const response = await api.patch("/auth/deactivate-account");
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);

  return response.data;
};

export const vendorRegister = async (vendorData) => {
  try {
    const response = await api.post('/auth/vendor/register', vendorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);

    return response.data;
  } catch (error) {
    throw error;
  }
};