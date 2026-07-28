import { useEffect, useState } from "react";

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
import { getMyBookings } from "@/services/customerService";
import { getImageUrl } from "@/utils/imageUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000";

const ACTIVE_STATUSES = ["pending", "accepted", "on_the_way", "in_progress"];
const CANCELLED_STATUSES = ["cancelled", "rejected"];

const MyBookingsPage = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("active");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getMyBookings({ limit: 50 });

        if (response.success) {
          setBookings(response.data);
        } else {
          setError(response.message || "Failed to load bookings.");
        }
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings =
    bookings.filter((booking) => {

      if (activeTab === "active") {
        return ACTIVE_STATUSES.includes(booking.status);
      }

      if (activeTab === "completed") {
        return booking.status === "completed";
      }

      return CANCELLED_STATUSES.includes(booking.status);
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

        {/* Loading / Error / Empty */}

        {loading && (
          <p className="text-center text-muted">Loading bookings...</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && filteredBookings.length === 0 && (
          <p className="text-center text-muted">
            No bookings here yet.
          </p>
        )}

        {/* Booking Cards */}

        <div className="space-y-6">

          {filteredBookings.map(
            (booking) => (
              <div
                key={booking._id}
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
                    src={getImageUrl(booking.serviceId?.coverImage, "services") || FALLBACK_IMAGE}
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
                          {booking.vendorId?.businessName}
                        </h2>

                        <p
                          className="
                            mt-1

                            text-muted
                          "
                        >
                          {booking.serviceId?.serviceName}
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
                        value={new Date(
                          booking.bookingDate,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      />

                      <InfoItem
                        icon={
                          <Clock3 size={18} />
                        }
                        value={
                          booking.bookingTime
                        }
                      />

                      <InfoItem
                        icon={
                          <MapPin size={18} />
                        }
                        value={
                          booking.vendorId?.city
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
                          {booking.bookingNumber}
                        </span>
                      </p>

                      <div
                        className="
                          flex

                          gap-3
                        "
                      >
                        {booking.status ===
                          "completed" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/review/${booking._id}`,
                              )
                            }
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

                        {!CANCELLED_STATUSES.includes(booking.status) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/booking/${booking._id}`,
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

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  on_the_way: "On The Way",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const StatusBadge = ({
  status,
}) => {

  const label = STATUS_LABELS[status] || status;

  if (ACTIVE_STATUSES.includes(status)) {
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
        {label}
      </div>
    );
  }

  if (status === "completed") {
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
        {label}
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
      {label}
    </div>
  );
};

export default MyBookingsPage;
