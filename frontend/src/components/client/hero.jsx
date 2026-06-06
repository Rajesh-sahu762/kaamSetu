import { motion, useScroll, useTransform } from "framer-motion";
import { Wrench, Hammer, Paintbrush, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, -120]);
  const y2 = useTransform(scrollY, [0, 500], [0, -70]);

  return (
    <section className="relative overflow-hidden bg-[#f8f9ff] min-h-screen flex items-center">
      
      {/* Background Blobs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#d3e4fe] blur-3xl opacity-50"
      />

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-150px] left-[-150px] w-[380px] h-[380px] rounded-full bg-[#e5eeff] blur-3xl opacity-60"
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#745a38] mb-6">
              Verified Professionals
            </p>

            <h1
              className="
                text-[42px]
                md:text-[58px]
                leading-[1.1]
                font-semibold
                text-[#091426]
                tracking-[-0.03em]
              "
            >
              Elevate Your Space With
              <span className="block text-[#745a38]">
                Trusted Craftsmanship
              </span>
            </h1>

            <p
              className="
                mt-8
                text-[18px]
                leading-8
                text-[#45474c]
                max-w-xl
              "
            >
              Connect with verified artisans, home service experts,
              and skilled professionals committed to delivering
              exceptional quality and reliability.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              
              <button
                className="
                  bg-[#091426]
                  text-white
                  px-8
                  py-4
                  rounded-md
                  font-medium
                  hover:-translate-y-1
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >
                Explore Services
              </button>

              <button
                className="
                  border
                  border-[#c5c6cd]
                  px-8
                  py-4
                  rounded-md
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-white
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                Become a Professional
                <ArrowRight size={18} />
              </button>

            </div>

            {/* Trust Indicators */}
            <div className="mt-14 flex flex-wrap gap-10">
              
              <div>
                <h3 className="text-3xl font-semibold text-[#091426]">
                  10K+
                </h3>
                <p className="text-[#45474c] mt-1">
                  Verified Experts
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-[#091426]">
                  50K+
                </h3>
                <p className="text-[#45474c] mt-1">
                  Jobs Completed
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-[#091426]">
                  98%
                </h3>
                <p className="text-[#45474c] mt-1">
                  Satisfaction Rate
                </p>
              </div>

            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[650px]">

              {/* Main Card */}
              <div
                className="
                  absolute
                  top-20
                  left-16
                  w-[360px]
                  h-[420px]
                  bg-white
                  border
                  border-[#d3e4fe]
                  rounded-xl
                  shadow-[0_12px_40px_rgba(9,20,38,0.08)]
                  overflow-hidden
                "
              >
                <img
                  src="/images/artisan.jpg"
                  alt="artisan"
                  className="w-full h-[260px] object-cover"
                />

                <div className="p-6">
                  <span
                    className="
                      bg-[#ffddb4]
                      text-[#5a4222]
                      text-xs
                      px-3
                      py-1
                      rounded-full
                    "
                  >
                    VERIFIED
                  </span>

                  <h3 className="mt-4 text-xl font-semibold text-[#091426]">
                    Master Carpenter
                  </h3>

                  <p className="text-[#45474c] mt-2">
                    12+ Years Experience
                  </p>
                </div>
              </div>

              {/* Floating Service Cards */}

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                }}
                className="
                  absolute
                  top-8
                  right-0
                  bg-white
                  border
                  border-[#d3e4fe]
                  rounded-lg
                  px-5
                  py-4
                  flex
                  items-center
                  gap-3
                  shadow-lg
                "
              >
                <Hammer size={20} />
                <span>Carpentry</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="
                  absolute
                  bottom-24
                  right-10
                  bg-white
                  border
                  border-[#d3e4fe]
                  rounded-lg
                  px-5
                  py-4
                  flex
                  items-center
                  gap-3
                  shadow-lg
                "
              >
                <Wrench size={20} />
                <span>Plumbing</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  bg-white
                  border
                  border-[#d3e4fe]
                  rounded-lg
                  px-5
                  py-4
                  flex
                  items-center
                  gap-3
                  shadow-lg
                "
              >
                <Paintbrush size={20} />
                <span>Painting</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;