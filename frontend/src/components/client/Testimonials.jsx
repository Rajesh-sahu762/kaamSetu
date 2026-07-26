import { motion } from "framer-motion";
import {
  Star,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Testimonials = ({ testimonials = [], stats, loading = false }) => {
  const navigate = useNavigate()
  return (
    <section className="py-24 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-xs
              font-semibold
              text-[#745A38]
            "
          >
            Testimonials
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-5xl
              font-semibold
              text-primary
            "
          >
            Trusted By Thousands
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-muted
              leading-8
            "
          >
            Hear what customers are saying about their
            experience with KaamSetu professionals.
          </p>
        </div>

        {/* Stats */}

        <div
          className="
            mt-16
            grid
            sm:grid-cols-3
            gap-6
          "
        >
          <StatCard
            number={loading ? "…" : `${stats?.averageRating || 0}★`}
            label="Average Rating"
          />

          <StatCard
            number={loading ? "…" : `${stats?.totalReviews || 0}+`}
            label="Customer Reviews"
          />

          <StatCard
            number={loading ? "…" : `${stats?.satisfactionRate || 0}%`}
            label="Customer Satisfaction"
          />
        </div>

        {/* Reviews */}

        <div
          className="
            mt-20
            grid
            md:grid-cols-3
            gap-6
          "
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card border border-theme rounded-3xl p-8 animate-pulse">
                <div className="w-8 h-8 rounded bg-[#745A38]/10" />
                <div className="mt-5 h-4 w-24 rounded bg-[#745A38]/10" />
                <div className="mt-5 space-y-2">
                  <div className="h-4 w-full rounded bg-[#745A38]/5" />
                  <div className="h-4 w-full rounded bg-[#745A38]/5" />
                  <div className="h-4 w-2/3 rounded bg-[#745A38]/5" />
                </div>
                <div className="mt-8 h-4 w-32 rounded bg-[#745A38]/10" />
              </div>
            ))
          ) : testimonials.length === 0 ? (
            <p className="col-span-full text-center text-muted">
              Be the first to share your experience with a KaamSetu professional.
            </p>
          ) : (
          testimonials.map(
            (testimonial, index) => (
              <motion.div
                key={testimonial.id}
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
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  bg-card
                  border
                  border-theme
                  rounded-3xl
                  p-8

                  hover:shadow-[0_15px_40px_rgba(9,20,38,0.08)]
                  transition-all
                "
              >
                {/* Quote */}

                <Quote
                  size={32}
                  className="
                    text-[#745A38]
                  "
                />

                {/* Stars */}

                <div
                  className="
                    flex
                    gap-1
                    mt-5
                  "
                >
                  {[...Array(
                    testimonial.rating
                  )].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill="currentColor"
                      className="
                        text-yellow-500
                      "
                    />
                  ))}
                </div>

                {/* Review */}

                <p
                  className="
                    mt-5
                    text-muted
                    leading-8
                  "
                >
                  {testimonial.review}
                </p>

                {/* User */}

                <div className="mt-8">
                  <h4
                    className="
                      font-semibold
                      text-primary
                    "
                  >
                    {testimonial.name}
                  </h4>

                  <p
                    className="
                      text-sm
                      text-[#745A38]
                    "
                  >
                    {[testimonial.vendor, testimonial.service].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </motion.div>
            )
          )
          )}
        </div>

  <div className="text-center mt-16">
          <button
          onClick={() => navigate('/services')}
            className="
              px-8
              py-4

              rounded-xl

              bg-[#091426]
              text-white

              hover:-translate-y-1
              transition-all

              shadow-lg
            "
          >
            Explore Services
          </button>
        </div>

      </div>
    </section>
  );
};

const StatCard = ({
  number,
  label,
}) => {
  return (
    <div
      className="
        bg-[#091426]
        rounded-2xl

        py-10
        px-6

        text-center
      "
    >
      <h3
        className="
          text-4xl
          font-bold
          text-white
        "
      >
        {number}
      </h3>

      <p
        className="
          mt-3
          text-[#A88A64]
        "
      >
        {label}
      </p>
    </div>
  );
};

export default Testimonials;