import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Star,
  Users,
  ArrowRight,
} from "lucide-react";

import { getCategories } from "@/services/publicService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800";

const ServiceGrid = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCategories();

        if (response.success) {
          setCategories(response.data);
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

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMore = visibleCount < categories.length;

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

        {/* Error */}

        {error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {/* Empty State */}

        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-muted mt-10">
            No service categories available yet.
          </p>
        )}

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
          {visibleCategories.map((category, index) => (
            <motion.div
              key={category._id}
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
              onClick={() => navigate(`/experts?category=${category._id}`)}
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
                  src={category.image || FALLBACK_IMAGE}
                  alt={category.name}
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
                  {category.name}
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
                      {category.expertsCount}
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
                      {category.rating ? category.rating.toFixed(1) : "New"}
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
                    ₹{category.startingPrice}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/experts?category=${category._id}`);
                  }}
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

        {hasMore && (
          <div
            className="
              mt-16

              flex
              justify-center
            "
          >
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
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
        )}
      </div>
    </section>
  );
};

export default ServiceGrid;