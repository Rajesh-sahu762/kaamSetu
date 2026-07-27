import { motion } from "framer-motion";

import {
  CheckCircle2,
  ArrowRight,
  Home,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingNumber, bookingId } = location.state || {};

  return (
    <section
      className="
        min-h-screen

        bg-theme

        flex
        items-center
        justify-center

        px-6
        py-20
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          w-full
          max-w-3xl

          bg-card

          border
          border-theme

          rounded-[32px]

          shadow-theme

          overflow-hidden
        "
      >
        {/* Top Section */}

        <div
          className="
            relative

            text-center

            px-8
            py-12
          "
        >
          {/* Success Circle */}

          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              type: "spring",
            }}
            className="
              w-24
              h-24

              mx-auto

              rounded-full

              flex
              items-center
              justify-center

              bg-green-100
            "
          >
            <CheckCircle2
              size={50}
              className="
                text-green-600
              "
            />
          </motion.div>

          <h1
            className="
              mt-8

              text-4xl
              md:text-5xl

              font-semibold

              text-primary
            "
          >
            Booking Confirmed
          </h1>

          <p
            className="
              mt-4

              text-lg

              text-muted

              max-w-xl
              mx-auto
            "
          >
            Your service request has been
            successfully submitted. The
            expert has been notified and
            will contact you shortly.
          </p>

          {/* Booking ID */}

          {bookingNumber && (
            <div
              className="
                mt-8

                inline-flex

                items-center

                px-5
                py-3

                rounded-full

                bg-[#745A38]/10

                border
                border-[#745A38]/20
              "
            >
              <span
                className="
                  text-sm
                  text-muted
                "
              >
                Booking ID :
              </span>

              <span
                className="
                  ml-2

                  font-semibold

                  text-primary
                "
              >
                {bookingNumber}
              </span>
            </div>
          )}
        </div>

        {/* Timeline */}

        <div
          className="
            border-t
            border-theme

            px-8
            py-8
          "
        >
          <h3
            className="
              text-xl
              font-semibold

              text-primary

              mb-6
            "
          >
            What Happens Next?
          </h3>

          <div className="space-y-5">

            <StepItem
              number="1"
              title="Booking Received"
              desc="Your request has been submitted successfully."
            />

            <StepItem
              number="2"
              title="Expert Verification"
              desc="The expert will review your booking details."
            />

            <StepItem
              number="3"
              title="Expert Contact"
              desc="You'll receive a confirmation call or message."
            />

            <StepItem
              number="4"
              title="Service Delivery"
              desc="The expert arrives at the selected time."
            />

          </div>
        </div>

        {/* Actions */}

        <div
          className="
            border-t
            border-theme

            px-8
            py-8

            flex
            flex-col
            sm:flex-row

            gap-4
          "
        >
          <button
            onClick={() =>
              bookingId
                ? navigate(`/booking/${bookingId}`)
                : navigate("/my-booking")
            }
            className="
              flex-1

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
            Track Booking

            <ArrowRight size={18} />
          </button>

          <button
            onClick={() =>
              navigate("/")
            }
            className="
              flex-1

              py-4

              rounded-2xl

              border
              border-theme

              text-primary

              font-medium

              flex
              items-center
              justify-center

              gap-2

              hover:bg-surface

              transition
            "
          >
            <Home size={18} />

            Back To Home
          </button>
        </div>
      </motion.div>
    </section>
  );
};

const StepItem = ({
  number,
  title,
  desc,
}) => (
  <div
    className="
      flex

      gap-4
    "
  >
    <div
      className="
        w-10
        h-10

        shrink-0

        rounded-full

        bg-[#745A38]

        text-white

        flex
        items-center
        justify-center

        font-semibold
      "
    >
      {number}
    </div>

    <div>
      <h4
        className="
          font-semibold

          text-primary
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1

          text-muted
        "
      >
        {desc}
      </p>
    </div>
  </div>
);

export default BookingSuccess;
