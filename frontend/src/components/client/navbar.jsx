import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const navLinks = [
    "Services",
    "Professionals",
    "How It Works",
    "About",
  ];

  return (
    <>
      <header
        className={`
          fixed
          top-0
          left-0
          w-full
          z-50
          transition-all
          duration-300

          ${
            scrolled
              ? "backdrop-blur-md bg-white/80 border-b border-[#d3e4fe]"
              : "bg-transparent"
          }
        `}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            lg:px-8
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}
          <div>
            <h1
              className="
                text-[#091426]
                font-semibold
                tracking-[0.25em]
                text-sm
                md:text-base
              "
            >
              KAAMSETU
            </h1>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  text-[#45474c]
                  hover:text-[#091426]
                  transition
                  relative
                  group
                "
              >
                {item}

                <span
                  className="
                    absolute
                    left-0
                    -bottom-1
                    w-0
                    h-[2px]
                    bg-[#745A38]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              className="
                text-[#091426]
                hover:text-[#745A38]
                transition
              "
            >
              Login
            </button>

            <button
              className="
                bg-[#091426]
                text-white
                px-5
                py-3
                rounded-md
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
              "
            >
              Become a Professional
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="lg:hidden"
          >
            {mobileMenu ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{
              opacity: 0,
              x: "100%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "100%",
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              top-0
              right-0
              w-[80%]
              h-screen
              bg-white
              z-[60]
              shadow-2xl
              p-8
            "
          >
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <X size={28} />
              </button>
            </div>

            <div className="mt-12 flex flex-col gap-8">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    text-lg
                    text-[#091426]
                    font-medium
                  "
                >
                  {item}
                </a>
              ))}

              <hr />

              <button
                className="
                  text-left
                  text-[#091426]
                  font-medium
                "
              >
                Login
              </button>

              <button
                className="
                  bg-[#091426]
                  text-white
                  py-4
                  rounded-md
                "
              >
                Become a Professional
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;