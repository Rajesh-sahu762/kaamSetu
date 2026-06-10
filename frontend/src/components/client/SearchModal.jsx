import { AnimatePresence, motion } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchModal = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const popularServices = [
    "Electrician",
    "Plumber",
    "Painter",
    "AC Repair",
    "Home Cleaning",
    "Carpenter",
  ];

  const handleSearch = (
    service
  ) => {
    navigate(
      `/services?search=${service}`
    );

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="
              fixed
              inset-0

              bg-black/40

              backdrop-blur-sm

              z-[999]
            "
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              y: -40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -40,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              fixed

              top-24
              left-1/2

              -translate-x-1/2

              w-[95%]
              max-w-2xl

              z-[1000]
            "
          >
            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                overflow-hidden

                shadow-[0_20px_60px_rgba(9,20,38,0.15)]
              "
            >
              {/* Search Bar */}

              <div
                className="
                  flex
                  items-center

                  px-6
                  py-5

                  border-b
                  border-theme
                "
              >
                <Search
                  size={20}
                  className="
                    text-muted
                  "
                />

                <input
                  autoFocus
                  type="text"
                  placeholder="Search services..."
                  className="
                    flex-1

                    ml-4

                    bg-transparent

                    outline-none

                    text-lg
                  "
                />

                <button
                  onClick={onClose}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Popular */}

              <div
                className="
                  p-6
                "
              >
                <div
                  className="
                    flex
                    items-center

                    gap-2

                    mb-5
                  "
                >
                  <TrendingUp
                    size={18}
                  />

                  <span
                    className="
                      text-sm

                      uppercase

                      tracking-wider

                      text-muted
                    "
                  >
                    Popular Services
                  </span>
                </div>

                <div
                  className="
                    flex

                    flex-wrap

                    gap-3
                  "
                >
                  {popularServices.map(
                    (service) => (
                      <button
                        key={service}
                        onClick={() =>
                          handleSearch(
                            service
                          )
                        }
                        className="
                          px-4
                          py-2

                          rounded-full

                          border
                          border-theme

                          hover:bg-[#745A38]

                          hover:text-white

                          transition
                        "
                      >
                        {service}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;