import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const ReviewsSection = () => {

  const navigate = useNavigate();

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      comment:
        "Very professional and completed the work on time.",
      date: "2 days ago",
    },

    {
      id: 2,
      name: "Priya Jain",
      rating: 5,
      comment:
        "Excellent service. Highly recommended.",
      date: "1 week ago",
    },

    {
      id: 3,
      name: "Amit Gupta",
      rating: 4,
      comment:
        "Good work quality and reasonable pricing.",
      date: "2 weeks ago",
    },
  ];

  const ratingBreakdown = [
    { star: 5, count: 196 },
    { star: 4, count: 32 },
    { star: 3, count: 9 },
    { star: 2, count: 4 },
    { star: 1, count: 4 },
  ];

  return (
    <section className="py-16 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        <div
          className="
            bg-card

            border
            border-theme

            rounded-3xl

            shadow-theme

            p-8
          "
        >
          {/* Header */}

          <div
            className="
              flex
              flex-col
              lg:flex-row

              gap-10
            "
          >
            {/* Rating Summary */}

            <div className="lg:w-[320px]">

              <h2
                className="
                  text-3xl
                  font-semibold
                  text-primary
                "
              >
                Reviews
              </h2>

              <div
                className="
                  mt-6

                  flex
                  items-center

                  gap-3
                "
              >
                <Star
                  size={30}
                  fill="currentColor"
                  className="
                    text-yellow-500
                  "
                />

                <span
                  className="
                    text-5xl
                    font-bold
                    text-primary
                  "
                >
                  4.9
                </span>
              </div>

              <p
                className="
                  mt-2
                  text-muted
                "
              >
                Based on 245 reviews
              </p>

              {/* Breakdown */}

              <div className="mt-8 space-y-3">
                {ratingBreakdown.map((item) => (
                  <div
                    key={item.star}
                    className="
                      flex
                      items-center

                      gap-3
                    "
                  >
                    <span
                      className="
                        text-sm
                        w-8
                      "
                    >
                      {item.star}★
                    </span>

                    <div
                      className="
                        flex-1

                        h-2

                        rounded-full

                        bg-gray-200
                        overflow-hidden
                      "
                    >
                      <div
                        style={{
                          width: `${(item.count / 245) * 100}%`,
                        }}
                        className="
                          h-full

                          bg-[#745A38]
                        "
                      />
                    </div>

                    <span
                      className="
                        text-sm
                        text-muted
                      "
                    >
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Reviews */}

            <div className="flex-1">

              <h3
                className="
                  text-xl
                  font-semibold

                  text-primary

                  mb-6
                "
              >
                Recent Reviews
              </h3>

              <div className="space-y-5">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    whileHover={{
                      y: -2,
                    }}
                    className="
                      p-5

                      rounded-2xl

                      border
                      border-theme

                      bg-surface
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <h4
                        className="
                          font-semibold
                          text-primary
                        "
                      >
                        {review.name}
                      </h4>

                      <span
                        className="
                          text-sm
                          text-muted
                        "
                      >
                        {review.date}
                      </span>
                    </div>

                    <div
                      className="
                        flex

                        mt-2
                        mb-3
                      "
                    >
                      {[...Array(review.rating)].map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={16}
                            fill="currentColor"
                            className="
                              text-yellow-500
                            "
                          />
                        )
                      )}
                    </div>

                    <p
                      className="
                        text-muted
                      "
                    >
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* View All */}

              <button
                onClick={() =>
                  navigate(
                    "/review/:bookingId"
                  )
                }
                className="
                  mt-8

                  flex
                  items-center

                  gap-2

                  text-[#745A38]

                  font-medium

                  hover:gap-3

                  transition-all
                "
              >
                View All Reviews

                <ArrowRight size={18} />
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;