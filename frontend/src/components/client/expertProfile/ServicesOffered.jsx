import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesOffered = ({ services = [] }) => {
  const navigate = useNavigate();

  return (
    <section id="services-offered" className="py-16 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            bg-card

            border
            border-theme

            rounded-3xl

            shadow-theme

            p-8
          "
        >
          {/* Header */}

          <div className="mb-8">
            <h2
              className="
                text-3xl
                font-semibold

                text-primary
              "
            >
              Services Offered
            </h2>

            <p
              className="
                mt-2

                text-muted
              "
            >
              Services currently provided by
              this professional.
            </p>
          </div>

          {/* Empty State */}

          {services.length === 0 && (
            <p className="text-muted">
              This professional hasn't listed any services yet.
            </p>
          )}

          {/* Services Grid */}

          <div
            className="
              grid

              sm:grid-cols-2
              lg:grid-cols-3

              gap-4
            "
          >
            {services.map((service) => (
              <motion.div
                key={service._id}
                whileHover={{
                  y: -3,
                }}
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      serviceId: service._id,
                      vendorId: service.vendorId,
                    },
                  })
                }
                className="
                  flex
                  items-center
                  justify-between

                  gap-3

                  p-4

                  rounded-2xl

                  border
                  border-theme

                  bg-surface

                  hover:shadow-md

                  cursor-pointer

                  transition
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-3
                  "
                >
                  <CheckCircle2
                    size={18}
                    className="
                      text-green-600
                      shrink-0
                    "
                  />

                  <span
                    className="
                      text-primary
                      font-medium
                    "
                  >
                    {service.serviceName}
                  </span>
                </div>

                <span
                  className="
                    text-sm
                    font-semibold

                    text-[#745A38]

                    shrink-0
                  "
                >
                  ₹{service.startingPrice}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesOffered;