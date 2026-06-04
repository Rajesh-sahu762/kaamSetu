import api from "./api";

export const registerUser = async (userData) => {
    try {
        const response = await api.post(
    "/auth/register",
    userData
);
    return response.data

    } catch (error) {
        throw error
    }
}


export const loginUser = async (userData) => {
    try {
         const response = await api.post(
    "/auth/login",
    userData
  );

  return response.data;
        
    } catch (error) {
        throw error
    }
}