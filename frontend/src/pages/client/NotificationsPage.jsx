import {
  Bell,
  CheckCircle2,
  Truck,
  Star,
  Clock3,
} from "lucide-react";

import { motion } from "framer-motion";

const NotificationsPage = () => {

  const notifications = [
    {
      id: 1,
      title: "Booking Accepted",
      message:
        "Rajesh Electric Works accepted your booking request.",
      time: "2 min ago",
      type: "success",
      day: "Today",
    },

    {
      id: 2,
      title: "Expert On The Way",
      message:
        "Your expert is on the way and will arrive shortly.",
      time: "25 min ago",
      type: "progress",
      day: "Today",
    },

    {
      id: 3,
      title: "Service Completed",
      message:
        "Your electrical repair service has been completed successfully.",
      time: "Yesterday",
      type: "completed",
      day: "Yesterday",
    },

    {
      id: 4,
      title: "Leave A Review",
      message:
        "Share your experience to help other customers.",
      time: "Yesterday",
      type: "review",
      day: "Yesterday",
    },
  ];

  const grouped = notifications.reduce(
    (acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = [];
      }

      acc[item.day].push(item);

      return acc;
    },
    {}
  );

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2
            className="text-green-500"
            size={22}
          />
        );

      case "progress":
        return (
          <Truck
            className="text-blue-500"
            size={22}
          />
        );

      case "completed":
        return (
          <CheckCircle2
            className="text-[#745A38]"
            size={22}
          />
        );

      case "review":
        return (
          <Star
            className="text-yellow-500"
            size={22}
          />
        );

      default:
        return (
          <Bell
            className="text-primary"
            size={22}
          />
        );
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
          className="mb-14"
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
                          notification.id
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
                        className="
                          py-6

                          border-b
                          border-theme

                          flex

                          gap-5

                          hover:translate-x-1

                          transition
                        "
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
                              "
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
                              {
                                notification.time
                              }
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
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom */}

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
      </div>
    </section>
  );
};

export default NotificationsPage;