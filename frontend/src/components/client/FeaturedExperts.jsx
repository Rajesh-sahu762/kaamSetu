import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  BriefcaseBusiness,
  Hammer,
  Headphones,
  House,
  MapPin,
  PaintRoller,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getFeaturedExperts } from "@/services/publicService";
import { getImageUrl } from "@/utils/imageUrl";
import "./FeaturedExperts.css";

const FEATURED_LIMIT = 4;
const NEW_PROFILE_DAYS = 30;

const getCategoryIcon = (category = "") => {
  const value = category.toLowerCase();

  if (/clean|housekeep/.test(value)) return Sparkles;
  if (/electric/.test(value)) return Zap;
  if (/paint/.test(value)) return PaintRoller;
  if (/carpent|wood/.test(value)) return Hammer;
  if (/plumb|repair|maint/.test(value)) return Wrench;
  if (/home|interior/.test(value)) return House;
  if (/support/.test(value)) return Headphones;

  return BriefcaseBusiness;
};

const isNewProfessional = (createdAt) => {
  if (!createdAt) return false;

  const createdTime = new Date(createdAt).getTime();
  if (!Number.isFinite(createdTime)) return false;

  const age = Date.now() - createdTime;
  return age >= 0 && age <= NEW_PROFILE_DAYS * 24 * 60 * 60 * 1000;
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "K";

const ExpertPhoto = ({ expert }) => {
  // Prefer the professional's own photo. If they have not uploaded one,
  // use their real service cover/portfolio image returned by the same API.
  const imageSources = [
    getImageUrl(expert.userId?.profileImage, "profile"),
    getImageUrl(expert.coverImage, "services"),
    ...(Array.isArray(expert.images)
      ? expert.images.map((image) => getImageUrl(image, "services"))
      : []),
  ].filter((url, index, sources) => url && sources.indexOf(url) === index);
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = imageSources[imageIndex];

  return (
    <div className="featured-expert-card__photo">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={expert.businessName || "Professional"}
          loading="lazy"
          decoding="async"
          onError={() => setImageIndex((current) => current + 1)}
        />
      ) : (
        <div className="featured-expert-card__photo-fallback" aria-label="Professional photo unavailable">
          <span>{getInitials(expert.businessName)}</span>
        </div>
      )}

      <div className="featured-expert-card__photo-shade" aria-hidden="true" />
      <div className="featured-expert-card__wave" aria-hidden="true" />
    </div>
  );
};

const FeaturedExperts = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchExperts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFeaturedExperts({ limit: FEATURED_LIMIT });

        if (!active) return;

        if (response.success && Array.isArray(response.data)) {
          setExperts(response.data.slice(0, FEATURED_LIMIT));
        } else {
          setError(response.message || "Failed to load featured professionals.");
        }
      } catch {
        if (active) setError("Failed to load featured professionals.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchExperts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="featured-experts" aria-labelledby="featured-experts-title">
      <div className="featured-experts__inner">
        <header className="featured-experts__header">
          <div className="featured-experts__eyebrow">
            <span className="featured-experts__eyebrow-icon">
              <BriefcaseBusiness size={17} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span>Top Professionals</span>
          </div>

          <h2 id="featured-experts-title" className="featured-experts__title">
            Meet Our <span>Top Professionals</span>
            <i className="featured-experts__spark" aria-hidden="true"><b /><b /><b /></i>
          </h2>

          <p className="featured-experts__subtitle">
            Experienced and verified professionals trusted by thousands of customers across India.
          </p>
        </header>

        {error && (
          <p className="featured-experts__message featured-experts__message--error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="featured-experts__grid" aria-label="Loading professionals">
            {Array.from({ length: FEATURED_LIMIT }).map((_, index) => (
              <div className="featured-expert-skeleton" key={index} />
            ))}
          </div>
        ) : experts.length > 0 ? (
          <div className="featured-experts__grid">
            {experts.map((expert, index) => {
              const CategoryIcon = getCategoryIcon(expert.category);
              const verified = expert.status === "approved";

              return (
                <motion.article
                  key={expert._id}
                  className="featured-expert-card"
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.42, delay: index * 0.06 }}
                >
                  <ExpertPhoto expert={expert} />

                  {isNewProfessional(expert.createdAt) && (
                    <span className="featured-expert-card__new">
                      <Sparkles size={14} fill="currentColor" aria-hidden="true" />
                      New
                    </span>
                  )}

                  <div className="featured-expert-card__category-icon">
                    <CategoryIcon size={28} strokeWidth={2.3} aria-hidden="true" />
                  </div>

                  <div className="featured-expert-card__content">
                    <div className="featured-expert-card__name-row">
                      <h3>{expert.businessName}</h3>
                      {verified && (
                        <BadgeCheck
                          className="featured-expert-card__verified"
                          size={21}
                          fill="currentColor"
                          aria-label="Verified professional"
                        />
                      )}
                    </div>

                    <span className="featured-expert-card__category">
                      {expert.category || "Professional Services"}
                    </span>

                    <div className="featured-expert-card__meta">
                      <span title={expert.city || "Location not provided"}>
                        <MapPin size={17} aria-hidden="true" />
                        <span>{expert.city || "Location not provided"}</span>
                      </span>
                      <span>
                        <Briefcase size={17} aria-hidden="true" />
                        <span>{Number(expert.experience) || 0} Years</span>
                      </span>
                      <span>
                        <BriefcaseBusiness size={17} aria-hidden="true" />
                        <span>{Number(expert.jobsCount) || 0}+ Jobs</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="featured-expert-card__profile"
                      onClick={() => navigate(`/expert/${expert._id}`)}
                      aria-label={`View ${expert.businessName} profile`}
                    >
                      View Profile <ArrowRight size={19} strokeWidth={2.6} aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <p className="featured-experts__message">No featured professionals available right now.</p>
        )}

        <div className="featured-experts__footer">
          <button type="button" onClick={() => navigate("/experts")}>
            Explore All Experts
            <ArrowRight size={21} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;
