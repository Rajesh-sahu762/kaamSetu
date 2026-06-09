import { useState } from "react";
import {
  Calendar,
  Clock3,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

const BookingPage = () => {

  const [selectedDate, setSelectedDate] =
    useState("Today");

  const [selectedTime, setSelectedTime] =
    useState("10:00 AM");

  const dates = [
    {
      label: "Today",
      date: "12 Jun",
    },
    {
      label: "Tomorrow",
      date: "13 Jun",
    },
    {
      label: "Fri",
      date: "14 Jun",
    },
    {
      label: "Sat",
      date: "15 Jun",
    },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

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
                    key={item.label}
                    onClick={() =>
                      setSelectedDate(
                        item.label
                      )
                    }
                    className={`
                      p-5

                      rounded-2xl

                      border

                      transition

                      ${
                        selectedDate ===
                        item.label
                          ? "bg-[#745A38] text-white border-[#745A38]"
                          : "bg-card border-theme text-primary"
                      }
                    `}
                  >
                    <p className="font-medium">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm">
                      {item.date}
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
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
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
                Rajesh Electric Works
              </h3>

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
                  4.9 (245 Reviews)
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

                    mb-3
                  "
                >
                  <span>
                    Visit Charge
                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >
                    ₹499
                  </span>
                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <span>
                    Platform Fee
                  </span>

                  <span
                    className="
                      font-semibold
                    "
                  >
                    ₹49
                  </span>
                </div>
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
                    ₹548
                  </span>
                </div>
              </div>

              <button
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