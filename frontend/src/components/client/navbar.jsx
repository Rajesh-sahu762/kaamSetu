import { useContext, useEffect, useRef, useState } from 'react';
import {
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  CalendarCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

import SearchModal from './SearchModal';

import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { AuthContext } from '@/context/authContext';
import api from '@/services/api';
import { Link, useLocation, useNavigate  } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

const [searchOpen, setSearchOpen] =
  useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const location = useLocation();

useEffect(() => {
  setMobileOpen(false);
  setAccountOpen(false);
}, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live unread notification count for the logged-in customer (reuses the existing self-notifications API)
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const response = await api.get('/notifications');
        if (!cancelled) setUnreadCount(response.data?.unreadCount || 0);
      } catch {
        // Silently ignore — the badge simply stays at its last known value.
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user, location.pathname]);

  // Close the account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (user?.fullName || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate('/login', { replace: true });
  };

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

const isActiveLink = (to) =>
  to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

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

      gap-1.5
    "
  >
    {navLinks.map((item) => (
      <Link
        key={item.name}
        to={item.to}
        className={`
          relative
          px-4 py-2

          text-sm
          font-medium
          tracking-wide

          rounded-full

          transition-all
          duration-300

          ${
            isActiveLink(item.to)
              ? "text-[#745A38] bg-[#745A38]/10"
              : "text-muted hover:text-primary hover:bg-[#745A38]/5"
          }
        `}
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
    {user && (
      <button
        onClick={() => navigate("/notifications")}
        className="relative hover:text-[#745A38] transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1.5 -right-1.5
              min-w-[16px] h-[16px] px-1
              rounded-full
              bg-[#745A38] text-white
              text-[9px] font-bold
              flex items-center justify-center
              leading-none
            "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    )}

    <button
      onClick={() => btnClick("vendor")}
      className="
        hidden
        xl:flex
        items-center
        gap-1.5

        px-4 py-2

        text-sm font-medium

        rounded-full

        border border-[#745A38]/30

        text-[#745A38]

        hover:bg-[#745A38]
        hover:text-white
        hover:border-[#745A38]

        transition-all
        duration-300
      "
    >
      Become a Pro
    </button>

    <span className="hidden xl:block w-px h-6 bg-theme" />

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

    {user ? (
      <div className="relative" ref={accountRef}>
        <button
          onClick={() => setAccountOpen((open) => !open)}
          className="
            flex items-center gap-2
            pl-1 pr-3 py-1
            rounded-full
            border border-theme
            hover:border-[#745A38]/50
            transition
          "
        >
          <span
            className="
              w-8 h-8 rounded-full
              bg-gradient-to-br from-[#745A38] to-[#A88A64]
              text-white text-xs font-bold
              flex items-center justify-center
            "
          >
            {initials}
          </span>
          <ChevronDown size={14} className={`text-muted transition-transform ${accountOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {accountOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-0 top-[calc(100%+10px)]
                w-56
                bg-card border border-theme
                rounded-2xl shadow-theme
                overflow-hidden
                z-50
              "
            >
              <div className="px-4 py-3 border-b border-theme">
                <p className="text-sm font-semibold text-primary truncate">{user.fullName}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <button
                onClick={() => { setAccountOpen(false); navigate("/profile"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-[#745A38]/8 transition"
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button
                onClick={() => { setAccountOpen(false); navigate("/my-booking"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-[#745A38]/8 transition"
              >
                <CalendarCheck size={16} /> My Bookings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/8 transition border-t border-theme"
              >
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ) : (
      <button
        onClick={() => btnClick("login")}
        className="
          px-5 py-2
          rounded-full
          bg-[#745A38] text-white
          text-sm font-medium
          hover:scale-105
          transition
        "
      >
        Login
      </button>
    )}
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
              bg-card/98
              backdrop-blur-2xl
              z-[100]
              overflow-y-auto
            "
          >
            <div
              className="
                p-6

                flex
                items-center
                justify-between

                border-b border-theme
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  tracking-[0.3em]
                "
              >
                <span className="text-primary">KAAM</span>
                <span className="text-[#745A38]">SETU</span>
              </h2>

              <button
                onClick={() => setMobileOpen(false)}
                className="
                  w-10 h-10
                  rounded-full
                  border border-theme
                  flex items-center justify-center
                  hover:bg-[#745A38]/10 hover:border-[#745A38]/40
                  transition
                "
              >
                <X size={20} />
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
                  className={`
        relative
        transition
        ${isActiveLink(item.to) ? "text-[#745A38]" : "hover:text-primary"}
      `}
                  >
                  {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                onClick={() => { setMobileOpen(false); btnClick("vendor"); }}
                className="
                  px-6 py-3
                  rounded-full
                  border border-[#745A38]/30
                  text-[#745A38]
                  text-base font-medium
                  hover:bg-[#745A38] hover:text-white hover:border-[#745A38]
                  transition-all
                "
              >
                Become a Pro
              </motion.button>

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

  {user && (
    <button
      onClick={() => navigate("/notifications")}
      className="relative hover:text-[#745A38] transition"
      aria-label="Notifications"
    >
      <Bell size={24} />
      {unreadCount > 0 && (
        <span
          className="
            absolute -top-1.5 -right-1.5
            min-w-[16px] h-[16px] px-1
            rounded-full
            bg-[#745A38] text-white
            text-[9px] font-bold
            flex items-center justify-center
            leading-none
          "
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  )}

  <button
    onClick={() =>
      navigate(user ? "/profile" : "/login")
    }
  >
    {user ? (
      <span
        className="
          w-8 h-8 rounded-full
          bg-gradient-to-br from-[#745A38] to-[#A88A64]
          text-white text-xs font-bold
          flex items-center justify-center
        "
      >
        {initials}
      </span>
    ) : (
      <User size={24} />
    )}
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

  {user && (
    <button onClick={handleLogout} className="hover:text-red-500 transition" aria-label="Logout">
      <LogOut size={22} />
    </button>
  )}
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
