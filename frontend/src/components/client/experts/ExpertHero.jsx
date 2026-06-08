import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ShieldCheck,
} from "lucide-react";

const ExpertHero = () => {
  return (
    <section
      className="
        relative
        overflow-hidden

        pt-32
        pb-16

        bg-theme
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-[600px]
          h-[600px]

          rounded-full

          bg-[#745A38]/10

          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10

          max-w-[1280px]
          mx-auto

          px-6
          lg:px-8
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            max-w-4xl
            mx-auto

            text-center
          "
        >
          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2

              px-4
              py-2

              rounded-full

              bg-card

              border
              border-theme

              text-sm
              text-muted
            "
          >
            <ShieldCheck
              size={16}
              className="
                text-green-500
              "
            />

            Verified Professionals Only
          </div>

          {/* Heading */}

          <h1
            className="
              mt-6

              text-4xl
              md:text-6xl

              font-semibold

              text-primary

              leading-tight
            "
          >
            Electricians
            <span className="text-accent">
              {" "}Near You
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              mt-5

              text-lg
              md:text-xl

              text-muted

              max-w-2xl
              mx-auto
            "
          >
            Compare ratings, experience,
            pricing and availability
            before booking the right
            professional.
          </p>

          {/* Quick Stats */}

          <div
            className="
              mt-10

              flex
              flex-wrap

              justify-center

              gap-8
            "
          >
            {/* Experts */}

            <div>
              <h3
                className="
                  text-3xl
                  font-bold

                  text-primary
                "
              >
                120+
              </h3>

              <p className="text-muted">
                Experts
              </p>
            </div>

            {/* Rating */}

            <div>
              <h3
                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  text-3xl
                  font-bold

                  text-primary
                "
              >
                <Star
                  size={24}
                  fill="currentColor"
                  className="
                    text-yellow-500
                  "
                />

                4.9
              </h3>

              <p className="text-muted">
                Average Rating
              </p>
            </div>

            {/* Location */}

            <div>
              <h3
                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  text-3xl
                  font-bold

                  text-primary
                "
              >
                <MapPin
                  size={24}
                  className="
                    text-accent
                  "
                />

                Bhilwara
              </h3>

              <p className="text-muted">
                Service Area
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertHero;