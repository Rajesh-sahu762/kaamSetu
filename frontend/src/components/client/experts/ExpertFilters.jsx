import { motion } from "framer-motion";

import {
  Search,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

const ExpertFilters = () => {
  return (
    <section className="py-8 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            bg-card
            border
            border-theme

            rounded-3xl

            shadow-theme

            p-6
          "
        >
          {/* Header */}

          <div
            className="
              flex
              flex-col
              md:flex-row

              md:items-center
              md:justify-between

              gap-4
              mb-6
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-primary
                "
              >
                Find The Right Expert
              </h2>

              <p
                className="
                  mt-1
                  text-muted
                "
              >
                Filter professionals based on
                experience, ratings and pricing.
              </p>
            </div>

            <button
              className="
                px-5
                py-3

                rounded-xl

                border
                border-theme

                text-primary

                hover:bg-surface

                transition
              "
            >
              Reset Filters
            </button>
          </div>

          {/* Filters */}

          <div
            className="
              grid

              md:grid-cols-2
              xl:grid-cols-6

              gap-4
            "
          >
            {/* Search */}

            <FilterInput
              icon={<Search size={18} />}
              placeholder="Search expert"
            />

            {/* Location */}

            <FilterInput
              icon={<MapPin size={18} />}
              placeholder="Location"
            />

            {/* Experience */}

            <FilterSelect
              icon={<Briefcase size={18} />}
              options={[
                "Experience",
                "0-1 Years",
                "1-3 Years",
                "3-5 Years",
                "5-10 Years",
                "10+ Years",
              ]}
            />

            {/* Rating */}

            <FilterSelect
              icon={<Star size={18} />}
              options={[
                "Rating",
                "4★ & Above",
                "4.5★ & Above",
                "5★ Only",
              ]}
            />

            {/* Price */}

            <FilterSelect
              icon={<IndianRupee size={18} />}
              options={[
                "Price",
                "₹0 - ₹500",
                "₹500 - ₹1000",
                "₹1000 - ₹2000",
                "₹2000+",
              ]}
            />

            {/* Verification */}

            <FilterSelect
              icon={<ShieldCheck size={18} />}
              options={[
                "Verification",
                "Verified Only",
                "All Experts",
              ]}
            />
          </div>

          {/* Bottom */}

          <div
            className="
              mt-6

              flex
              flex-col
              md:flex-row

              md:items-center
              md:justify-between

              gap-4
            "
          >
            <p
              className="
                text-muted
                text-sm
              "
            >
              Showing 120 verified experts
              in your area.
            </p>

            <button
              className="
                px-6
                py-3

                rounded-xl

                bg-[#745A38]

                text-white

                font-medium

                hover:opacity-90

                transition
              "
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* -------------------------------- */

const FilterInput = ({
  icon,
  placeholder,
}) => {
  return (
    <div
      className="
        flex
        items-center

        gap-3

        h-[52px]

        px-4

        border
        border-theme

        rounded-xl

        bg-surface
      "
    >
      <span className="text-muted">
        {icon}
      </span>

      <input
        type="text"
        placeholder={placeholder}
        className="
          flex-1

          bg-transparent

          outline-none

          text-primary
        "
      />
    </div>
  );
};

/* -------------------------------- */

const FilterSelect = ({
  icon,
  options,
}) => {
  return (
    <div
      className="
        flex
        items-center

        gap-3

        h-[52px]

        px-4

        border
        border-theme

        rounded-xl

        bg-surface
      "
    >
      <span className="text-muted">
        {icon}
      </span>

      <select
        className="
          flex-1

          bg-transparent

          outline-none

          text-primary

          cursor-pointer
        "
      >
        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpertFilters;