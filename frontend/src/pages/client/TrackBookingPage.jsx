import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Clock3,
  User,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  XCircle,
} from "lucide-react";

import { getMyBookingById } from "@/services/customerService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000";

const TIMELINE = [
  { key: "pending", label: "Booking Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "on_the_way", label: "On The Way" },
  { key: "in_progress", label: "Service Started" },
  { key: "completed", label: "Completed" },
];

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  on_the_way: "On The Way",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const TrackBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await getMyBookingById(id);

        if (response.success) {
          setBooking(response.data);
        } else {
          setError(response.message || "Booking not found.");
        }
      } catch (err) {
        setError("Failed to load this booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-muted">
          Loading booking...
        </div>
      </section>
    );
  }

  if (error || !booking) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-red-500">
          {error || "Booking not found."}
        </div>
      </section>
    );
  }

  const isCancelled = ["cancelled", "rejected"].includes(booking.status);
  const currentStep = TIMELINE.findIndex((s) => s.key === booking.status);

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
          max-w-6xl
          mx-auto

          px-6
          lg:px-8
        "
      >
        {/* Header */}

        <div className="mb-10">

          <span
            className={`
              inline-flex

              items-center

              gap-2

              px-4
              py-2

              rounded-full

              text-sm
              font-medium

              ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }
            `}
          >
            {isCancelled ? (
              <XCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Booking {STATUS_LABELS[booking.status]}
          </span>

          <h1
            className="
              mt-5

              text-4xl
              md:text-5xl

              font-semibold

              text-primary
            "
          >
            Track Your Booking
          </h1>

          <p
            className="
              mt-3

              text-lg

              text-muted
            "
          >
            Stay updated with your
            service progress in real time.
          </p>
        </div>

        {/* Booking ID */}

        <div
          className="
            bg-card

            border
            border-theme

            rounded-3xl

            p-6

            mb-8
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row

              md:items-center
              md:justify-between

              gap-4
            "
          >
            <div>
              <p className="text-muted">
                Booking ID
              </p>

              <h3
                className="
                  text-2xl

                  font-semibold

                  text-primary
                "
              >
                {booking.bookingNumber}
              </h3>
            </div>

            <div
              className={`
                px-4
                py-2

                rounded-full

                font-medium

                ${
                  isCancelled
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }
              `}
            >
              {STATUS_LABELS[booking.status]}
            </div>
          </div>
        </div>

        {/* Timeline */}

        {!isCancelled && (
          <div
            className="
              bg-card

              border
              border-theme

              rounded-3xl

              p-8

              mb-8
            "
          >
            <h2
              className="
                text-2xl

                font-semibold

                text-primary

                mb-10
              "
            >
              Booking Progress
            </h2>

            <div
              className="
                flex

                justify-between

                relative
              "
            >
              {/* Line */}

              <div
                className="
                  absolute

                  top-5

                  left-0
                  right-0

                  h-1

                  bg-gray-200
                "
              />

              <div
                className="
                  absolute

                  top-5
                  left-0

                  h-1

                  bg-green-500
                "
                style={{
                  width: `${
                    (Math.max(currentStep, 0) / (TIMELINE.length - 1)) * 100
                  }%`,
                }}
              />

              {TIMELINE.map(
                (step, index) => (
                  <div
                    key={step.key}
                    className="
                      relative

                      flex
                      flex-col

                      items-center

                      z-10
                    "
                  >
                    <div
                      className={`
                        w-10
                        h-10

                        rounded-full

                        flex
                        items-center
                        justify-center

                        text-sm
                        font-semibold

                        ${
                          index <= currentStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >
                      {index + 1}
                    </div>

                    <p
                      className="
                        mt-3

                        text-center

                        text-sm

                        text-primary
                      "
                    >
                      {step.label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Grid */}

        <div
          className="
            grid

            lg:grid-cols-2

            gap-8
          "
        >
          {/* Expert Card */}

          <div
            className="
              bg-card

              border
              border-theme

              rounded-3xl

              p-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold

                text-primary

                mb-6
              "
            >
              Assigned Expert
            </h2>

            <div
              className="
                flex

                gap-5
              "
            >
              <img
                src={
                  booking.vendorId?.userId?.profileImage || FALLBACK_IMAGE
                }
                alt=""
                className="
                  w-24
                  h-24

                  rounded-2xl

                  object-cover
                "
              />

              <div>
                <h3
                  className="
                    text-xl
                    font-semibold

                    text-primary
                  "
                >
                  {booking.vendorId?.businessName}
                </h3>

                <p className="text-muted">
                  {booking.serviceId?.serviceName}
                </p>

                <div
                  className="
                    mt-3

                    flex

                    gap-3
                  "
                >
                  <a
                    href={
                      booking.vendorId?.userId?.mobile
                        ? `tel:${booking.vendorId.userId.mobile}`
                        : undefined
                    }
                    className="
                      flex
                      items-center

                      gap-2

                      px-4
                      py-2

                      rounded-xl

                      bg-[#745A38]

                      text-white
                    "
                  >
                    <Phone size={16} />
                    Call
                  </a>

                  <button
                    className="
                      flex
                      items-center

                      gap-2

                      px-4
                      py-2

                      rounded-xl

                      border
                      border-theme
                    "
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}

          <div
            className="
              bg-card

              border
              border-theme

              rounded-3xl

              p-6
            "
          >
            <h2
              className="
                text-2xl

                font-semibold

                text-primary

                mb-6
              "
            >
              Booking Details
            </h2>

            <div className="space-y-5">

              <DetailRow
                icon={<Calendar size={18} />}
                label="Date"
                value={new Date(booking.bookingDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "long", year: "numeric" },
                )}
              />

              <DetailRow
                icon={<Clock3 size={18} />}
                label="Time"
                value={booking.bookingTime}
              />

              <DetailRow
                icon={<MapPin size={18} />}
                label="Address"
                value={booking.address}
              />

              <DetailRow
                icon={<User size={18} />}
                label="Service"
                value={booking.serviceId?.serviceName}
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}

        <div
          className="
            mt-8

            bg-card

            border
            border-theme

            rounded-3xl

            p-6

            flex
            flex-col
            md:flex-row

            gap-4

            justify-between
            items-center
          "
        >
          <div>
            <h3
              className="
                text-xl

                font-semibold

                text-primary
              "
            >
              Need Help?
            </h3>

            <p className="text-muted">
              Contact support if you have
              any issues regarding booking.
            </p>
          </div>

          <button
            onClick={() => navigate("/support")}
            className="
              px-8
              py-4

              rounded-2xl

              bg-[#091426]

              text-white

              font-medium

              hover:opacity-90

              transition
            "
          >
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}) => (
  <div
    className="
      flex

      justify-between

      items-center
    "
  >
    <div
      className="
        flex

        items-center

        gap-3
      "
    >
      {icon}
      <span>{label}</span>
    </div>

    <span
      className="
        font-medium

        text-primary
      "
    >
      {value}
    </span>
  </div>
);

export default TrackBookingPage;
