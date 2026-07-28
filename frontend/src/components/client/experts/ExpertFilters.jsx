import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Search,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
  Tag,
} from "lucide-react";

const EXPERIENCE_OPTIONS = [
  { label: "Experience", value: "" },
  { label: "1+ Years", value: "1" },
  { label: "3+ Years", value: "3" },
  { label: "5+ Years", value: "5" },
  { label: "10+ Years", value: "10" },
];

const RATING_OPTIONS = [
  { label: "Rating", value: "" },
  { label: "4★ & Above", value: "4" },
  { label: "4.5★ & Above", value: "4.5" },
  { label: "5★ Only", value: "5" },
];

const PRICE_OPTIONS = [
  { label: "Price", minPrice: "", maxPrice: "" },
  { label: "₹0 - ₹500", minPrice: "0", maxPrice: "500" },
  { label: "₹500 - ₹1000", minPrice: "500", maxPrice: "1000" },
  { label: "₹1000 - ₹2000", minPrice: "1000", maxPrice: "2000" },
  { label: "₹2000+", minPrice: "2000", maxPrice: "" },
];

const EMPTY_DRAFT = {
  search: "",
  city: "",
  category: "",
  minExperience: "",
  minRating: "",
  minPrice: "",
  maxPrice: "",
};

const ExpertFilters = ({
  categories = [],
  filters = {},
  initialCategory = "",
  onApply,
  onReset,
}) => {
  const [draft, setDraft] = useState({
    ...EMPTY_DRAFT,
    category: initialCategory,
    ...filters,
  });

  useEffect(() => {
    setDraft((prev) => ({ ...EMPTY_DRAFT, ...prev, ...filters }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleReset = () => {
    setDraft(EMPTY_DRAFT);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.(draft);
  };

  const activeCount = Object.entries(filters).filter(([, value]) => Boolean(value)).length;

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
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <h2
                  className="
                    text-2xl
                    font-semibold
                    text-primary
                  "
                >
                  Find The Right Expert
                </h2>

                {activeCount > 0 && (
                  <span
                    className="
                      px-2.5
                      py-0.5

                      rounded-full

                      bg-[#745A38]/10

                      text-[#745A38]

                      text-xs
                      font-semibold
                    "
                  >
                    {activeCount} active
                  </span>
                )}
              </div>

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
              onClick={handleReset}
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
              value={draft.search}
              onChange={(value) => updateDraft({ search: value })}
            />

            {/* Location */}

            <FilterInput
              icon={<MapPin size={18} />}
              placeholder="Location"
              value={draft.city}
              onChange={(value) => updateDraft({ city: value })}
            />

            {/* Category */}

            <FilterSelect
              icon={<Tag size={18} />}
              value={draft.category}
              onChange={(value) => updateDraft({ category: value })}
              options={[
                { label: "Category", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c._id })),
              ]}
            />

            {/* Experience */}

            <FilterSelect
              icon={<Briefcase size={18} />}
              value={draft.minExperience}
              onChange={(value) => updateDraft({ minExperience: value })}
              options={EXPERIENCE_OPTIONS}
            />

            {/* Rating */}

            <FilterSelect
              icon={<Star size={18} />}
              value={draft.minRating}
              onChange={(value) => updateDraft({ minRating: value })}
              options={RATING_OPTIONS}
            />

            {/* Price */}

            <FilterSelect
              icon={<IndianRupee size={18} />}
              value={
                draft.minPrice || draft.maxPrice
                  ? `${draft.minPrice}-${draft.maxPrice}`
                  : ""
              }
              onChange={(value) => {
                const option = PRICE_OPTIONS.find(
                  (o) => `${o.minPrice}-${o.maxPrice}` === value,
                );
                updateDraft({
                  minPrice: option?.minPrice || "",
                  maxPrice: option?.maxPrice || "",
                });
              }}
              options={PRICE_OPTIONS.map((o) => ({
                label: o.label,
                value: `${o.minPrice}-${o.maxPrice}`,
              }))}
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
            <div />

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
        </motion.div>
      </div>
    </section>
  );
};

/* -------------------------------- */

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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
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
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpertFilters;