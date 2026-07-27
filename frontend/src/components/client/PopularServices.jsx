import { useEffect, useState } from "react";
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

import { getCategories } from "@/services/publicService";

// Category collection has no icon field, only a name/description/image —
// this keeps the existing curated-icon look by matching on name, and
// falls back to a generic icon for anything not in the list.
const ICON_BY_CATEGORY_NAME = {
  Electrician: Zap,
  Plumber: Wrench,
  Carpenter: Hammer,
  Painter: Paintbrush,
  "AC Repair": Wind,
  "Interior Design": Home,
  "Home Cleaning": Sparkles,
  "Appliance Repair": ShieldCheck,
};

const PopularServices = () => {

  const navigate = useNavigate()

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCategories();

        if (response.success) {
          setCategories(response.data.slice(0, 8));
        } else {
          setError(response.message || "Failed to load services.");
        }
      } catch (err) {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


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

        {/* Error */}

        {error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

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
          {categories.map((category, index) => {
            const Icon = ICON_BY_CATEGORY_NAME[category.name] || Sparkles;

            return (
              <motion.div
              onClick={() =>
  navigate(
    `/experts?category=${category._id}`
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
                  {category.description || "Verified professionals ready to help."}
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