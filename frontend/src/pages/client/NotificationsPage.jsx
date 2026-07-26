import {
  Bell,
  CheckCircle2,
  Truck,
  Star,
  Trash2,
  CheckCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/services/notificationService";

const timeAgo = (value) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
};

const getDayLabel = (value) => {
  const date = new Date(value);
  const startOfDay = (d) => { const c = new Date(d); c.setHours(0, 0, 0, 0); return c.getTime(); };
  const today = startOfDay(new Date());
  const yesterday = today - 24 * 60 * 60 * 1000;
  const target = startOfDay(date);
  if (target === today) return "Today";
  if (target === yesterday) return "Yesterday";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

const NotificationsPage = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (notification) => {
    if (notification.isRead) return;
    setNotifications((prev) =>
      prev.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item)),
    );
    try {
      await markNotificationAsRead(notification._id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (notification) => {
    setNotifications((prev) => prev.filter((item) => item._id !== notification._id));
    try {
      await deleteNotification(notification._id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const grouped = notifications.reduce((acc, item) => {
    const day = getDayLabel(item.createdAt);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (notification) => {
    const text = `${notification.title} ${notification.message}`.toLowerCase();
    if (notification.type === "review") {
      return <Star className="text-yellow-500" size={22} />;
    }
    if (text.includes("way")) {
      return <Truck className="text-blue-500" size={22} />;
    }
    if (text.includes("completed")) {
      return <CheckCircle2 className="text-[#745A38]" size={22} />;
    }
    if (notification.type === "booking" || notification.type === "payment") {
      return <CheckCircle2 className="text-green-500" size={22} />;
    }
    return <Bell className="text-primary" size={22} />;
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
          className="mb-14"
        >
          <div
            className="
              flex

              items-center

              justify-between

              gap-4
            "
          >
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

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="
                  inline-flex items-center gap-1.5
                  text-sm font-medium
                  text-[#745A38]
                  hover:opacity-80
                  transition
                  disabled:opacity-50
                "
              >
                <CheckCheck size={16} />
                {markingAll ? "Marking…" : "Mark all as read"}
              </button>
            )}
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
        </motion.div>

        {/* Notification Feed */}

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="py-6 border-b border-theme flex gap-5 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-[#745A38]/10" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 rounded bg-[#745A38]/10" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-[#745A38]/5" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-24 text-center">
            <Bell size={40} className="mx-auto text-muted opacity-40" />
            <p className="mt-4 text-muted">You have no notifications yet.</p>
          </div>
        ) : (
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
                        onClick={() => handleMarkRead(notification)}
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
                        className="
                          py-6

                          border-b
                          border-theme

                          flex

                          gap-5

                          hover:translate-x-1

                          transition

                          cursor-pointer

                          relative
                        "
                      >
                        {/* Unread dot */}
                        {!notification.isRead && (
                          <span className="absolute left-[-14px] top-9 w-2 h-2 rounded-full bg-[#745A38]" />
                        )}

                        {/* Icon */}

                        <div
                          className="
                            mt-1
                          "
                        >
                          {getIcon(
                            notification
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
                              className={`font-semibold ${notification.isRead ? "text-muted" : "text-primary"}`}
                            >
                              {
                                notification.title
                              }
                            </h3>

                            <span
                              className="
                                text-sm

                                text-muted

                                whitespace-nowrap
                              "
                            >
                              {timeAgo(notification.createdAt)}
                            </span>
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

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={(event) => { event.stopPropagation(); handleDelete(notification); }}
                          className="
                            mt-1
                            text-muted
                            hover:text-red-500
                            transition
                            self-start
                          "
                          aria-label="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
        )}

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