const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {

    getNotifications,

    markNotificationAsRead,
    markAllNotificationsAsRead,

deleteNotification,

clearAllNotifications,

} = require("../controllers/notificationController");


// =======================================
// Notification Routes
// =======================================

router.get(
    "/",
    verifyToken,
    getNotifications
);
router.patch("/read-all", verifyToken, markAllNotificationsAsRead);

router.delete("/clear-all", verifyToken, clearAllNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);

router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;