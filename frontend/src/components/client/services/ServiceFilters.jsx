import { motion } from "framer-motion";
import {
  Filter,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import { useEffect, useState } from "react";

const EXPERIENCE_OPTIONS = [
  { label: "Experience", value: "" },
  { label: "0-1 Years", value: "0" },
  { label: "1-3 Years", value: "1" },
  { label: "3-5 Years", value: "3" },
  { label: "5+ Years", value: "5" },
];

const RATING_OPTIONS = [
  { label: "Rating", value: "" },
  { label: "4★ & Above", value: "4" },
  { label: "4.5★ & Above", value: "4.5" },
  { label: "5★ Only", value: "5" },
];

const PRICE_OPTIONS = [
  { label: "Price", value: "" },
  { label: "₹0 - ₹500", value: "0-500" },
  { label: "₹500 - ₹1000", value: "500-1000" },
  { label: "₹1000 - ₹2000", value: "1000-2000" },
  { label: "₹2000+", value: "2000-" },
];

const EMPTY_FILTERS = { category: "", city: "", minExperience: "", minRating: "", price: "" };

const ServiceFilters = ({ categories = [], filters = EMPTY_FILTERS, onApply, onClear }) => {
  // Staged locally so the grid only re-fetches when "Apply Filters" is pressed —
  // matching the original design intent of the button rather than filtering live.
  const [staged, setStaged] = useState(filters);

  useEffect(() => setStaged(filters), [filters]);

  const update = (key, value) => setStaged((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    const [minPrice, maxPrice] = staged.price ? staged.price.split("-") : ["", ""];
    onApply?.({
      category: staged.category,
      city: staged.city,
      minExperience: staged.minExperience,
      minRating: staged.minRating,
      minPrice,
      maxPrice,
    });
  };

  const handleClear = () => {
    setStaged(EMPTY_FILTERS);
    onClear?.();
  };

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
              value={staged.category}
              onChange={(value) => update("category", value)}
              options={[
                { label: "All Categories", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c.slug })),
              ]}
            />

            {/* Location */}

            <FilterInput
              icon={<MapPin size={18} />}
              placeholder="Location"
              value={staged.city}
              onChange={(value) => update("city", value)}
            />

            {/* Experience */}

            <FilterSelect
              icon={<Briefcase size={18} />}
              value={staged.minExperience}
              onChange={(value) => update("minExperience", value)}
              options={EXPERIENCE_OPTIONS}
            />

            {/* Rating */}

            <FilterSelect
              icon={<Star size={18} />}
              value={staged.minRating}
              onChange={(value) => update("minRating", value)}
              options={RATING_OPTIONS}
            />

            {/* Price */}

            <FilterSelect
              icon={<IndianRupee size={18} />}
              value={staged.price}
              onChange={(value) => update("price", value)}
              options={PRICE_OPTIONS}
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
                onClick={handleClear}
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
                onClick={handleApply}
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
  value,
  onChange,
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
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
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
  value,
  onChange,
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
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
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
            key={item.value || item.label}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceFilters;