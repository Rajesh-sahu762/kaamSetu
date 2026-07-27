import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

const formatDate = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return `${Math.floor(diffDays / 30)} month(s) ago`;
};

const ReviewsSection = ({ reviews = [], rating = 0, totalReviews = 0 }) => {
  const [showAll, setShowAll] = useState(false);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section id="reviews" className="py-16 bg-theme">
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
                  {rating ? rating.toFixed(1) : "New"}
                </span>
              </div>

              <p
                className="
                  mt-2
                  text-muted
                "
              >
                Based on {totalReviews} review{totalReviews === 1 ? "" : "s"}
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
                          width: `${
                            totalReviews
                              ? (item.count / totalReviews) * 100
                              : 0
                          }%`,
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

              {reviews.length === 0 && (
                <p className="text-muted">
                  No reviews yet — be the first to book and review.
                </p>
              )}

              <div className="space-y-5">
                {visibleReviews.map((review) => (
                  <motion.div
                    key={review._id}
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
                        {review.customerId?.fullName || "Customer"}
                      </h4>

                      <span
                        className="
                          text-sm
                          text-muted
                        "
                      >
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <div
                      className="
                        flex

                        mt-2
                        mb-3
                      "
                    >
                      {[...Array(review.rating)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          fill="currentColor"
                          className="
                            text-yellow-500
                          "
                        />
                      ))}
                    </div>

                    <p
                      className="
                        text-muted
                      "
                    >
                      {review.review}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* View All */}

              {reviews.length > 3 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
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
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;