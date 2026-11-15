import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Headset,
  Heart,
  Home,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CTA.css";

const trustItems = [
  { Icon: ShieldCheck, title: "100% Verified", detail: "Professionals" },
  { Icon: Zap, title: "Quick & Easy", detail: "Booking" },
  { Icon: Headset, title: "24/7 Support", detail: "Always Here" },
  { Icon: Heart, title: "Trusted by", detail: "Thousands" },
];

const FinalCTA = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const cardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        whileHover: { y: -7 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.5, ease: "easeOut" },
      };

  return (
    <section className="ks-final-cta" aria-labelledby="ks-final-cta-title">
      <div className="ks-final-cta__wave ks-final-cta__wave--top" aria-hidden="true" />
      <div className="ks-final-cta__wave ks-final-cta__wave--bottom" aria-hidden="true" />
      <div className="ks-final-cta__dots ks-final-cta__dots--left" aria-hidden="true" />
      <div className="ks-final-cta__dots ks-final-cta__dots--right" aria-hidden="true" />

      <div className="ks-final-cta__inner">
        <motion.header
          className="ks-final-cta__header"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <span className="ks-final-cta__eyebrow">
            <span className="ks-final-cta__eyebrow-icon"><Zap size={17} fill="currentColor" /></span>
            Get Started
          </span>
          <h2 id="ks-final-cta-title">Ready to Get <span>Started?</span></h2>
          <p>Join KaamSetu today and experience a smarter way to find services<br className="ks-final-cta__desktop-break" /> or grow your business.</p>
        </motion.header>

        <div className="ks-final-cta__choices">
          <motion.article className="ks-final-cta__choice" {...cardMotion}>
            <div className="ks-final-cta__illustration ks-final-cta__illustration--home" aria-hidden="true">
              <span className="ks-final-cta__illustration-orbit" />
              <Home className="ks-final-cta__main-illustration" size={112} strokeWidth={1.55} />
              <span className="ks-final-cta__illustration-float"><Search size={38} strokeWidth={2.2} /></span>
              <span className="ks-final-cta__illustration-spark"><Sparkles size={19} /></span>
            </div>
            <div className="ks-final-cta__choice-copy">
              <h3>Find a Service</h3>
              <p>Get verified professionals for your home and business needs.</p>
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => navigate("/services")}
                className="ks-final-cta__button ks-final-cta__button--primary"
              >
                Book a Service <ArrowRight size={19} />
              </motion.button>
            </div>
          </motion.article>

          <div className="ks-final-cta__or" aria-label="Or">
            <span />
            <strong>OR</strong>
            <span />
          </div>

          <motion.article className="ks-final-cta__choice ks-final-cta__choice--vendor" {...cardMotion}>
            <div className="ks-final-cta__illustration ks-final-cta__illustration--work" aria-hidden="true">
              <span className="ks-final-cta__illustration-orbit" />
              <BriefcaseBusiness className="ks-final-cta__main-illustration" size={108} strokeWidth={1.55} />
              <span className="ks-final-cta__illustration-float"><UserRound size={34} strokeWidth={2.2} /></span>
              <span className="ks-final-cta__illustration-spark"><Sparkles size={19} /></span>
            </div>
            <div className="ks-final-cta__choice-copy">
              <h3>Offer Your Services</h3>
              <p>Showcase your skills and grow your business with new opportunities.</p>
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => navigate("/register/vendor/Profile")}
                className="ks-final-cta__button ks-final-cta__button--accent"
              >
                Find Work <ArrowRight size={19} />
              </motion.button>
            </div>
          </motion.article>
        </div>

        <div className="ks-final-cta__trust" aria-label="Why choose KaamSetu">
          {trustItems.map(({ Icon, title, detail }) => (
            <div className="ks-final-cta__trust-item" key={title}>
              <span className="ks-final-cta__trust-icon"><Icon size={27} strokeWidth={2} /></span>
              <span className="ks-final-cta__trust-copy"><strong>{title}</strong><span>{detail}</span></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
