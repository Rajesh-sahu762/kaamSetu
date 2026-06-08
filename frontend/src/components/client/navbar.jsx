import { useEffect, useState } from 'react';
import { Search, Bell, Moon, Sun, Menu, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { Link, useNavigate  } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 const navLinks = [
  {
    name: "Services",
    to: "/services",
  },
  {
    name: "Experts",
    to: "/experts",
  },
  {
    name: "How It Works",
    to: "/how-it-works",
  },
  {
    name: "Contact",
    to: "/contact",
  },
];

const navigate = useNavigate()

const btnClick = (type) => {

  if (type === "login") {
    navigate("/login");
  }

  else if (type === "vendor") {
    navigate("/register/vendor/profile");
  }

};


  return (
    <>
      {/* Navbar */}
      <motion.header
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className={`
          fixed
          top-4
          left-1/2
          -translate-x-1/2
          w-[100%]
          max-w-[1380px]
          h-[78px]
          z-50

          rounded-2xl

          transition-all
          duration-300

          ${
            isScrolled
              ? 'bg-card/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(9,20,38,0.08)] border border-theme'
              : 'bg-card/65 backdrop-blur-md border border-white/30'
          }
        `}
      >
        <div
          className="
            h-full
            px-5
            lg:px-8

            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}
          <Link to={"/"}>
          
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="cursor-pointer"
            >
            <h1
              className="
                text-[15px]
                font-semibold
                tracking-[0.35em]
                "
            >
              <span className="text-primary">KAAM</span>

              <span className="text-[#745A38]">SETU</span>
            </h1>
          </motion.div>
                </Link>

          {/* Desktop Links */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-8
            "
          >
         {navLinks.map((item) => (
  <motion.div
    key={item.name}
    whileHover={{
      y: -2,
    }}
  >
    <Link
      to={item.to}
      className="
        relative
        text-muted
        hover:text-primary
        transition
      "
    >
      {item.name}
    </Link>
  </motion.div>
))}
          </nav>

          {/* Search */}

          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            className="
              hidden
              lg:flex

              items-center

              w-[280px]
              h-[46px]

              px-4

              bg-card

              border
              border-theme

              rounded-xl
            "
          >
            <Search size={18} className="text-muted" />

            <input
              type="text"
              placeholder="Search services..."
              className="
                ml-3
                flex-1
                bg-transparent
                outline-none
                text-sm
              "
            />
          </motion.div>

          {/* Right Actions */}

          <div
            className="
              hidden
              lg:flex
              items-center
              gap-3
            "
          >
            {/* Theme Toggle */}

            <motion.button
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={toggleTheme}
              className="
                w-11
                h-11

                flex
                items-center
                justify-center

                rounded-xl

                border
                border-theme

                bg-card
              "
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Notification */}

            <motion.button
              whileHover={{
                y: -2,
              }}
              className="
                relative

                w-11
                h-11

                flex
                items-center
                justify-center

                rounded-xl

                border
                border-theme

                bg-card
              "
            >
              <Bell size={18} />

              <span
                className="
                  absolute
                  top-2
                  right-2

                  w-2
                  h-2

                  rounded-full
                  bg-red-500
                "
              />
            </motion.button>

            {/* Sign Up */}

            <motion.button
              whileHover={{
                y: -2,
              }}
               onClick={() => btnClick("login")}
              className="
                px-5
                py-2.5

                border
                border-theme

                rounded-xl

                bg-card
              "
            >
              Sign Up
            </motion.button>

            {/* Find Work */}

            <motion.button
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.98,
              }}
             onClick={() => btnClick("vendor")}

              className="
                px-6
                py-3

                rounded-xl

                text-white
                font-medium

                bg-gradient-to-r
                from-[#745A38]
                to-[#8c6a43]

                shadow-lg
              "
            >
              Find Work
            </motion.button>
          </div>

          {/* Mobile Menu Button */}

          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}

      <AnimatePresence>
        {mobileOpen && (
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
            className="
              fixed
              inset-0
              bg-[#091426]
              z-[100]
            "
          >
            <div
              className="
                p-6

                flex
                items-center
                justify-between
              "
            >
              <h2
                className="
                  text-white
                  tracking-[0.3em]
                "
              >
                KAAMSETU
              </h2>

              <button onClick={() => setMobileOpen(false)}>
                <X size={30} className="text-white" />
              </button>
            </div>

            <div
              className="
                h-[80vh]

                flex
                flex-col
                justify-center
                items-center

                gap-8
              "
            >
              {navLinks.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="
                      text-white
                      text-2xl
                      font-medium
                    "
                >
                  <Link
                  to={item.to}
                  className="
        relative
        hover:text-primary
        transition
      "
                  >
                  {item.name}
                  </Link>
                </motion.div>
              ))}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  w-[80%]
                  mt-8
                "
              >
              

                <button
                

               onClick={() => btnClick("login")}
                  className="
                    py-4
                    rounded-xl

                    border
                    border-white

                    text-white
                  "
                >
                  Sign Up
                </button>

                <button
                 onClick={() => btnClick("vendor")}
                  className="
                    py-4
                    rounded-xl

                    bg-[#745A38]
                    text-white
                  "
                >
                  Find Work
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
