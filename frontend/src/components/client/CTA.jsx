import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Wrench,
} from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-15 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            relative
            overflow-hidden

            rounded-[32px]

            bg-[#091426]

            px-8
            md:px-16

            py-14
            md:py-20
          "
        >
          {/* Background Glow */}

          <div
            className="
              absolute
              top-0
              right-0

              w-[400px]
              h-[400px]

              rounded-full

              bg-[#745A38]/20
              blur-[120px]
            "
          />

          <div
            className="
              relative
              z-10

              grid
              lg:grid-cols-2
              gap-12
              items-center
            "
          >
            {/* Left */}

            <div>
              <span
                className="
                  inline-block

                  px-4
                  py-2

                  rounded-full

                  bg-[#1b2b43]

                  text-[#C59A6A]
                  text-sm
                "
              >
                Join India's Growing Service Network
              </span>

              <h2
                className="
                  mt-6

                  text-4xl
                  md:text-5xl

                  font-semibold
                  text-white

                  leading-tight
                "
              >
                Need a Professional
                <br />
                For Your Next Job?
              </h2>

              <p
                className="
                  mt-6

                  text-lg
                  text-[#d3e4fe]

                  leading-8
                "
              >
                Connect with trusted electricians,
                plumbers, carpenters and hundreds of
                verified experts in your city.
              </p>

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-4
                "
              >
                {/* Customer CTA */}

                <motion.button
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    flex
                    items-center
                    gap-2

                    px-6
                    py-4

                    rounded-xl

                    bg-card
                    text-primary

                    font-semibold
                  "
                >
                  <Wrench size={18} />

                  Book a Service

                  <ArrowRight size={18} />
                </motion.button>

                {/* Vendor CTA */}

                <motion.button
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    flex
                    items-center
                    gap-2

                    px-6
                    py-4

                    rounded-xl

                    border
                    border-[#2b3c56]

                    text-white

                    hover:bg-[#132033]
                    transition-all
                  "
                >
                  <Briefcase size={18} />

                  Find Work
                </motion.button>
              </div>
            </div>

            {/* Right Stats */}

            <div
              className="
                grid
                grid-cols-2
                gap-5
              "
            >
              <StatCard
                value="10K+"
                label="Happy Customers"
              />

              <StatCard
                value="2K+"
                label="Verified Experts"
              />

              <StatCard
                value="50+"
                label="Service Categories"
              />

              <StatCard
                value="4.9★"
                label="Average Rating"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({
  value,
  label,
}) => {
  return (
    <div
      className="
        bg-[#132033]

        border
        border-[#22324a]

        rounded-2xl

        p-6
      "
    >
      <h3
        className="
          text-3xl
          font-bold
          text-white
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-2
          text-[#d3e4fe]
        "
      >
        {label}
      </p>
    </div>
  );
};

export default FinalCTA;