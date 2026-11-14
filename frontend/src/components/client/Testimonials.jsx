import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  MapPin,
  Quote,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { getPublicTestimonials } from "@/services/publicService";
import { getImageUrl } from "@/utils/imageUrl";
import "./Testimonials.css";

const formatCount = (value) => Number(value || 0).toLocaleString("en-IN");

const CountUp = ({ value = 0, suffix = "", decimals = 0, reduceMotion = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const [display, setDisplay] = useState(reduceMotion ? Number(value) || 0 : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setDisplay(Number(value) || 0);
      return undefined;
    }
    const controls = animate(0, Number(value) || 0, {
      duration: 1.15,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref}>
      {decimals ? display.toFixed(decimals) : formatCount(Math.round(display))}
      {suffix}
    </span>
  );
};

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "K";

const CustomerAvatar = ({ testimonial }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getImageUrl(testimonial.profileImage, "profile");

  return (
    <div className="ks-testimonial__avatar">
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(testimonial.name)}</span>
      )}
    </div>
  );
};

const StatCard = ({ Icon, value, label, suffix = "", decimals = 0, reduceMotion }) => (
  <motion.div
    className="ks-testimonials__stat"
    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.45 }}
  >
    <span className="ks-testimonials__stat-icon"><Icon size={20} strokeWidth={2.1} aria-hidden="true" /></span>
    <div className="ks-testimonials__stat-copy">
      <strong>
        <CountUp value={value} suffix={suffix} decimals={decimals} reduceMotion={reduceMotion} />
      </strong>
      <span>{label}</span>
    </div>
  </motion.div>
);

const TestimonialCard = ({ testimonial, active, index, reduceMotion }) => (
  <motion.article
    className={`ks-testimonial-card ${active ? "is-active" : "is-side"}`}
    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : index * 0.035 }}
    aria-current={active ? "true" : undefined}
  >
    <div className="ks-testimonial-card__topline">
      <span className="ks-testimonial-card__quote"><Quote size={22} fill="currentColor" aria-hidden="true" /></span>
      {testimonial.verified && (
        <span className="ks-testimonial-card__verified">
          <BadgeCheck size={15} fill="currentColor" aria-hidden="true" /> Verified booking
        </span>
      )}
    </div>

    <div className="ks-testimonial-card__stars" aria-label={`${testimonial.rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, starIndex) => (
        <Star
          key={starIndex}
          size={17}
          fill={starIndex < testimonial.rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>

    <p className="ks-testimonial-card__review">“{testimonial.review}”</p>

    <div className="ks-testimonial-card__footer">
      <CustomerAvatar testimonial={testimonial} />
      <div className="ks-testimonial-card__identity">
        <strong>{testimonial.name || "KaamSetu customer"}</strong>
        <span>
          {testimonial.service || testimonial.category || "KaamSetu service"}
        </span>
        {testimonial.serviceArea && (
          <span className="ks-testimonial-card__location">
            <MapPin size={13} aria-hidden="true" /> Service area: {testimonial.serviceArea}
          </span>
        )}
      </div>
      {testimonial.category && <span className="ks-testimonial-card__category">{testimonial.category}</span>}
    </div>
  </motion.article>
);

const Testimonials = () => {
  const reduceMotion = useReducedMotion();
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    let active = true;

    const loadTestimonials = async () => {
      setLoading(true);
      setError("");
      const response = await getPublicTestimonials({ limit: 12 });
      if (!active) return;

      if (response?.success && response.data) {
        setTestimonials(Array.isArray(response.data.testimonials) ? response.data.testimonials : []);
        setStats(response.data.stats || null);
      } else {
        setError(response?.message || "We couldn't load customer reviews right now.");
      }
      setLoading(false);
    };

    loadTestimonials().catch(() => {
      if (active) {
        setError("We couldn't load customer reviews right now.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setActiveIndex((current) => testimonials.length ? current % testimonials.length : 0);
  }, [testimonials.length]);

  const move = useCallback((direction) => {
    setActiveIndex((current) => {
      if (testimonials.length < 2) return 0;
      return (current + direction + testimonials.length) % testimonials.length;
    });
  }, [testimonials.length]);

  const visibleCards = useMemo(() => {
    if (testimonials.length === 1) {
      return [{ testimonial: testimonials[0], index: 0, active: true }];
    }
    if (testimonials.length === 2) {
      return [0, 1].map((offset) => {
        const index = (activeIndex + offset) % testimonials.length;
        return { testimonial: testimonials[index], index, active: offset === 0 };
      });
    }
    return [-1, 0, 1].map((offset, slot) => {
      const index = (activeIndex + offset + testimonials.length) % testimonials.length;
      return { testimonial: testimonials[index], index, active: offset === 0, slot };
    });
  }, [testimonials, activeIndex]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches?.[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches?.[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section className="ks-testimonials" aria-labelledby="ks-testimonials-title">
      <div className="ks-testimonials__ambient ks-testimonials__ambient--one" aria-hidden="true" />
      <div className="ks-testimonials__ambient ks-testimonials__ambient--two" aria-hidden="true" />
      <div className="ks-testimonials__inner">
        <motion.header
          className="ks-testimonials__header"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <span className="ks-testimonials__eyebrow"><Star size={14} fill="currentColor" aria-hidden="true" /> Testimonials</span>
          <h2 id="ks-testimonials-title">Trusted By <span>Thousands</span></h2>
          <p>Hear what customers are saying about their experience with KaamSetu professionals.</p>
        </motion.header>

        <div className="ks-testimonials__stats" aria-label="Customer review statistics">
          <StatCard Icon={Star} value={stats?.averageRating || 0} decimals={1} label="Average customer rating" reduceMotion={reduceMotion} />
          <StatCard Icon={Users} value={stats?.happyCustomers || 0} label="Happy customers" reduceMotion={reduceMotion} />
          <StatCard Icon={TrendingUp} value={stats?.satisfactionRate || 0} suffix="%" label="Customer satisfaction" reduceMotion={reduceMotion} />
        </div>

        <div
          className="ks-testimonials__carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {loading ? (
            <div className="ks-testimonials__cards ks-testimonials__cards--loading">
              {Array.from({ length: 3 }, (_, index) => <div className="ks-testimonial-skeleton" key={index} />)}
            </div>
          ) : error ? (
            <p className="ks-testimonials__state ks-testimonials__state--error" role="alert">{error}</p>
          ) : testimonials.length === 0 ? (
            <div className="ks-testimonials__state">
              <span className="ks-testimonials__empty-icon"><Quote size={23} aria-hidden="true" /></span>
              <strong>Every great experience starts with a review.</strong>
              <p>Customer stories will appear here after verified bookings are reviewed.</p>
            </div>
          ) : (
            <>
              <div className={`ks-testimonials__cards ${testimonials.length === 1 ? "has-one" : ""} ${testimonials.length === 2 ? "has-two" : ""}`}>
                {visibleCards.map(({ testimonial, index, active }, slot) => (
                  <TestimonialCard
                    key={testimonial.id || testimonial._id || index}
                    testimonial={testimonial}
                    active={active}
                    index={slot}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>

              {testimonials.length > 1 && (
                <div className="ks-testimonials__controls">
                  <button type="button" onClick={() => move(-1)} aria-label="Previous testimonials">
                    <ArrowLeft size={19} aria-hidden="true" />
                  </button>
                  <div className="ks-testimonials__dots" aria-label="Choose testimonial">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.id || item._id || index}
                        type="button"
                        className={index === activeIndex ? "is-active" : ""}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show testimonial ${index + 1}`}
                        aria-current={index === activeIndex ? "true" : undefined}
                      />
                    ))}
                  </div>
                  <button type="button" onClick={() => move(1)} aria-label="Next testimonials">
                    <ArrowRight size={19} aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="ks-testimonials__community">
          <span className="ks-testimonials__community-label">Trusted by our community</span>
          <div className="ks-testimonials__community-items">
            <span><BadgeCheck size={16} aria-hidden="true" /> Verified bookings</span>
            <i aria-hidden="true" />
            <span><Star size={16} aria-hidden="true" /> Real customer reviews</span>
            <i aria-hidden="true" />
            <span><Users size={16} aria-hidden="true" /> Local professionals</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
