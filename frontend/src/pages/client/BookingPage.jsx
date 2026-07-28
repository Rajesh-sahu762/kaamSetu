import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock3,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

import { getServiceById } from "@/services/publicService";
import { getImageUrl } from "@/utils/imageUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800";

const getUpcomingDates = () => {
  const labels = ["Today", "Tomorrow"];
  const dates = [];

  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    dates.push({
      label: labels[i] || d.toLocaleDateString("en-IN", { weekday: "short" }),
      display: d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      value: d.toISOString().split("T")[0],
    });
  }

  return dates;
};

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { serviceId, vendorId } = location.state || {};

  const [service, setService] = useState(null);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dates = getUpcomingDates();

  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await getServiceById(serviceId);

        if (response.success) {
          setService(response.data.service);
          setRating(response.data.rating);
          setTotalReviews(response.data.totalReviews);
        } else {
          setError(response.message || "Service not found.");
        }
      } catch (err) {
        setError("Failed to load this service.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleContinue = () => {
    if (!addressLine.trim() || !city.trim()) {
      toast.error("Please fill in your address and city.");
      return;
    }

    const fullAddress = [addressLine, landmark, city, pincode]
      .filter(Boolean)
      .join(", ");

    navigate("/checkout", {
      state: {
        serviceId,
        vendorId: vendorId || service?.vendorId?._id,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        address: fullAddress,
        notes,
      },
    });
  };

  if (!serviceId) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-muted">
            No service selected. Please pick a service from an expert's
            profile first.
          </p>

          <button
            onClick={() => navigate("/experts")}
            className="
              mt-6
              px-6
              py-3
              rounded-2xl
              bg-[#745A38]
              text-white
              font-medium
            "
          >
            Browse Experts
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-muted">
          Loading service details...
        </div>
      </section>
    );
  }

  if (error || !service) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-red-500">
          {error || "Service not found."}
        </div>
      </section>
    );
  }

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
        {/* Heading */}

        <div className="mb-10">

          <h1
            className="
              text-4xl
              md:text-5xl

              font-semibold

              text-primary
            "
          >
            Book Service
          </h1>

          <p
            className="
              mt-3

              text-muted

              text-lg
            "
          >
            Choose your preferred date
            and time to schedule the
            service.
          </p>

        </div>

        <div
          className="
            grid

            lg:grid-cols-[1fr_380px]

            gap-8
          "
        >
          {/* LEFT SIDE */}

          <div className="space-y-8">

            {/* Date Selection */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-3

                  mb-6
                "
              >
                <Calendar
                  size={22}
                  className="text-accent"
                />

                <h2
                  className="
                    text-2xl
                    font-semibold

                    text-primary
                  "
                >
                  Select Date
                </h2>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4

                  gap-4
                "
              >
                {dates.map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      setSelectedDate(
                        item.value
                      )
                    }
                    className={`
                      p-5

                      rounded-2xl

                      border

                      transition

                      ${
                        selectedDate ===
                        item.value
                          ? "bg-[#745A38] text-white border-[#745A38]"
                          : "bg-card border-theme text-primary"
                      }
                    `}
                  >
                    <p className="font-medium">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm">
                      {item.display}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-3

                  mb-6
                "
              >
                <Clock3
                  size={22}
                  className="text-accent"
                />

                <h2
                  className="
                    text-2xl
                    font-semibold

                    text-primary
                  "
                >
                  Select Time
                </h2>
              </div>

              <div
                className="
                  grid

                  md:grid-cols-3

                  gap-4
                "
              >
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() =>
                      setSelectedTime(
                        slot
                      )
                    }
                    className={`
                      py-4

                      rounded-2xl

                      border

                      transition

                      ${
                        selectedTime ===
                        slot
                          ? "bg-[#745A38] text-white border-[#745A38]"
                          : "bg-card border-theme text-primary"
                      }
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-3

                  mb-6
                "
              >
                <MapPin
                  size={22}
                  className="text-accent"
                />

                <h2
                  className="
                    text-2xl
                    font-semibold

                    text-primary
                  "
                >
                  Service Address
                </h2>
              </div>

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Address Line"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="
                    w-full

                    p-4

                    rounded-2xl

                    border
                    border-theme

                    bg-surface

                    outline-none
                  "
                />

                <input
                  type="text"
                  placeholder="Landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="
                    w-full

                    p-4

                    rounded-2xl

                    border
                    border-theme

                    bg-surface

                    outline-none
                  "
                />

                <div
                  className="
                    grid
                    md:grid-cols-2

                    gap-4
                  "
                >
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="
                      p-4

                      rounded-2xl

                      border
                      border-theme

                      bg-surface
                    "
                  />

                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="
                      p-4

                      rounded-2xl

                      border
                      border-theme

                      bg-surface
                    "
                  />
                </div>

                <textarea
                  rows="4"
                  placeholder="Special Instructions (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="
                    w-full

                    p-4

                    rounded-2xl

                    border
                    border-theme

                    bg-surface

                    resize-none
                  "
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div>

            <div
              className="
                sticky
                top-28

                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <img
                src={
                  getImageUrl(service.vendorId?.userId?.profileImage, "profile") ||
                  FALLBACK_IMAGE
                }
                alt=""
                className="
                  w-full
                  h-56

                  object-cover

                  rounded-2xl
                "
              />

              <h3
                className="
                  mt-5

                  text-2xl
                  font-semibold

                  text-primary
                "
              >
                {service.vendorId?.businessName}
              </h3>

              <p className="mt-1 text-muted">{service.serviceName}</p>

              <div
                className="
                  flex
                  items-center

                  gap-2

                  mt-3
                "
              >
                <Star
                  size={18}
                  fill="currentColor"
                  className="
                    text-yellow-500
                  "
                />

                <span>
                  {rating ? rating.toFixed(1) : "New"} ({totalReviews} Reviews)
                </span>
              </div>

              <div
                className="
                  mt-6

                  pt-6

                  border-t
                  border-theme
                "
              >
                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <span
                    className="
                      text-lg
                      font-medium
                    "
                  >
                    Total
                  </span>

                  <span
                    className="
                      text-2xl
                      font-bold

                      text-primary
                    "
                  >
                    ₹{service.startingPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="
                  w-full

                  mt-8

                  py-4

                  rounded-2xl

                  bg-[#745A38]

                  text-white

                  font-medium

                  flex
                  items-center
                  justify-center

                  gap-2

                  hover:opacity-90

                  transition
                "
              >
                Continue To Checkout

                <ArrowRight size={18} />
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
