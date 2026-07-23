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
import { useNavigate } from "react-router-dom";

// Icon fallback per category name — only used when a category has no image of its own.
const ICON_BY_NAME = {
  electrician: Zap,
  plumber: Wrench,
  plumbing: Wrench,
  carpenter: Hammer,
  carpentry: Hammer,
  painter: Paintbrush,
  painting: Paintbrush,
  "ac repair": Wind,
  "appliance repair": ShieldCheck,
  "interior design": Home,
  cleaning: Sparkles,
  "home cleaning": Sparkles,
};

const getIconFor = (name = "") => ICON_BY_NAME[name.trim().toLowerCase()] || Sparkles;

const PopularServices = ({
    categories = [],
    loading
}) => {

  const navigate = useNavigate()

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

        {!loading && categories.length === 0 && (
          <p className="mt-10 text-center text-muted">
            No service categories are available right now. Please check back soon.
          </p>
        )}

        <div
          className="
            mt-16
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="
                  bg-card border border-theme rounded-2xl p-7
                  animate-pulse
                "
              >
                <div className="w-14 h-14 rounded-xl bg-[#745A38]/10" />
                <div className="mt-6 h-5 w-2/3 rounded bg-[#745A38]/10" />
                <div className="mt-3 h-4 w-full rounded bg-[#745A38]/5" />
                <div className="mt-3 h-4 w-4/5 rounded bg-[#745A38]/5" />
              </div>
            ))
          ) : (
            categories.map((category, index) => {
            const Icon = getIconFor(category.name);

            return (
              <motion.div
              onClick={() =>
  navigate(
    `/services?category=${category.slug}`
  )
}
                key={category._id}
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

             {category.image ? (
               <div
                 className="
                   w-14 h-14
                   rounded-xl
                   overflow-hidden
                   bg-[#745A38]/10
                 "
               >
                 <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
               </div>
             ) : (
             <div
  className="
    w-14
    h-14

    rounded-xl

    bg-[#745A38]/10

    flex
    items-center
    justify-center

    transition-all
    duration-300

    group-hover:bg-[#745A38]
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
             )}

                {/* Content */}

                <h3
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    text-primary
                  "
                >
                  {category.name}
                </h3>

                <p
                  className="
                    mt-3
                    text-muted
                    leading-7
                    text-sm
                  "
                >
                  {category.description || `Verified ${category.name.toLowerCase()} professionals near you.`}
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
            })
          )}
        </div>

        {/* Bottom CTA */}

        <div className="text-center mt-16">
          <button
           onClick={() => navigate('/services') }
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