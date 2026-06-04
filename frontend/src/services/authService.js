import api from "./api";

export const registerUser = async (userData) => {
    try {
        const response = await api.post(
    "/auth/register",
    userData
);
    return response.data

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
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
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}