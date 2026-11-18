import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Star,
  Users,
  ArrowRight,
  BriefcaseBusiness,
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
    <section className="ks-services-grid-section py-20">
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
            <motion.article
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
              className="ks-service-card group"
            >
              <div className="ks-service-card__photo">
                <img
                  src={category.image || FALLBACK_IMAGE}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="ks-service-card__photo-shade" aria-hidden="true" />
                <div className="ks-service-card__wave" aria-hidden="true" />
                <span className="ks-service-card__photo-label">Popular service</span>
              </div>

              <div className="ks-service-card__icon" aria-hidden="true">
                <BriefcaseBusiness size={27} strokeWidth={2.2} />
              </div>

              <div className="ks-service-card__content">
                <div className="ks-service-card__title-row">
                  <h3>{category.name}</h3>
                  <span className="ks-service-card__rating">
                    <Star size={15} fill="currentColor" />
                    {category.rating ? category.rating.toFixed(1) : "New"}
                  </span>
                </div>

                <div className="ks-service-card__meta">
                  <span><Users size={16} /> {category.expertsCount} Professionals</span>
                  <span className="ks-service-card__price">
                    <strong>₹{category.startingPrice}</strong>
                    <small>starting</small>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate("/experts?category=" + category._id);
                  }}
                  className="ks-service-card__cta"
                >
                  Explore Professionals <ArrowRight size={18} />
                </button>
              </div>
            </motion.article>
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