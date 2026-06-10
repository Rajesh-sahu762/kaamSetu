import { useState } from "react";

import {
  Calendar,
  Clock3,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const MyBookingsPage = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("active");

  const bookings = [
    {
      id: "KS-2026-45892",
      expert: "Rajesh Electric Works",
      service: "Electrical Repair",
      date: "12 June 2026",
      time: "10:00 AM",
      location: "Bhilwara",
      status: "Accepted",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000",
    },

    {
      id: "KS-2026-45893",
      expert: "Mohan Plumbing Services",
      service: "Pipe Leakage Repair",
      date: "15 June 2026",
      time: "02:00 PM",
      location: "Jaipur",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000",
    },

    {
      id: "KS-2026-45894",
      expert: "Home Cleaning Experts",
      service: "Deep Cleaning",
      date: "18 June 2026",
      time: "11:00 AM",
      location: "Udaipur",
      status: "Cancelled",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1000",
    },
  ];

  const filteredBookings =
    bookings.filter((booking) => {

      if (activeTab === "active") {
        return (
          booking.status === "Accepted"
        );
      }

      if (activeTab === "completed") {
        return (
          booking.status === "Completed"
        );
      }

      return (
        booking.status === "Cancelled"
      );
    });

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
          max-w-7xl
          mx-auto

          px-6
          lg:px-8
        "
      >
        {/* Header */}

        <div className="mb-10">

          <h1
            className="
              text-4xl
              md:text-5xl

              font-semibold

              text-primary
            "
          >
            My Bookings
          </h1>

          <p
            className="
              mt-3

              text-lg

              text-muted
            "
          >
            Manage and track all your
            service bookings.
          </p>
        </div>

        {/* Tabs */}

        <div
          className="
            flex

            gap-4

            mb-10

            overflow-x-auto
          "
        >
          <TabButton
            active={
              activeTab === "active"
            }
            onClick={() =>
              setActiveTab("active")
            }
          >
            Active
          </TabButton>

          <TabButton
            active={
              activeTab === "completed"
            }
            onClick={() =>
              setActiveTab("completed")
            }
          >
            Completed
          </TabButton>

          <TabButton
            active={
              activeTab === "cancelled"
            }
            onClick={() =>
              setActiveTab("cancelled")
            }
          >
            Cancelled
          </TabButton>
        </div>

        {/* Booking Cards */}

        <div className="space-y-6">

          {filteredBookings.map(
            (booking) => (
              <div
                key={booking.id}
                className="
                  bg-card

                  border
                  border-theme

                  rounded-3xl

                  p-6

                  shadow-theme
                "
              >
                <div
                  className="
                    flex

                    flex-col
                    lg:flex-row

                    gap-6
                  "
                >
                  {/* Image */}

                  <img
                    src={booking.image}
                    alt=""
                    className="
                      w-full
                      lg:w-48

                      h-48

                      object-cover

                      rounded-2xl
                    "
                  />

                  {/* Content */}

                  <div className="flex-1">

                    <div
                      className="
                        flex

                        flex-col
                        md:flex-row

                        md:justify-between

                        gap-4
                      "
                    >
                      <div>

                        <h2
                          className="
                            text-2xl

                            font-semibold

                            text-primary
                          "
                        >
                          {booking.expert}
                        </h2>

                        <p
                          className="
                            mt-1

                            text-muted
                          "
                        >
                          {booking.service}
                        </p>

                      </div>

                      <StatusBadge
                        status={
                          booking.status
                        }
                      />
                    </div>

                    {/* Details */}

                    <div
                      className="
                        mt-6

                        grid

                        md:grid-cols-3

                        gap-4
                      "
                    >
                      <InfoItem
                        icon={
                          <Calendar size={18} />
                        }
                        value={
                          booking.date
                        }
                      />

                      <InfoItem
                        icon={
                          <Clock3 size={18} />
                        }
                        value={
                          booking.time
                        }
                      />

                      <InfoItem
                        icon={
                          <MapPin size={18} />
                        }
                        value={
                          booking.location
                        }
                      />
                    </div>

                    {/* Footer */}

                    <div
                      className="
                        mt-6

                        flex

                        flex-col
                        md:flex-row

                        md:items-center
                        md:justify-between

                        gap-4
                      "
                    >
                      <p
                        className="
                          text-sm

                          text-muted
                        "
                      >
                        Booking ID:
                        <span
                          className="
                            ml-2

                            font-medium

                            text-primary
                          "
                        >
                          {booking.id}
                        </span>
                      </p>

                      <div
                        className="
                          flex

                          gap-3
                        "
                      >
                        {booking.status ===
                          "Completed" && (
                          <button
                            className="
                              px-5
                              py-3

                              rounded-xl

                              border
                              border-theme
                            "
                          >
                            Write Review
                          </button>
                        )}

                        {booking.status !==
                          "Cancelled" && (
                          <button
                            onClick={() =>
                              navigate(
                                "/track-booking"
                              )
                            }
                            className="
                              px-5
                              py-3

                              rounded-xl

                              bg-[#745A38]

                              text-white

                              flex
                              items-center

                              gap-2
                            "
                          >
                            Track Booking

                            <ArrowRight
                              size={16}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

/* Components */

const TabButton = ({
  children,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      px-6
      py-3

      rounded-2xl

      font-medium

      transition

      ${
        active
          ? "bg-[#745A38] text-white"
          : "bg-card border border-theme text-primary"
      }
    `}
  >
    {children}
  </button>
);

const InfoItem = ({
  icon,
  value,
}) => (
  <div
    className="
      flex

      items-center

      gap-3

      text-muted
    "
  >
    {icon}
    <span>{value}</span>
  </div>
);

const StatusBadge = ({
  status,
}) => {

  if (status === "Accepted") {
    return (
      <div
        className="
          flex
          items-center

          gap-2

          px-4
          py-2

          rounded-full

          bg-green-100

          text-green-700
        "
      >
        <LoaderCircle size={16} />
        {status}
      </div>
    );
  }

  if (status === "Completed") {
    return (
      <div
        className="
          flex
          items-center

          gap-2

          px-4
          py-2

          rounded-full

          bg-blue-100

          text-blue-700
        "
      >
        <CheckCircle2 size={16} />
        {status}
      </div>
    );
  }

  return (
    <div
      className="
        flex
        items-center

        gap-2

        px-4
        py-2

        rounded-full

        bg-red-100

        text-red-700
      "
    >
      <XCircle size={16} />
      {status}
    </div>
  );
};

export default MyBookingsPage;