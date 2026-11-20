import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Grid3X3,
  HeadphonesIcon,
  ShieldCheck,
} from "lucide-react";

import "./WhyChooseUs.css";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description:
      "Every expert goes through document and identity verification before joining the platform.",
    image: "/assets/why-choose/why-verified.webp",
    imageAlt: "Professionals shaking hands after a verification check",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured Service",
    description:
      "Work with trusted professionals who are rated and reviewed by real customers.",
    image: "/assets/why-choose/why-quality.webp",
    imageAlt: "Five-star customer quality rating",
  },
  {
    icon: Clock3,
    title: "Quick Booking",
    description:
      "Book services within minutes and connect with professionals near you instantly.",
    image: "/assets/why-choose/why-booking.webp",
    imageAlt: "Calendar showing a confirmed booking",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "Our support team is always available to help before, during, and after your booking.",
    image: "/assets/why-choose/why-support.webp",
    imageAlt: "Customer support headset",
  },
];

const WhyChooseKaamSetu = ({ stats, loading }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="why-choose" aria-labelledby="why-choose-title">
      <div className="why-choose__inner">
        <header className="why-choose__header">
          <div className="why-choose__eyebrow">
            <Grid3X3 size={17} strokeWidth={3} aria-hidden="true" />
            <span>Why Choose Us</span>
          </div>

          <h2 id="why-choose-title" className="why-choose__title">
            Why Choose <span>KaamSetu</span>
            <i className="why-choose__spark" aria-hidden="true"><b /><b /><b /></i>
          </h2>

          <p className="why-choose__subtitle">
            We connect customers with trusted professionals while ensuring quality, transparency
            and peace of mind.
          </p>
        </header>

        <div className="why-choose__grid">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className="why-choose-card"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                whileHover={reduceMotion ? undefined : { y: -5 }}
              >
                <div className="why-choose-card__photo" aria-hidden="true">
                  <img src={item.image} alt="" loading="eager" decoding="async" />
                </div>

                <div className="why-choose-card__icon">
                  <Icon size={32} strokeWidth={2.1} aria-hidden="true" />
                </div>

                <div className="why-choose-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="why-choose-card__learn">
                    Learn More <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="why-choose__stats" aria-label="KaamSetu platform statistics">
          <Stat
            number={loading ? "--" : `${stats?.happyCustomers || 0}+`}
            label="Happy Customers"
          />
          <Stat
            number={loading ? "--" : `${stats?.verifiedExperts || 0}+`}
            label="Verified Experts"
          />
          <Stat
            number={loading ? "--" : `${stats?.serviceCategories || 0}+`}
            label="Service Categories"
          />
          <Stat
            number={loading ? "--" : `${stats?.averageRating || 0}★`}
            label="Average Rating"
          />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ number, label }) => (
  <div className="why-choose__stat">
    <h3>{number}</h3>
    <p>{label}</p>
  </div>
);

export default WhyChooseKaamSetu;
