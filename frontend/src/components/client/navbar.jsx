import { useContext, useEffect, useRef, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

import SearchModal from "./SearchModal";
import { useTheme } from "@/context/ThemeContext";
import { AuthContext } from "@/context/authContext";
import api from "@/services/api";
import "./navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // The public navbar only exposes customer account actions.
  const isCustomer = !!user && user.role === "customer";

  const navLinks = [
    { name: "Services", to: "/services" },
    { name: "Experts", to: "/experts" },
    { name: "Support", to: "/support" },
  ];

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep the existing live unread notification count and API behaviour.
  useEffect(() => {
    if (!isCustomer) {
      setUnreadCount(0);
      return undefined;
    }

    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const response = await api.get("/notifications");
        if (!cancelled) setUnreadCount(response.data?.unreadCount || 0);
      } catch {
        // Keep the last known count if the notifications endpoint is unavailable.
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isCustomer, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.fullName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const isActiveLink = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleBecomePro = () => {
    setMobileOpen(false);
    navigate("/register/vendor/profile");
  };

  const notificationButton = (mobile = false) => (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      className={`ks-nav-icon-button ${mobile ? "ks-nav-icon-button--mobile" : ""}`}
      aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
    >
      <Bell size={19} strokeWidth={1.8} />
      {unreadCount > 0 && (
        <span className="ks-nav-notification-count">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );

  const themeButton = (mobile = false) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={`ks-nav-icon-button ${mobile ? "ks-nav-icon-button--mobile" : ""}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <Moon size={19} strokeWidth={1.8} /> : <Sun size={19} strokeWidth={1.8} />}
    </button>
  );

  const searchButton = (mobile = false) => (
    <button
      type="button"
      onClick={() => {
        setSearchOpen(true);
        setMobileOpen(false);
      }}
      className={`ks-nav-icon-button ${mobile ? "ks-nav-icon-button--mobile" : ""}`}
      aria-label="Open search"
    >
      <Search size={20} strokeWidth={1.8} />
    </button>
  );

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`ks-navbar ${isScrolled ? "is-scrolled" : ""}`}
      >
        <div className="ks-navbar__inner">
          <nav className="ks-navbar__links" aria-label="Main navigation">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`ks-navbar__link ${isActiveLink(item.to) ? "is-active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <Link to="/" className="ks-navbar__brand" aria-label="KaamSetu home">
            <span className="ks-navbar__wordmark">
              <span>Kaam</span><span>Setu</span>
            </span>
            <span className="ks-navbar__tagline">Trusted Services</span>
          </Link>

          <div className="ks-navbar__actions">
            {isCustomer && notificationButton()}

            <button type="button" onClick={handleBecomePro} className="ks-navbar__pro-button">
              Become a Pro
              <span aria-hidden="true">↗</span>
            </button>

            <span className="ks-navbar__divider" aria-hidden="true" />
            {searchButton()}
            {themeButton()}

            {isCustomer ? (
              <div className="ks-navbar__account" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  className={`ks-navbar__profile-button ${accountOpen ? "is-open" : ""}`}
                  aria-expanded={accountOpen}
                  aria-label="Open account menu"
                >
                  <span className="ks-navbar__avatar">{initials}</span>
                  <ChevronDown size={15} className={accountOpen ? "is-rotated" : ""} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="ks-navbar__account-menu"
                    >
                      <div className="ks-navbar__account-heading">
                        <p>{user.fullName}</p>
                        <span>{user.email}</span>
                      </div>
                      <button type="button" onClick={() => { setAccountOpen(false); navigate("/profile"); }}>
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                      <button type="button" onClick={() => { setAccountOpen(false); navigate("/my-booking"); }}>
                        <CalendarCheck size={16} /> My Bookings
                      </button>
                      <button type="button" className="is-danger" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button type="button" onClick={() => navigate("/login")} className="ks-navbar__login-button">
                Login
              </button>
            )}
          </div>

          <button
            type="button"
            className="ks-navbar__mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={23} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="ks-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="ks-mobile-menu__top">
              <Link to="/" className="ks-navbar__brand" onClick={() => setMobileOpen(false)}>
                <span className="ks-navbar__wordmark"><span>Kaam</span><span>Setu</span></span>
                <span className="ks-navbar__tagline">Trusted Services</span>
              </Link>
              <button type="button" className="ks-mobile-menu__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={21} />
              </button>
            </div>

            <nav className="ks-mobile-menu__links" aria-label="Mobile navigation">
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={isActiveLink(item.to) ? "is-active" : ""}
                  >
                    {item.name}<span>↗</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <button type="button" onClick={handleBecomePro} className="ks-navbar__pro-button ks-mobile-menu__pro">
              Become a Pro <span aria-hidden="true">↗</span>
            </button>

            <div className="ks-mobile-menu__tools">
              {isCustomer && notificationButton(true)}
              {searchButton(true)}
              {themeButton(true)}
              {isCustomer ? (
                <button type="button" className="ks-nav-icon-button ks-nav-icon-button--mobile" onClick={() => { setMobileOpen(false); navigate("/profile"); }} aria-label="Profile">
                  <span className="ks-navbar__avatar">{initials}</span>
                </button>
              ) : (
                <button type="button" className="ks-nav-icon-button ks-nav-icon-button--mobile" onClick={() => { setMobileOpen(false); navigate("/login"); }} aria-label="Login">
                  <User size={20} />
                </button>
              )}
              {isCustomer && (
                <button type="button" className="ks-nav-icon-button ks-nav-icon-button--mobile" onClick={handleLogout} aria-label="Logout">
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
