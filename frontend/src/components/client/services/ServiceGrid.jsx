import { motion } from "framer-motion";

import {
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const ServiceGrid = ({
  services,
  loading,
  error,
  pagination,
  filters,
  setFilters,
}) => {


  if (loading) {
  return (
    <section className="py-20 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
        Loading services...
      </div>
    </section>
  );
}
if (error) {
  return (
    <section className="py-20 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center text-red-500">
        {error}
      </div>
    </section>
  );
}

  const navigate = useNavigate();
  return (
    <section className="py-20 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            md:flex-row

            md:items-center
            md:justify-between

            gap-6
          "
        >
          <div>
            <p
              className="
                uppercase
                tracking-[0.25em]
                text-xs
                font-semibold
                text-accent
              "
            >
              Available Services
            </p>

            <h2
              className="
                mt-3

                text-4xl
                md:text-5xl

                font-semibold

                text-primary
              "
            >
              Explore Services
            </h2>
          </div>

          <p
            className="
              text-muted
              max-w-lg
            "
          >
            Browse our verified service
            categories and find trusted
            professionals near you.
          </p>
        </div>

        {/* Grid */}

        {services.length === 0 && (
  <div className="text-center py-20">
    <h3 className="text-2xl font-semibold text-primary">
      No Services Found
    </h3>

    <p className="text-muted mt-3">
      Try changing your filters.
    </p>
  </div>
)}
{services.length > 0 && (
        <div
          className="
            mt-14

            grid

            sm:grid-cols-2
            xl:grid-cols-3

            gap-8
          "
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
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
                delay: index * 0.05,
              }}
              whileHover={{
                y: -8,
              }}
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                overflow-hidden

                shadow-theme

                group

                cursor-pointer
              "
            >
              {/* Image */}

              <div
                className="
                  h-[240px]
                  overflow-hidden
                "
              >
                <img
                  src={
  service.coverImage ||
  service.images?.[0] ||
  "/images/service-placeholder.png"
}
                  alt={service.serviceName}
                  className="
                    w-full
                    h-full

                    object-cover

                    group-hover:scale-110

                    transition-all
                    duration-700
                  "
                />
              </div>

              {/* Content */}

              <div className="p-6">

                <h3
                  className="
                    text-2xl
                    font-semibold

                    text-primary
                  "
                >
                  {service.serviceName}
                </h3>

                {/* Stats */}

                <div
                  className="
                    flex
                    items-center
                    gap-5

                    mt-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Users
                      size={16}
                      className="
                        text-accent
                      "
                    />

                    <span
                      className="
                        text-muted
                        text-sm
                      "
                    >
                      {service.totalBookings}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Star
                      size={16}
                      fill="currentColor"
                      className="
                        text-yellow-500
                      "
                    />

                    <span
                      className="
                        text-muted
                        text-sm
                      "
                    >
                      {service.rating}
                    </span>
                  </div>
                </div>

                {/* Price */}

                <div
                  className="
                    mt-6

                    flex
                    items-end
                    gap-2
                  "
                >
                  <span
                    className="
                      text-3xl
                      font-bold

                      text-primary
                    "
                  >
                    ₹{service.startingPrice}
                  </span>

                  <span
                    className="
                      text-muted
                    "
                  >
                    starting
                  </span>
                </div>

                {/* CTA */}

                <button
  onClick={() =>
    navigate(`/customer/experts?service=${service._id}`)
  }
                  className="
                    mt-8

                    w-full

                    flex
                    items-center
                    justify-center
                    gap-2

                    py-4

                    rounded-2xl

                    bg-[#745A38]

                    text-white

                    font-medium

                    hover:opacity-90

                    transition
                  "
                >
                  View Experts

                  <ArrowRight
                    size={18}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
)}
        {/* Load More */}

        <div
          className="
            mt-16

            flex
            justify-center
          "
        >
          {pagination &&
pagination.page < pagination.pages && (
  <button
    onClick={() =>
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }))
    }
    className="
      px-8
      py-4
      rounded-2xl
      border
      border-theme
      text-primary
      hover:bg-card
      transition
    "
  >
    Load More Services
  </button>
)}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;