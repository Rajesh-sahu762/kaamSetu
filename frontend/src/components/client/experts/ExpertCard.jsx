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
      className="ks-expert-card group"
    >
      {/* Image */}

      <div className="ks-expert-card__photo">

        <img
          src={expert.image}
          alt={expert.name}
          className="ks-expert-card__image"
        />

        {/* Verified Badge */}

        {expert.verified && (
          <div
            className="ks-expert-card__verified"
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

      <div className="ks-expert-card__content">

        {/* Category */}

        <span
          className="ks-expert-card__category"
        >
          {expert.category}
        </span>

        {/* Name */}

        <h3
          className="ks-expert-card__name"
        >
          {expert.name}
        </h3>

        {/* Location */}

        <div
          className="ks-expert-card__meta ks-expert-card__location"
        >
          <MapPin size={16} />

          <span>
            {expert.location}
          </span>
        </div>

        {/* Experience */}

        <div
          className="ks-expert-card__meta ks-expert-card__experience"
        >
          <Briefcase size={16} />

          <span>
            {expert.experience} Experience
          </span>
        </div>

        {/* Rating */}

        <div
          className="ks-expert-card__rating"
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
          className="ks-expert-card__price"
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
          className="ks-expert-card__cta"
        >
          View Profile

          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default ExpertCard;