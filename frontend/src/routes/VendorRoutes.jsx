import { Route } from "react-router-dom";

import VendorLayout from "@/layouts/VendorLayout";
import VendorDashboard from "@/pages/Vendor/VendorDashboard";
import Bookings from "@/pages/Vendor/Bookings";
import VendorReview from "@/pages/Vendor/VendorReview";
import ServicesPage from "@/pages/Vendor/Services";

const VendorRoutes = () => (
  <>
    <Route element={<VendorLayout />}>

      <Route
        path="/vendor/dashboard"
        element={<VendorDashboard />}
      />

      <Route
        path="/vendor/bookings"
        element={<Bookings />}
      />

    <Route path="/vendor/review" element={<VendorReview />} />
    <Route path="/vendor/services" element={<ServicesPage />} />

    </Route>
  </>
);

export default VendorRoutes;