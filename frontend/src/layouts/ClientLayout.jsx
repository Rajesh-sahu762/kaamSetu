import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/navbar";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default ClientLayout;
