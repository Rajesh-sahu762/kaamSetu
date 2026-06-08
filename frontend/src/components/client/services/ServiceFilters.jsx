import { motion } from "framer-motion";
import {
  Filter,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
} from "lucide-react";

const ServiceFilters = () => {
  return (
    <section className="py-8 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Filter Card */}

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
          {/* Heading */}

          <div
            className="
              flex
              items-center
              gap-3

              mb-6
            "
          >
            <Filter
              size={20}
              className="text-accent"
            />

            <h2
              className="
                text-xl
                font-semibold
                text-primary
              "
            >
              Filter Services
            </h2>
          </div>

          {/* Filters */}

          <div
            className="
              grid

              md:grid-cols-2
              lg:grid-cols-5

              gap-4
            "
          >
            {/* Category */}

            <FilterSelect
              icon={<Briefcase size={18} />}
              options={[
                "All Categories",
                "Electrician",
                "Plumber",
                "Carpenter",
                "Painter",
                "AC Repair",
              ]}
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
                "5+ Years",
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
          </div>

          {/* Bottom Actions */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              justify-between
              items-center

              mt-6

              gap-4
            "
          >
            <p className="text-muted text-sm">
              Showing available services
              based on selected filters.
            </p>

            <div className="flex gap-3">
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
                Clear Filters
              </button>

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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

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

export default ServiceFilters;