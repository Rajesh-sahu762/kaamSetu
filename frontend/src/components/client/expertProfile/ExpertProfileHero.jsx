import { motion } from "framer-motion";

import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000";

const ExpertProfileHero = ({ vendor, services, rating, totalReviews }) => {
  const primaryCategory =
    services?.[0]?.categoryId?.name || "Service Provider";

  return (
    <section className="pt-32 pb-16 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            bg-card

            border
            border-theme

            rounded-3xl

            shadow-theme

            overflow-hidden
          "
        >
          <div
            className="
              grid

              lg:grid-cols-[320px_1fr]

              gap-8

              p-6
              lg:p-8
            "
          >
            {/* Image */}

            <div>
              <img
                src={getImageUrl(vendor.userId?.profileImage, "profile") || FALLBACK_IMAGE}
                alt={vendor.businessName}
                className="
                  w-full
                  h-[320px]

                  object-cover

                  rounded-2xl
                "
              />
            </div>

            {/* Content */}

            <div
              className="
                flex
                flex-col
                justify-center
              "
            >
              {/* Category */}

              <span
                className="
                  w-fit

                  px-4
                  py-2

                  rounded-full

                  bg-[#745A38]/10

                  text-[#745A38]

                  text-sm
                  font-medium
                "
              >
                {primaryCategory}
              </span>

              {/* Name */}

              <h1
                className="
                  mt-4

                  text-4xl
                  md:text-5xl

                  font-semibold

                  text-primary
                "
              >
                {vendor.businessName}
              </h1>

              {/* Verified */}

              <div
                className="
                  mt-4

                  flex
                  items-center

                  gap-2
                "
              >
                <ShieldCheck
                  size={20}
                  className="
                    text-green-600
                  "
                />

                <span
                  className="
                    font-medium

                    text-green-600
                  "
                >
                  Verified Professional
                </span>
              </div>

              {/* Meta Info */}

              <div
                className="
                  mt-6

                  flex
                  flex-wrap

                  gap-6
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-2

                    text-muted
                  "
                >
                  <MapPin size={18} />

                  <span>
                    {vendor.city}
                    {vendor.state ? `, ${vendor.state}` : ""}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center

                    gap-2

                    text-muted
                  "
                >
                  <Briefcase size={18} />

                  <span>
                    {vendor.experience || 0} Years
                  </span>
                </div>
              </div>

              {/* Rating */}

              <div
                className="
                  mt-6

                  flex
                  flex-wrap

                  gap-6
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-2
                  "
                >
                  <Star
                    size={20}
                    fill="currentColor"
                    className="
                      text-yellow-500
                    "
                  />

                  <span
                    className="
                      text-lg
                      font-semibold

                      text-primary
                    "
                  >
                    {rating ? rating.toFixed(1) : "New"}
                  </span>

                  <span className="text-muted">
                    ({totalReviews || 0} Reviews)
                  </span>
                </div>
              </div>

              {/* CTA */}

              <div
                className="
                  mt-8

                  flex
                  flex-wrap

                  gap-4
                "
              >
                <a
                  href="#services-offered"
                  className="
                    px-8
                    py-4

                    rounded-2xl

                    bg-[#745A38]

                    text-white

                    font-medium

                    flex
                    items-center

                    gap-2

                    hover:opacity-90

                    transition
                  "
                >
                  Book Appointment

                  <ArrowRight size={18} />
                </a>

                <a
                  href="#reviews"
                  className="
                    px-8
                    py-4

                    rounded-2xl

                    border
                    border-theme

                    text-primary

                    hover:bg-surface

                    transition
                  "
                >
                  View Reviews
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ExpertProfileHero;