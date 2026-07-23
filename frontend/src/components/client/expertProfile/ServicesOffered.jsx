import { motion } from "framer-motion";
import {
  CheckCircle2,
} from "lucide-react";

const ServicesOffered = ({
  services = [],
  loading,
}) => {

  

  return (
    <section className="py-16 bg-theme">
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
                className="
                  flex
                  items-center

                  gap-3

                  p-4

                  rounded-2xl

                  border
                  border-theme

                  bg-surface

                  hover:shadow-md

                  transition
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
              </motion.div>
            ))}
          </div>

          {/* Summary */}

          <div
            className="
              mt-8

              p-4

              rounded-2xl

              bg-[#745A38]/10

              border
              border-[#745A38]/20
            "
          >
            <p
              className="
                text-sm

                text-primary
              "
            >
              {loading
  ? "Loading..."
  : services.length > 0
  ? services[0].description
  : "No services available."}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesOffered;