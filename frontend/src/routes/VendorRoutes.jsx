import { Route } from "react-router-dom";

import VendorLayout from "@/layouts/VendorLayout";
import VendorDashboard from "@/pages/Vendor/VendorDashboard";
import Bookings from "@/pages/Vendor/Bookings";

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

    </Route>
  </>
);

export default VendorRoutes;