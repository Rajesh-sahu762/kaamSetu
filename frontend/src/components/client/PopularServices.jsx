import { motion } from "framer-motion";
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Wind,
  Home,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Electrician",
    desc: "Certified electrical repairs and installations.",
  },
  {
    icon: Wrench,
    title: "Plumber",
    desc: "Professional plumbing and maintenance services.",
  },
  {
    icon: Hammer,
    title: "Carpenter",
    desc: "Custom furniture and woodwork solutions.",
  },
  {
    icon: Paintbrush,
    title: "Painter",
    desc: "Interior and exterior painting experts.",
  },
  {
    icon: Wind,
    title: "AC Repair",
    desc: "Fast cooling system repair and servicing.",
  },
  {
    icon: Home,
    title: "Interior Design",
    desc: "Transform your home with modern designs.",
  },
  {
    icon: Sparkles,
    title: "Home Cleaning",
    desc: "Deep cleaning by trained professionals.",
  },
  {
    icon: ShieldCheck,
    title: "Appliance Repair",
    desc: "Repair services for all major appliances.",
  },
];

const PopularServices = () => {
  return (
    <section className="py-22 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        {/* Header */}

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
            Popular Services
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-5xl
              font-semibold
              text-primary
            "
          >
            Services Trusted By Thousands
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-muted
              leading-8
            "
          >
            Find verified professionals for every home and
            business need, all in one place.
          </p>
        </div>

        {/* Services Grid */}

        <div
          className="
            mt-16
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
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
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  group
                  bg-card
                  border
                  border-theme
                  rounded-2xl
                  p-7
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:shadow-[0_15px_40px_rgba(9,20,38,0.08)]
                "
              >
                {/* Icon */}

                <div
                  className="
                    w-14
                    h-14
                    rounded-xl
                    bg-card
                    border
                    border-theme

                    flex
                    items-center
                    justify-center

                    group-hover:bg-[#091426]
                    transition-all
                  "
                >
                  <Icon
                    size={24}
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
                    text-primary
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-muted
                    leading-7
                    text-sm
                  "
                >
                  {service.desc}
                </p>

                {/* Link */}

                <div
                  className="
                    mt-6
                    text-[#745A38]
                    font-medium
                    flex
                    items-center
                    gap-2
                  "
                >
                  Explore
                  <span
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="text-center mt-16">
          <button
            className="
              px-8
              py-4
              rounded-xl

              bg-[#091426]
              text-white

              hover:-translate-y-1
              transition-all
              duration-300

              shadow-lg
            "
          >
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;