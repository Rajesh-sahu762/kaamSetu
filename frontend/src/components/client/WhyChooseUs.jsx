import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Clock3,
  HeadphonesIcon,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description:
      "Every expert goes through document and identity verification before joining the platform.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured Service",
    description:
      "Work with trusted professionals who are rated and reviewed by real customers.",
  },
  {
    icon: Clock3,
    title: "Quick Booking",
    description:
      "Book services within minutes and connect with professionals near you instantly.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Our support team is always available to help before, during, and after your booking.",
  },
];

const WhyChooseKaamSetu = () => {
  return (
    <section className="py-24 bg-[#f8f9ff]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        {/* Section Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-xs
              font-semibold
              text-[#745A38]
            "
          >
            Why Choose Us
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-5xl
              font-semibold
              text-[#091426]
            "
          >
            Why Choose KaamSetu
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-[#45474c]
              leading-8
            "
          >
            We connect customers with trusted professionals while
            ensuring quality, transparency and peace of mind.
          </p>
        </div>

        {/* Features */}

        <div
          className="
            mt-20
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  group
                  bg-white
                  border
                  border-[#d3e4fe]
                  rounded-2xl
                  p-8

                  hover:shadow-[0_15px_40px_rgba(9,20,38,0.08)]
                  transition-all
                "
              >
                {/* Icon */}

                <div
                  className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-[#eff4ff]

                    flex
                    items-center
                    justify-center

                    group-hover:bg-[#091426]
                    transition-all
                  "
                >
                  <Icon
                    size={28}
                    className="
                      text-[#745A38]
                      group-hover:text-white
                      transition-all
                    "
                  />
                </div>

                {/* Content */}

                <h3
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    text-[#091426]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-4
                    text-[#45474c]
                    leading-7
                  "
                >
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}

        <div
          className="
            mt-24

            bg-[#091426]
            rounded-3xl

            px-8
            py-14

            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8

            text-center
          "
        >
          <Stat number="10K+" label="Happy Customers" />
          <Stat number="2K+" label="Verified Experts" />
          <Stat number="50+" label="Service Categories" />
          <Stat number="4.9★" label="Average Rating" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ number, label }) => {
  return (
    <div>
      <h3
        className="
          text-4xl
          font-bold
          text-white
        "
      >
        {number}
      </h3>

      <p
        className="
          mt-3
          text-[#d3e4fe]
        "
      >
        {label}
      </p>
    </div>
  );
};

export default WhyChooseKaamSetu;