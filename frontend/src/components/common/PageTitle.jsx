import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Home",
      "/services": "Services",
      "/experts": "Experts",
      "/bookings": "My Bookings",
      "/profile": "My Profile",
      "/login": "Login",
      "/register": "Create Account",
      "/vendor/dashboard": "Vendor Dashboard",
      "/vendor/bookings": "Vendor Bookings",
    };

    const title = titles[location.pathname];

    document.title = title
      ? `${title} | KaamSetu`
      : "KaamSetu | Trusted Service Marketplace";
  }, [location.pathname]);

  return null;
};

export default PageTitle;