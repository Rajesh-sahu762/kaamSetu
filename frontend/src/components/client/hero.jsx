import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Hammer,
  Paintbrush,
  Search,
  ShieldCheck,
  Sofa,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import successImage from "../../assets/images/success-artisan.png";
import "./hero.css";

const CountUp = ({ value = 0, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, Number(value) || 0, {
      duration: 1.25,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString("en-IN")}{suffix}</span>;
};

const HeroSection = ({ stats, categories = [], loading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `/services?search=${encodeURIComponent(trimmed)}` : "/services");
  };

  const statItems = [
    { label: "Verified Experts", value: stats?.verifiedExperts || 0, suffix: "+", Icon: Users },
    { label: "Jobs Completed", value: stats?.jobsCompleted || 0, suffix: "+", Icon: BriefcaseBusiness },
    { label: "Satisfaction Rate", value: stats?.satisfactionRate || 0, suffix: "%", Icon: Star },
  ];

  return (
    <section className="ks-hero">
      <div className="ks-hero__ambient ks-hero__ambient--top" aria-hidden="true" />
      <div className="ks-hero__ambient ks-hero__ambient--side" aria-hidden="true" />
      <div className="ks-hero__wave ks-hero__wave--left" aria-hidden="true" />
      <div className="ks-hero__wave ks-hero__wave--bottom" aria-hidden="true" />
      <div className="ks-hero__particles" aria-hidden="true" />

      <div className="ks-hero__container">
        <div className="ks-hero__copy">
          <motion.div
            className="ks-hero__content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ks-hero__trust-badge">
              <ShieldCheck size={17} fill="currentColor" strokeWidth={2.2} />
              <span>Verified Experts</span>
              <i />
              <span>Trusted Service</span>
              <i />
              <span>At Your Doorstep</span>
            </div>

            <h1 className="ks-hero__title">
              Elevate Your Space
              <br />
              With <span>Trusted</span>
              <br />
              <span className="ks-hero__craftsmanship">Craftsmanship</span>
              <svg className="ks-hero__underline" viewBox="0 0 430 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M5 14 C105 3 260 4 414 12" />
                <path d="M394 5 L416 12 L397 18" />
              </svg>
            </h1>

            <p className="ks-hero__description">
              Connect with verified artisans, home service experts, and skilled professionals committed to delivering exceptional quality and reliability.
            </p>

            <form className="ks-hero__search" onSubmit={handleSearch}>
              <Search size={21} strokeWidth={1.9} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search 'electrician', 'AC repair'..."
                aria-label="Search services"
              />
              <button type="submit">Search</button>
            </form>

            {categories.length > 0 && (
              <div className="ks-hero__categories" aria-label="Popular service categories">
                {categories.slice(0, 5).map((category) => (
                  <button
                    type="button"
                    key={category._id}
                    onClick={() => navigate(`/services?category=${category.slug}`)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            <div className="ks-hero__cta-row">
              <button type="button" className="ks-hero__cta ks-hero__cta--primary" onClick={() => navigate("/services")}>
                Explore Services <ArrowRight size={18} />
              </button>
              <button type="button" className="ks-hero__cta ks-hero__cta--secondary" onClick={() => navigate("/register/vendor/Profile")}>
                Become a Professional <ArrowRight size={18} />
              </button>
            </div>

            <div className="ks-hero__stats">
              {statItems.map(({ label, value, suffix, Icon }, index) => (
                <div className="ks-hero__stat" key={label}>
                  <Icon className="ks-hero__stat-icon" size={39} strokeWidth={1.65} />
                  <div>
                    <strong>{loading ? "…" : <CountUp value={value} suffix={suffix} />}</strong>
                    <span>{label}</span>
                  </div>
                  {index < statItems.length - 1 && <i className="ks-hero__stat-divider" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="ks-hero__visual"
          initial={{ opacity: 0, x: 42, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ks-hero__visual-glow" aria-hidden="true" />
          <div className="ks-hero__orbit" aria-hidden="true">
            <span /><span /><span /><span />
          </div>

          <div className="ks-hero__scene ks-hero__scene--room" aria-hidden="true">
            <div className="ks-hero__scene-window" />
            <Sofa size={38} strokeWidth={1.2} />
            <span>Comfortable spaces</span>
          </div>
          <div className="ks-hero__scene ks-hero__scene--workshop" aria-hidden="true">
            <div className="ks-hero__tool-rack"><Hammer /><Wrench /><Paintbrush /></div>
            <span>Skilled hands. Better homes.</span>
          </div>

          <motion.div
            className="ks-hero__artisan-card"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="ks-hero__artisan-image">
              <img src={successImage} alt="Professional home service artisan" />
              <div className="ks-hero__artisan-image-shade" />
            </div>
            <div className="ks-hero__artisan-info">
              <span className="ks-hero__verified"><i /> VERIFIED</span>
              <h2>Master Carpenter</h2>
              <p>12+ Years Experience</p>
            </div>
          </motion.div>

          <motion.div className="ks-hero__service-chip ks-hero__service-chip--carpentry" animate={{ y: [0, -9, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}>
            <Hammer size={21} /><span>Carpentry</span>
          </motion.div>
          <motion.div className="ks-hero__service-chip ks-hero__service-chip--painting" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut" }}>
            <Paintbrush size={21} /><span>Painting</span>
          </motion.div>
          <motion.div className="ks-hero__service-chip ks-hero__service-chip--plumbing" animate={{ y: [0, -7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>
            <Wrench size={21} /><span>Plumbing</span>
          </motion.div>

          <div className="ks-hero__visual-dots" aria-hidden="true"><i /><i /><i /></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
