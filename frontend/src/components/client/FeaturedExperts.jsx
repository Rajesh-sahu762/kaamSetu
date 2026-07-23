import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Briefcase,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const FeaturedExperts = ({
  experts = [],
  loading,
}) => {

  const navigate =useNavigate();

  return (
    <section className="py-24 bg-card">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-xs
              font-semibold
              text-[#745A38]
            "
          >
            Featured Experts
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-5xl
              font-semibold
              text-primary
            "
          >
            Meet Our Top Professionals
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-muted
              leading-8
            "
          >
            Experienced and verified professionals trusted by
            thousands of customers across India.
          </p>
        </div>

        {/* Cards */}

        <div
          className="
            mt-20
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {experts.map((expert, index) => (
            <motion.div
            onClick={() => navigate(`/expert/${expert._id}`)}
              key={expert.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
              }}
              className="
                bg-card
                border
                border-theme
                rounded-3xl
                overflow-hidden
                group

                hover:shadow-[0_15px_40px_rgba(9,20,38,0.08)]
                transition-all
              "
            >
              {/* Image */}

              <div className="relative">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="
                    h-[280px]
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    top-4
                    right-4

                    flex
                    items-center
                    gap-1

                    bg-card
                    px-3
                    py-1.5

                    rounded-full

                    text-sm
                    font-semibold
                  "
                >
                  <Star
                    size={15}
                    className="text-yellow-500"
                  />
                  {expert.rating}
                </div>
              </div>

              {/* Content */}

              <div className="p-6">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-primary
                    "
                  >
                    {expert.name}
                  </h3>

                  <BadgeCheck
                    size={18}
                    className="
                      text-[#745A38]
                    "
                  />
                </div>

                <p
                  className="
                    mt-2
                    text-[#745A38]
                    font-medium
                  "
                >
                  {expert.category}
                </p>

                <div
                  className="
                    mt-5
                    space-y-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      text-muted
                    "
                  >
                    <MapPin size={16} />
                    {expert.city}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      text-muted
                    "
                  >
                    <Briefcase size={16} />
                    {expert.experience}
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-muted
                    "
                  >
                    {expert.jobs}
                  </span>

                  <button
                    className="
                      text-[#745A38]
                      font-medium
                    "
                  >
                    View →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}

        <div className="text-center mt-16">
          <button
          onClick={() => navigate('/experts')}
            className="
              px-8
              py-4

              rounded-xl

              bg-[#091426]
              text-white

              hover:-translate-y-1
              transition-all

              shadow-lg
            "
          >
            Explore All Experts
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperts;