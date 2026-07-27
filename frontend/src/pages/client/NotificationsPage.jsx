import { useEffect, useState } from "react";

import {
  Bell,
  CheckCircle2,
  Truck,
  Star,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/services/notificationService";

const getDayLabel = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long" });
};

const getRelativeTime = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour(s) ago`;

  return getDayLabel(dateString);
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications();

        if (response.success) {
          setNotifications(response.data);
        }
      } catch (err) {
        toast.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    const response = await markAllNotificationsAsRead();

    if (response.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } else {
      toast.error(response.message || "Failed to update notifications.");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;

    const response = await markNotificationAsRead(notification._id);

    if (response.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    const response = await deleteNotification(id);

    if (response.success) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } else {
      toast.error(response.message || "Failed to delete notification.");
    }
  };

  const grouped = notifications.reduce((acc, item) => {
    const day = getDayLabel(item.createdAt);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <CheckCircle2 className="text-green-500" size={22} />;

      case "payment":
        return <CheckCircle2 className="text-[#745A38]" size={22} />;

      case "review":
        return <Star className="text-yellow-500" size={22} />;

      case "service":
        return <Truck className="text-blue-500" size={22} />;

      default:
        return <Bell className="text-primary" size={22} />;
    }
  };

  return (
    <section
      className="
        min-h-screen

        bg-theme

        pt-32
        pb-20
      "
    >
      <div
        className="
          max-w-4xl
          mx-auto

          px-6
          lg:px-8
        "
      >
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-14 flex items-start justify-between gap-4"
        >
          <div>
            <div
              className="
                inline-flex

                items-center

                gap-2

                text-[#745A38]

                font-medium
              "
            >
              <Bell size={18} />

              Notifications
            </div>

            <h1
              className="
                mt-4

                text-5xl

                font-semibold

                text-primary
              "
            >
              Stay Updated
            </h1>

            <p
              className="
                mt-3

                text-lg

                text-muted
              "
            >
              Booking updates, service alerts
              and important activity.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="
                px-5
                py-3

                rounded-xl

                border
                border-theme

                text-primary

                whitespace-nowrap

                hover:bg-surface

                transition
              "
            >
              Mark All Read
            </button>
          )}
        </motion.div>

        {loading && (
          <p className="text-center text-muted">Loading notifications...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="text-center text-muted">No notifications yet.</p>
        )}

        {/* Notification Feed */}

        <div className="space-y-12">
          {Object.entries(grouped).map(
            ([day, items]) => (
              <div key={day}>
                {/* Day Label */}

                <div
                  className="
                    flex

                    items-center

                    gap-4

                    mb-6
                  "
                >
                  <div
                    className="
                      text-sm

                      uppercase

                      tracking-widest

                      text-muted
                    "
                  >
                    {day}
                  </div>

                  <div
                    className="
                      flex-1

                      h-px

                      bg-border
                    "
                  />
                </div>

                {/* Feed */}

                <div>
                  {items.map(
                    (
                      notification,
                      index
                    ) => (
                      <motion.div
                        key={
                          notification._id
                        }
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.1,
                        }}
                        className={`
                          py-6

                          border-b
                          border-theme

                          flex

                          gap-5

                          cursor-pointer

                          hover:translate-x-1

                          transition

                          ${notification.isRead ? "" : "bg-[#745A38]/5"}
                        `}
                      >
                        {/* Icon */}

                        <div
                          className="
                            mt-1
                          "
                        >
                          {getIcon(
                            notification.type
                          )}
                        </div>

                        {/* Content */}

                        <div className="flex-1">
                          <div
                            className="
                              flex

                              justify-between

                              gap-4
                            "
                          >
                            <h3
                              className="
                                font-semibold

                                text-primary

                                flex
                                items-center
                                gap-2
                              "
                            >
                              {
                                notification.title
                              }

                              {!notification.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#745A38]" />
                              )}
                            </h3>

                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className="
                                  text-sm

                                  text-muted

                                  whitespace-nowrap
                                "
                              >
                                {getRelativeTime(notification.createdAt)}
                              </span>

                              <button
                                onClick={(e) => handleDelete(notification._id, e)}
                                className="text-muted hover:text-red-500 transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <p
                            className="
                              mt-2

                              text-muted

                              leading-relaxed
                            "
                          >
                            {
                              notification.message
                            }
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom */}

        {!loading && notifications.length > 0 && (
          <div
            className="
              mt-16

              text-center

              text-sm

              text-muted
            "
          >
            You're all caught up 🎉
          </div>
        )}
      </div>
    </section>
  );
};

export default NotificationsPage;
