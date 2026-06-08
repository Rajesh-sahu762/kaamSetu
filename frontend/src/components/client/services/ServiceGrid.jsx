import { motion } from "framer-motion";

import {
  Star,
  Users,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "Electrician",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    experts: 120,
    rating: 4.9,
    price: 299,
  },

  {
    id: 2,
    name: "Plumber",
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800",
    experts: 95,
    rating: 4.8,
    price: 349,
  },

  {
    id: 3,
    name: "Carpenter",
    image:
      "https://images.unsplash.com/photo-1513467655676-561b7d489a88?w=800",
    experts: 80,
    rating: 4.7,
    price: 399,
  },

  {
    id: 4,
    name: "Painter",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
    experts: 65,
    rating: 4.8,
    price: 499,
  },

  {
    id: 5,
    name: "AC Repair",
    image:
      "https://images.unsplash.com/photo-1581092919535-7146ff1a5907?w=800",
    experts: 110,
    rating: 4.9,
    price: 599,
  },

  {
    id: 6,
    name: "Home Cleaning",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    experts: 140,
    rating: 4.8,
    price: 699,
  },
];

const ServiceGrid = () => {
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
                      {service.experts}
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
                    ₹{service.price}
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

        {/* Load More */}

        <div
          className="
            mt-16

            flex
            justify-center
          "
        >
          <button
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
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;