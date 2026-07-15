const Notification = require("../models/notification");

// =======================================
// Get Notifications
// =======================================

const getNotifications = async (req, res) => {
  try {

    const { userId } = req.user;

    const notifications = await Notification.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",

      data: notifications,

      unreadCount,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Mark Notification As Read
// =======================================

const markNotificationAsRead = async (req, res) => {
  try {

    const { userId } = req.user;

    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    if (!notification.isRead) {

      notification.isRead = true;

      await notification.save();

    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Mark All Notifications As Read
// =======================================

const markAllNotificationsAsRead = async (req, res) => {
  try {

    const { userId } = req.user;

    await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Delete Notification
// =======================================

const deleteNotification = async (req, res) => {
  try {

    const { userId } = req.user;

    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!notification) {

      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });

    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =======================================
// Clear All Notifications
// =======================================

const clearAllNotifications = async (req, res) => {
  try {

    const { userId } = req.user;

    await Notification.deleteMany({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully.",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



module.exports = {
 getNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    clearAllNotifications
};