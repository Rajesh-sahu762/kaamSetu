import { motion } from 'framer-motion';
import { Filter, MapPin, Star, Briefcase, IndianRupee } from 'lucide-react';

const ServiceFilters = ({ filters, setFilters, categories }) => {
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
            <Filter size={20} className="text-accent" />

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
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                  page: 1,
                }))
              }
              options={[
                {
                  label: 'All Categories',
                  value: '',
                },

                ...categories.map((category) => ({
                  label: category.name,
                  value: category._id,
                })),
              ]}
            />

            {/* Location */}

            <FilterInput
  icon={<Filter size={18} />}
  placeholder="Search services..."
  value={filters.search}
  onChange={(e) =>
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }))
  }
/>

            {/* Experience */}

            <FilterSelect
              icon={<Briefcase size={18} />}
              options={[
                'Experience',
                '0-1 Years',
                '1-3 Years',
                '3-5 Years',
                '5+ Years',
              ]}
            />

            {/* Rating */}

            <FilterSelect
              icon={<Star size={18} />}
              options={['Rating', '4★ & Above', '4.5★ & Above', '5★ Only']}
            />

            {/* Price */}

            <FilterSelect
  icon={<Filter size={18} />}
  value={filters.sort}
  onChange={(e) =>
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }))
  }
  options={[
    {
      label: "Newest",
      value: "newest",
    },
    {
      label: "Popular",
      value: "popular",
    },
    {
      label: "Highest Rating",
      value: "rating",
    },
    {
      label: "Price Low → High",
      value: "price-low",
    },
    {
      label: "Price High → Low",
      value: "price-high",
    },
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
              Showing available services based on selected filters.
            </p>

            <div className="flex gap-3">
             <button
  onClick={() =>
    setFilters({
      search: "",
      category: "",
      sort: "newest",
      page: 1,
      limit: 12,
    })
  }
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

const FilterInput = ({ icon, placeholder, value, onChange }) => {
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
      <span className="text-muted">{icon}</span>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

const FilterSelect = ({ icon, options, value, onChange }) => {
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
      <span className="text-muted">{icon}</span>

      <select
        className="
          flex-1

          bg-transparent

          outline-none

          text-primary
          cursor-pointer
        "
        value={value}
        onChange={onChange}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceFilters;
