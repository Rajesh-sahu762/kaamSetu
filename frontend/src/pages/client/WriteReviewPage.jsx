import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Star,
  Upload,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const WriteReviewPage = () => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);

  const [hover, setHover] = useState(0);

  const [submitted, setSubmitted] =
    useState(false);

  const [selectedTags, setSelectedTags] =
    useState([]);

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

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter(
          (item) => item !== tag
        )
      );
    } else {
      setSelectedTags([
        ...selectedTags,
        tag,
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) return;

    setSubmitted(true);
  };

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
              navigate("/my-bookings")
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
            Tell us about your service
            experience.
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

          {/* Title */}

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
              Review Title
            </label>

            <input
              type="text"
              placeholder="Summarize your experience"
              className="
                w-full

                border-0
                border-b

                border-theme

                bg-transparent

                py-4

                focus:outline-none
              "
            />
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

          {/* Upload */}

          <div>
            <label
              className="
                block

                mb-4

                text-sm

                uppercase

                tracking-wider

                font-semibold
              "
            >
              Add Photos
            </label>

            <label
              className="
                flex

                items-center
                justify-center

                gap-3

                py-8

                border-2
                border-dashed

                border-theme

                rounded-3xl

                cursor-pointer

                hover:bg-surface

                transition
              "
            >
              <Upload size={22} />

              Upload Images

              <input
                type="file"
                multiple
                className="hidden"
              />
            </label>
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
              className="
                w-full

                py-5

                rounded-2xl

                bg-[#091426]

                text-white

                text-lg

                font-medium
              "
            >
              Submit Review
            </motion.button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default WriteReviewPage;