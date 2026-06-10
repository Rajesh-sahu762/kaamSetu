import { useEffect, useState } from 'react';
import {
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";

import SearchModal from './SearchModal';

import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { Link, useLocation, useNavigate  } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

const [searchOpen, setSearchOpen] =
  useState(false);

  const { theme, toggleTheme } = useTheme();

  const location = useLocation();

useEffect(() => {
  setMobileOpen(false);
}, [location.pathname]);

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
    name: "Support",
    to: "/support",
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
          top-3
          left-1/2
          -translate-x-1/2
          w-[95%]
max-w-[1440px]

h-[88px]

rounded-full
          z-50


          transition-all
          duration-300

          ${
           isScrolled
? 'bg-card/75 backdrop-blur-2xl shadow-[0_15px_50px_rgba(9,20,38,0.08)] border border-theme'
: 'bg-card/60 backdrop-blur-xl border border-theme'
          }
        `}
      >
        <div
  className="
    h-full

    px-6
    lg:px-10

    grid
    grid-cols-[auto_1fr_auto]

    items-center
  "
>
  {/* LEFT */}

  <nav
    className="
      hidden
      lg:flex

      items-center

      gap-8
    "
  >
    {navLinks.map((item) => (
      <Link
        key={item.name}
        to={item.to}
        className="
          text-sm

          tracking-wide

          text-muted

          hover:text-primary

          transition
        "
      >
        {item.name}
      </Link>
    ))}
  </nav>

  {/* CENTER */}

  <div
    className="
      flex
      justify-center
    "
  >
    <Link
      to="/"
      className="
        flex
        flex-col

        items-center
      "
    >
      <h1
        className="
          text-[24px]
          md:text-[28px]

          font-semibold
        "
      >
        <span className="text-primary">
          Kaam
        </span>

        <span className="text-[#745A38]">
          Setu
        </span>
      </h1>

      <span
        className="
          hidden
          md:block

          text-[10px]

          uppercase

          tracking-[0.35em]

          text-[#745A38]
        "
      >
        Trusted Services
      </span>
    </Link>
  </div>

  {/* RIGHT */}

  <div
    className="
      hidden
      lg:flex

      items-center

      justify-end

      gap-5
    "
  >
    <button
      onClick={() => navigate("/profile")}
      className="
        hover:text-[#745A38]

        transition
      "
    >
      <User size={20} />
    </button>

    <button
      onClick={() =>
    setSearchOpen(true)
  }
    
    className="
        hover:text-[#745A38]

        transition
      "
    >
      <Search size={20} />
    </button>
    

    <button
      onClick={toggleTheme}
      className="
        hover:text-[#745A38]

        transition
      "
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  </div>

  {/* MOBILE */}

  <button
    className="
      lg:hidden

      justify-self-end
    "
    onClick={() =>
      setMobileOpen(true)
    }
  >
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
              bg-card
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
                  
                  tracking-[0.3em]
                "
              >
                KAAMSETU
              </h2>

              <button onClick={() => setMobileOpen(false)}>
                <X size={30} />
              </button>
            </div>

            <div
              className="
                min-h-screen

                flex
                flex-col
                justify-center
                items-center

                gap-10
              "
            >
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.to}
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

    gap-8

    mt-10
  "
>
  <button
      onClick={toggleTheme}
      className="
        hover:text-[#745A38]

        transition
      "
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>

  <button
    onClick={() =>
      navigate("/profile")
    }
  >
    <User size={24} />
  </button>

  <button
      onClick={() =>
    setSearchOpen(true)
  }
    
    className="
        hover:text-[#745A38]

        transition
      "
    >
      <Search size={20} />
    </button>
    
</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal
  isOpen={searchOpen}
  onClose={() =>
    setSearchOpen(false)
  }
/>
    </>
  );
};

export default Navbar;
