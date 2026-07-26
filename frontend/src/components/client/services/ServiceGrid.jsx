import { motion } from "framer-motion";

import {
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceGrid = ({ services = [], loading = false, pagination, onLoadMore, loadingMore = false }) => {
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

        <div
          className="
            mt-14

            grid

            sm:grid-cols-2
            xl:grid-cols-3

            gap-8
          "
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card border border-theme rounded-3xl overflow-hidden shadow-theme animate-pulse">
                <div className="h-[240px] bg-[#745A38]/10" />
                <div className="p-6">
                  <div className="h-6 w-2/3 rounded bg-[#745A38]/10" />
                  <div className="mt-4 h-4 w-1/2 rounded bg-[#745A38]/5" />
                  <div className="mt-6 h-8 w-1/3 rounded bg-[#745A38]/10" />
                  <div className="mt-8 h-12 w-full rounded-2xl bg-[#745A38]/10" />
                </div>
              </div>
            ))
          ) : services.length === 0 ? (
            <p className="col-span-full text-center text-muted py-10">
              No services matched your filters. Try adjusting your search.
            </p>
          ) : (
          services.map((service, index) => (
            <motion.div
              key={service.id}
              onClick={() => navigate(`/expert/${service.vendorId}`)}
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
                delay: (index % 6) * 0.05,
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
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="
                      w-full
                      h-full

                      object-cover

                      group-hover:scale-110

                      transition-all
                      duration-700
                    "
                  />
                ) : (
                  <div
                    className="
                      w-full h-full
                      flex items-center justify-center
                      bg-gradient-to-br from-[#745A38] to-[#A88A64]
                      text-white text-4xl font-bold
                    "
                  >
                    {service.name?.trim()?.charAt(0)?.toUpperCase() || "K"}
                  </div>
                )}
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
                  {service.name}
                </h3>

                <p className="mt-1 text-sm text-muted">{service.vendorName}</p>

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
                      {service.totalBookings || 0} booked
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
                      {service.rating || "New"}
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
                    ₹{service.price}
                  </span>

                  <span
                    className="
                      text-muted
                    "
                  >
                    {service.priceType === "variable" ? "starting" : "fixed"}
                  </span>
                </div>

                {/* CTA */}

                <button
                  type="button"
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
          ))
          )}
        </div>

        {/* Load More */}

        {!loading && pagination && pagination.page < pagination.pages && (
          <div
            className="
              mt-16

              flex
              justify-center
            "
          >
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="
                px-8
                py-4

                rounded-2xl

                border
                border-theme

                text-primary

                hover:bg-card

                transition

                disabled:opacity-60
              "
            >
              {loadingMore ? "Loading…" : "Load More Services"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceGrid;