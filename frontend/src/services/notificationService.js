import api from "./api";

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");

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

export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);

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

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch("/notifications/read-all");

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

export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);

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
