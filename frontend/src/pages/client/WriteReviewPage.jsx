import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  Star,
  CheckCircle2,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { getMyBookingById } from "@/services/customerService";
import { createReview } from "@/services/customerService";

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tags = [
    "Professional",
    "On Time",
    "Affordable",
    "Friendly",
    "Skilled",
    "Clean Work",
    "Quick Service",
    "Good Behaviour",
  ];

  const ratingLabels = {
    1: "Very Poor",
    2: "Poor",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const ratingEmoji = {
    1: "😞",
    2: "🙁",
    3: "🙂",
    4: "😊",
    5: "😍",
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await getMyBookingById(bookingId);

        if (response.success) {
          setBooking(response.data);
        } else {
          setLoadError(response.message || "Booking not found.");
        }
      } catch (err) {
        setLoadError("Failed to load this booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (booking?.status !== "completed") {
      toast.error("You can only review a completed booking.");
      return;
    }

    const composedReview = [
      selectedTags.length > 0 ? selectedTags.join(", ") + "." : "",
      reviewText.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    try {
      setSubmitting(true);

      const response = await createReview({
        bookingId,
        rating,
        review: composedReview,
      });

      if (response.success) {
        setSubmitted(true);
      } else {
        toast.error(response.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-muted">
          Loading booking details...
        </div>
      </section>
    );
  }

  if (loadError || !booking) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-red-500">
          {loadError || "Booking not found."}
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section
        className="
          min-h-screen

          bg-theme

          flex
          items-center
          justify-center

          px-6
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="
            text-center

            max-w-xl
          "
        >
          <div
            className="
              w-28
              h-28

              mx-auto

              rounded-full

              bg-green-100

              flex
              items-center
              justify-center
            "
          >
            <CheckCircle2
              size={60}
              className="
                text-green-600
              "
            />
          </div>

          <h1
            className="
              mt-8

              text-5xl

              font-semibold

              text-primary
            "
          >
            Thank You ❤️
          </h1>

          <p
            className="
              mt-4

              text-lg

              text-muted
            "
          >
            Your review has been submitted
            successfully and will help
            other customers choose the
            right professional.
          </p>

          <button
            onClick={() =>
              navigate("/my-booking")
            }
            className="
              mt-10

              px-8
              py-4

              rounded-2xl

              bg-[#745A38]

              text-white

              font-medium

              hover:scale-105

              transition
            "
          >
            Back To My Bookings
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      className="
        min-h-screen

        bg-theme

        pt-32
        pb-20
      "
    >
      <div
        className="
          max-w-3xl
          mx-auto

          px-6
        "
      >
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            text-center

            mb-14
          "
        >
          <h1
            className="
              text-5xl

              font-semibold

              text-primary
            "
          >
            Rate Your Experience
          </h1>

          <p
            className="
              mt-4

              text-lg

              text-muted
            "
          >
            {booking.vendorId?.businessName} — {booking.serviceId?.serviceName}
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Rating */}

          <div className="text-center">

            <AnimatePresence mode="wait">
              <motion.div
                key={rating}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  text-7xl

                  mb-6
                "
              >
                {rating
                  ? ratingEmoji[rating]
                  : "🙂"}
              </motion.div>
            </AnimatePresence>

            <div
              className="
                flex
                justify-center

                gap-3
              "
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{
                      scale: 1.15,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onMouseEnter={() =>
                      setHover(star)
                    }
                    onMouseLeave={() =>
                      setHover(0)
                    }
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    <Star
                      size={42}
                      fill={
                        star <=
                        (hover || rating)
                          ? "#facc15"
                          : "transparent"
                      }
                      className="
                        text-yellow-400
                      "
                    />
                  </motion.button>
                )
              )}
            </div>

            <h2
              className="
                mt-6

                text-2xl

                font-semibold

                text-primary
              "
            >
              {rating
                ? ratingLabels[rating]
                : "Select Rating"}
            </h2>

          </div>

          {/* Description */}

          <div>
            <label
              className="
                block

                mb-3

                text-sm

                uppercase

                tracking-wider

                font-semibold
              "
            >
              Tell Others More
            </label>

            <textarea
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share details about the service..."
              className="
                w-full

                border

                border-theme

                rounded-3xl

                p-5

                bg-transparent

                resize-none

                focus:outline-none
              "
            />
          </div>

          {/* Tags */}

          <div>
            <label
              className="
                block

                mb-5

                text-sm

                uppercase

                tracking-wider

                font-semibold
              "
            >
              What Did You Like?
            </label>

            <div
              className="
                flex

                flex-wrap

                gap-3
              "
            >
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  type="button"
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    toggleTag(tag)
                  }
                  className={`
                    px-5
                    py-3

                    rounded-full

                    transition

                    ${
                      selectedTags.includes(
                        tag
                      )
                        ? "bg-[#745A38] text-white"
                        : "border border-theme text-primary"
                    }
                  `}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit */}

          <div className="pt-4">
            <motion.button
              whileHover={{
                y: -2,
              }}
              type="submit"
              disabled={submitting}
              className="
                w-full

                py-5

                rounded-2xl

                bg-[#091426]

                text-white

                text-lg

                font-medium

                disabled:opacity-60
              "
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default WriteReviewPage;
