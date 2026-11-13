import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Grid2X2,
  Hammer,
  House,
  PaintRoller,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "@/services/publicService";
import "./PopularServices.css";

const SERVICE_CARDS = [
  { key: "Carpentry", aliases: ["carpentry", "carpenter"], Icon: Hammer, image: "/assets/services/carpentry.webp" },
  { key: "Electrical", aliases: ["electrical", "electrician"], Icon: Zap, image: "/assets/services/electrical.webp" },
  { key: "Home Cleaning", aliases: ["home cleaning", "cleaning"], Icon: House, image: "/assets/services/home-cleaning.webp" },
  { key: "Painting", aliases: ["painting", "painter"], Icon: PaintRoller, image: "/assets/services/painting.webp" },
];

const normalize = (value = "") => value.trim().toLowerCase();

const PopularServices = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCategories();

        if (!active) return;

        if (response.success && Array.isArray(response.data)) {
          // Keep the homepage curated without changing the shared categories API.
          const selected = SERVICE_CARDS.map((item) =>
            response.data.find((category) => item.aliases.includes(normalize(category.name)))
          ).filter(Boolean);
          setCategories(selected);
        } else {
          setError(response.message || "Failed to load services.");
        }
      } catch {
        if (active) setError("Failed to load services.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCategories();
    return () => { active = false; };
  }, []);

  return (
    <section className="popular-services" aria-labelledby="popular-services-title">
      <div className="popular-services__inner">
        <header className="popular-services__header">
          <div className="popular-services__eyebrow">
            <Grid2X2 size={16} strokeWidth={3} aria-hidden="true" />
            <span>Popular Services</span>
          </div>

          <h2 id="popular-services-title" className="popular-services__title">
            Services Trusted By <span>Thousands</span>
            <i className="popular-services__spark" aria-hidden="true"><b /><b /><b /></i>
          </h2>

          <p className="popular-services__subtitle">
            Find verified professionals for every home and business need, all in one place.
          </p>
        </header>

        {error && <p className="popular-services__error" role="alert">{error}</p>}

        {loading ? (
          <div className="popular-services__grid" aria-label="Loading popular services">
            {SERVICE_CARDS.map((item) => (
              <div className="popular-services__skeleton" key={item.key} />
            ))}
          </div>
        ) : (
          <div className="popular-services__grid">
            {SERVICE_CARDS.map((item, index) => {
              const category = categories.find((entry) => item.aliases.includes(normalize(entry.name)));
              if (!category) return null;
              const Icon = item.Icon;
              const description = category.description || `${item.key} services by verified professionals.`;

              return (
                <motion.article
                  key={category._id}
                  className="popular-service-card"
                  role="link"
                  tabIndex={0}
                  aria-label={`Explore ${item.key} services`}
                  onClick={() => navigate(`/experts?category=${category._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/experts?category=${category._id}`);
                    }
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  whileHover={{ y: -7 }}
                >
                  <div className="popular-service-card__photo" aria-hidden="true">
                    <img src={item.image} alt="" loading="lazy" />
                  </div>

                  <div className="popular-service-card__icon">
                    <Icon size={34} strokeWidth={2.5} aria-hidden="true" />
                  </div>

                  <div className="popular-service-card__content">
                    <h3>{item.key}</h3>
                    <p>{description}</p>
                    <span className="popular-service-card__explore">
                      Explore <ArrowRight size={22} strokeWidth={2.8} />
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="popular-services__footer">
          <button type="button" onClick={() => navigate("/services")}>
            View All Services <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
