import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();
  const isNew = expert.rating === "New";
  const handleViewProfile = () => navigate(`/expert/${expert.id}`);

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="ks-expert-card">
      <div className="ks-expert-card__photo">
        <img src={expert.image} alt={expert.name} className="ks-expert-card__image" />
        <span className="ks-expert-card__popular"><ShieldCheck size={14} />POPULAR SERVICE</span>
        <div className="ks-expert-card__wave" aria-hidden="true" />
      </div>
      <div className="ks-expert-card__icon" aria-hidden="true"><Briefcase size={32} strokeWidth={2.2} /></div>
      <div className="ks-expert-card__content">
        <div className="ks-expert-card__heading">
          <h3 className="ks-expert-card__name">{expert.name}</h3>
          {isNew ? (
            <span className="ks-expert-card__new">★ <span>New</span></span>
          ) : (
            <span className="ks-expert-card__new ks-expert-card__rating"><Star size={15} fill="currentColor" /> <span>{expert.rating}</span></span>
          )}
        </div>
        <div className="ks-expert-card__details">
          <div className="ks-expert-card__location"><MapPin size={18} /><span>{expert.location || "Location not specified"}</span></div>
          <div className="ks-expert-card__price"><strong>₹{expert.visitCharge}</strong><span>starting</span></div>
        </div>
        <div className="ks-expert-card__experience"><Briefcase size={15} /><span>{expert.experience} experience</span></div>
        <button type="button" onClick={handleViewProfile} className="ks-expert-card__cta">Explore Professionals<ArrowRight size={20} /></button>
      </div>
    </motion.article>
  );
};

export default ExpertCard;
