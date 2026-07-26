import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { Wrench, Hammer, Paintbrush, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` once the number scrolls into view — a small
// premium touch that also makes the (now real) stats feel alive.
const CountUp = ({ value = 0, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const HeroSection = ({ stats, categories = [], loading = false }) => {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const y1 = useTransform(scrollY, [0, 500], [0, -120]);
  const y2 = useTransform(scrollY, [0, 500], [0, -70]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `/services?search=${encodeURIComponent(trimmed)}` : "/services");
  };

  return (
    <section className="relative overflow-hidden mt-15 bg-card min-h-screen flex items-center">
      
      {/* Background Blobs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#A88A64]/20 blur-3xl opacity-60"
      />

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-150px] left-[-150px] w-[380px] h-[380px] rounded-full bg-[#745A38]/10 blur-3xl opacity-70"
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
                text-primary
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
                text-muted
                max-w-xl
              "
            >
              Connect with verified artisans, home service experts,
              and skilled professionals committed to delivering
              exceptional quality and reliability.
            </p>

            <form
              onSubmit={handleSearch}
              className="
                mt-8
                flex
                items-center
                gap-2
                bg-card
                border border-theme
                rounded-full
                p-2
                pl-5
                max-w-lg
                shadow-[0_8px_24px_rgba(9,20,38,0.06)]
                focus-within:border-[#745A38]/50
                transition
              "
            >
              <Search size={18} className="text-muted shrink-0" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="text"
                placeholder="Search 'electrician', 'AC repair'…"
                className="flex-1 bg-transparent outline-none text-sm text-primary placeholder:text-muted"
              />
              <button
                type="submit"
                className="
                  bg-[#745A38] text-white text-sm font-medium
                  px-5 py-2.5 rounded-full
                  hover:bg-[#5f4a2e]
                  transition
                  shrink-0
                "
              >
                Search
              </button>
            </form>

            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category._id}
                    onClick={() => navigate(`/services?category=${category.slug}`)}
                    className="
                      text-xs font-medium
                      text-muted
                      border border-theme
                      rounded-full
                      px-3.5 py-1.5
                      hover:text-[#745A38] hover:border-[#745A38]/40
                      transition
                    "
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              
              <button
              onClick={() => navigate('/services') }
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
              onClick={() => navigate('/register/vendor/Profile')}
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
                  hover:bg-card
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
                <h3 className="text-3xl font-semibold text-primary">
                  {loading ? "…" : <CountUp value={stats?.verifiedExperts || 0} suffix="+" />}
                </h3>
                <p className="text-muted mt-1">
                  Verified Experts
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-primary">
                  {loading ? "…" : <CountUp value={stats?.jobsCompleted || 0} suffix="+" />}
                </h3>
                <p className="text-muted mt-1">
                  Jobs Completed
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-primary">
                  {loading ? "…" : <CountUp value={stats?.satisfactionRate || 0} suffix="%" />}
                </h3>
                <p className="text-muted mt-1">
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
                  bg-card
                  border
                  border-theme
                  rounded-xl
                  shadow-[0_12px_40px_rgba(9,20,38,0.08)]
                  overflow-hidden
                "
              >
                <img
                  src="/src/assets/images/success-artisan.png"
                  alt="artisan"
                  className="w-full h-[260px] object-cover"
                />

                <div className="p-6">
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      bg-[#ffddb4]
                      text-[#5a4222]
                      text-xs
                      px-3
                      py-1
                      rounded-full
                    "
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5a4222] opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5a4222]" />
                    </span>
                    VERIFIED
                  </span>

                  <h3 className="mt-4 text-xl font-semibold text-primary">
                    Master Carpenter
                  </h3>

                  <p className="text-muted mt-2">
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
                  bg-card
                  border
                  border-theme
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
                  bottom-28
                  right-2
                  bg-card
                  border
                  border-theme
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
                  bottom-20
                  left-0
                  bg-card
                  border
                  border-theme
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