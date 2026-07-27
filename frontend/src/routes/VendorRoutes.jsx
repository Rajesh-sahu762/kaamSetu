import { Route } from "react-router-dom";

import VendorLayout from "@/layouts/VendorLayout";
import VendorDashboard from "@/pages/Vendor/VendorDashboard";
import Bookings from "@/pages/Vendor/Bookings";
import VendorReview from "@/pages/Vendor/VendorReview";
import ServicesPage from "@/pages/Vendor/Services";
import Reviews from "@/pages/Vendor/Reviews";
import Profile from "@/pages/Vendor/Profile";
import Earnings from "@/pages/Vendor/Earnings";
import ProtectedRoute from "./ProtectedRoute";
import Notifications from "@/pages/Vendor/Notifications";

const VendorRoutes = () => (
  <>
    <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
    <Route element={<VendorLayout />}>
    <Route path="/vendor/dashboard" element={<VendorDashboard />} />
    <Route path="/vendor/bookings" element={<Bookings />} />
    <Route path="/vendor/review" element={<VendorReview />} />
    <Route path="/vendor/services" element={<ServicesPage />} />
    <Route path="/vendor/reviews" element={<Reviews />} />
    <Route path="/vendor/profile" element={<Profile />} />
    <Route path="/vendor/earnings" element={<Earnings />} />
    <Route path="/vendor/notifications" element={<Notifications />} />
    </Route>
    </Route>
  </>
);

export default VendorRoutes;