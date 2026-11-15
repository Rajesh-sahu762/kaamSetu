import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Headset,
  Heart,
  House,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CTA.css";

const FinalCTA = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.55, ease: "easeOut" },
      };

  return (
    <section className="ks-final-cta" aria-labelledby="ks-final-cta-title">
      <div className="ks-final-cta__wave ks-final-cta__wave--top" aria-hidden="true" />
      <div className="ks-final-cta__wave ks-final-cta__wave--bottom" aria-hidden="true" />
      <div className="ks-final-cta__dots ks-final-cta__dots--left" aria-hidden="true" />
      <div className="ks-final-cta__dots ks-final-cta__dots--right" aria-hidden="true" />

      <div className="ks-final-cta__inner">
        <motion.header className="ks-final-cta__header" {...entrance}>
          <span className="ks-final-cta__eyebrow">
            <span className="ks-final-cta__eyebrow-icon"><Zap size={17} fill="currentColor" /></span>
            Get Started
          </span>
          <h2 id="ks-final-cta-title">
            Ready to Get <span>Started?</span>
            <i aria-hidden="true" />
          </h2>
          <p>Join KaamSetu today and experience a smarter way to find services<br className="ks-final-cta__desktop-break" /> or grow your business.</p>
        </motion.header>

        <div className="ks-final-cta__choices">
          <motion.article
            className="ks-final-cta__choice"
            {...entrance}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            <div className="ks-final-cta__illustration ks-final-cta__illustration--home" aria-hidden="true">
              <span className="ks-final-cta__illustration-orbit" />
              <span className="ks-final-cta__illustration-platform" />
              <House className="ks-final-cta__main-illustration" strokeWidth={1.7} />
              <span className="ks-final-cta__search-bubble"><Search size={42} strokeWidth={2.4} /></span>
              <span className="ks-final-cta__spark ks-final-cta__spark--one" />
              <span className="ks-final-cta__spark ks-final-cta__spark--two" />
            </div>
            <div className="ks-final-cta__choice-copy">
              <h3>Find a Service</h3>
              <p>Get verified professionals for your home and business needs.</p>
              <motion.button
                type="button"
                className="ks-final-cta__button ks-final-cta__button--primary"
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => navigate("/services")}
              >
                Book a Service <ArrowRight size={19} />
              </motion.button>
            </div>
          </motion.article>

          <div className="ks-final-cta__or" aria-hidden="true">
            <span />
            <b>OR</b>
            <span />
          </div>

          <motion.article
            className="ks-final-cta__choice"
            {...entrance}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
          >
            <div className="ks-final-cta__illustration ks-final-cta__illustration--work" aria-hidden="true">
              <span className="ks-final-cta__illustration-orbit" />
              <span className="ks-final-cta__illustration-platform" />
              <BriefcaseBusiness className="ks-final-cta__main-illustration" strokeWidth={1.7} />
              <span className="ks-final-cta__user-bubble"><UserRound size={34} fill="currentColor" /></span>
              <span className="ks-final-cta__spark ks-final-cta__spark--one" />
              <span className="ks-final-cta__spark ks-final-cta__spark--two" />
            </div>
            <div className="ks-final-cta__choice-copy">
              <h3>Offer Your Services</h3>
              <p>Showcase your skills and grow your business.</p>
              <motion.button
                type="button"
                className="ks-final-cta__button ks-final-cta__button--bright"
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => navigate("/register/vendor/Profile")}
              >
                Find Work <ArrowRight size={19} />
              </motion.button>
            </div>
          </motion.article>
        </div>

        <motion.div className="ks-final-cta__trust" {...entrance} transition={{ duration: 0.5, delay: 0.22 }}>
          <div className="ks-final-cta__trust-item">
            <span><ShieldCheck size={31} strokeWidth={2.1} /></span>
            <p><strong>100% Verified</strong><small>Professionals</small></p>
          </div>
          <i aria-hidden="true" />
          <div className="ks-final-cta__trust-item">
            <span><Zap size={31} strokeWidth={2.1} /></span>
            <p><strong>Quick &amp; Easy</strong><small>Booking</small></p>
          </div>
          <i aria-hidden="true" />
          <div className="ks-final-cta__trust-item">
            <span><Headset size={31} strokeWidth={2.1} /></span>
            <p><strong>24/7 Support</strong><small>Always Here</small></p>
          </div>
          <i aria-hidden="true" />
          <div className="ks-final-cta__trust-item">
            <span><Heart size={31} strokeWidth={2.1} /></span>
            <p><strong>Trusted by</strong><small>Thousands</small></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
