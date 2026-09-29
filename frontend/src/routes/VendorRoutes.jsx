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
    <Route path="/vendor/dashboard" element={<VendorDashboard />} title="Dashboard" />
    <Route path="/vendor/bookings" element={<Bookings />} title="Bookings" />
    <Route path="/vendor/review" element={<VendorReview />} title="Vendor Review" />
    <Route path="/vendor/services" element={<ServicesPage />} title="Services" />
    <Route path="/vendor/reviews" element={<Reviews />} title="Reviews" />
    <Route path="/vendor/profile" element={<Profile />} title="Profile" />
    <Route path="/vendor/earnings" element={<Earnings />} title="Earnings" />
    <Route path="/vendor/notifications" element={<Notifications />} title="Notifications" />
    </Route>
    </Route>
  </>
);

export default VendorRoutes;