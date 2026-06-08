import { motion } from "framer-motion";

import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const ExpertCard = ({ expert }) => {

  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/expert/${expert.id}`);
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        bg-card

        border
        border-theme

        rounded-3xl

        overflow-hidden

        shadow-theme

        group
      "
    >
      {/* Image */}

      <div className="relative h-[260px] overflow-hidden">

        <img
          src={expert.image}
          alt={expert.name}
          className="
            w-full
            h-full

            object-cover

            group-hover:scale-105

            transition-all
            duration-700
          "
        />

        {/* Verified Badge */}

        {expert.verified && (
          <div
            className="
              absolute
              top-4
              right-4

              flex
              items-center
              gap-2

              px-3
              py-2

              rounded-full

              bg-white/90
              backdrop-blur

              text-xs
              font-medium
            "
          >
            <ShieldCheck
              size={14}
              className="
                text-green-600
              "
            />

            Verified
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-6">

        {/* Category */}

        <span
          className="
            inline-block

            px-3
            py-1

            rounded-full

            text-xs
            font-medium

            bg-[#745A38]/10

            text-[#745A38]
          "
        >
          {expert.category}
        </span>

        {/* Name */}

        <h3
          className="
            mt-4

            text-2xl

            font-semibold

            text-primary
          "
        >
          {expert.name}
        </h3>

        {/* Location */}

        <div
          className="
            mt-4

            flex
            items-center

            gap-2

            text-muted
          "
        >
          <MapPin size={16} />

          <span>
            {expert.location}
          </span>
        </div>

        {/* Experience */}

        <div
          className="
            mt-3

            flex
            items-center

            gap-2

            text-muted
          "
        >
          <Briefcase size={16} />

          <span>
            {expert.experience} Experience
          </span>
        </div>

        {/* Rating */}

        <div
          className="
            mt-4

            flex
            items-center

            gap-2
          "
        >
          <Star
            size={18}
            fill="currentColor"
            className="
              text-yellow-500
            "
          />

          <span
            className="
              font-semibold
              text-primary
            "
          >
            {expert.rating}
          </span>

          <span
            className="
              text-muted
            "
          >
            ({expert.reviews} Reviews)
          </span>
        </div>

        {/* Price */}

        <div
          className="
            mt-6

            flex
            items-end

            gap-2
          "
        >
          <span
            className="
              text-3xl
              font-bold

              text-primary
            "
          >
            ₹{expert.visitCharge}
          </span>

          <span
            className="
              text-muted
            "
          >
            visit charge
          </span>
        </div>

        {/* CTA */}

        <button
          onClick={handleViewProfile}
          className="
            mt-8

            w-full

            flex
            items-center
            justify-center

            gap-2

            py-4

            rounded-2xl

            bg-[#745A38]

            text-white

            font-medium

            hover:opacity-90

            transition
          "
        >
          View Profile

          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default ExpertCard;