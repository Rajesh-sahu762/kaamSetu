import Navbar from "@/components/client/navbar";
import { Outlet, useLocation } from "react-router-dom";

const ClientLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {!isHomePage && <Footer />}
    </>
  );
};

export default ClientLayout;
