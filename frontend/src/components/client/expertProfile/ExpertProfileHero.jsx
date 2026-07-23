import { motion } from 'framer-motion';

import { Star, MapPin, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

const ExpertProfileHero = ({ expert, stats, loading }) => {
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
                src={
                  expert?.image
                    ? `/uploads/${expert.image}`
                    : '/images/default-avatar.png'
                }
                alt={expert?.businessName}
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
                {loading
  ? "Loading..."
  : `${expert?.servicesAvailable || 0} Services Available`}
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
                {loading
  ? "Loading..."
  : expert?.businessName}
              </h1>
              <p
  className="
    mt-2
    text-lg
    text-muted
  "
>
  {loading
    ? ""
    : `by ${expert?.name}`}
</p>

              {/* Verified */}

              {expert?.verified && (
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

                  <span>{loading
  ? "--"
  : `${expert?.city}, ${expert?.state}`}</span>
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

                  <span>{loading
  ? "--"
  : `${expert?.experience} Years`}</span>
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
                    {loading
  ? "--"
  : stats?.averageRating}
                  </span>

                  <span className="text-muted">({loading
  ? "--"
  : stats?.totalReviews} Reviews)</span>
                </div>

                <div>
                  <span
                    className="
                      text-lg
                      font-semibold

                      text-primary
                    "
                  >
                    {loading
  ? "--"
  : stats?.completedJobs}+
                  </span>

                  <span
                    className="
                      ml-2
                      text-muted
                    "
                  >
                    Services Completed
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
