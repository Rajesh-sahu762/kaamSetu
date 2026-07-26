import api from "./api";

// Get all of the logged-in user's notifications + unread count
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Mark a single notification as read
export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

// Mark every notification as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

// Delete a single notification
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

// Clear every notification
export const clearAllNotifications = async () => {
  const response = await api.delete("/notifications/clear-all");
  return response.data;
};