import { motion } from "framer-motion";
import {
  Star,
  Quote,
} from "lucide-react";

const testimonials = [
  {
    name: "Amit Sharma",
    city: "Jaipur",
    rating: 5,
    review:
      "Booked an electrician through KaamSetu and the experience was excellent. The professional arrived on time and completed the work perfectly.",
  },
  {
    name: "Priya Verma",
    city: "Udaipur",
    rating: 5,
    review:
      "The platform made it easy to find a trusted plumber. Transparent pricing and professional service.",
  },
  {
    name: "Rohit Mehta",
    city: "Bhilwara",
    rating: 5,
    review:
      "Very smooth booking experience. I found a carpenter within minutes and the quality of work exceeded expectations.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
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
              text-[#091426]
            "
          >
            Trusted By Thousands
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-[#45474c]
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
            number="4.9★"
            label="Average Rating"
          />

          <StatCard
            number="12K+"
            label="Customer Reviews"
          />

          <StatCard
            number="98%"
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
          {testimonials.map(
            (testimonial, index) => (
              <motion.div
                key={testimonial.name}
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
                  bg-[#f8f9ff]
                  border
                  border-[#d3e4fe]
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
                    text-[#45474c]
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
                      text-[#091426]
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
                    {testimonial.city}
                  </p>
                </div>
              </motion.div>
            )
          )}
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
          text-[#d3e4fe]
        "
      >
        {label}
      </p>
    </div>
  );
};

export default Testimonials;