import { motion } from "framer-motion";

import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const ExpertProfileHero = () => {
  const expert = {
    id: 1,
    name: "Rajesh Electric Works",
    category: "Electrician",
    location: "Bhilwara, Rajasthan",
    experience: "8 Years",
    rating: 4.9,
    reviews: 245,
    completedJobs: 1200,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000",
  };

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
                src={expert.image}
                alt={expert.name}
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
                {expert.category}
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
                {expert.name}
              </h1>

              {/* Verified */}

              {expert.verified && (
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
              )}

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
                    {expert.location}
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
                    {expert.experience}
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
                    {expert.rating}
                  </span>

                  <span className="text-muted">
                    ({expert.reviews} Reviews)
                  </span>
                </div>

                <div>
                  <span
                    className="
                      text-lg
                      font-semibold

                      text-primary
                    "
                  >
                    {expert.completedJobs}+
                  </span>

                  <span
                    className="
                      ml-2
                      text-muted
                    "
                  >
                    Jobs Completed
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
                <button
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
                </button>

                <button
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
                  Contact Expert
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ExpertProfileHero;