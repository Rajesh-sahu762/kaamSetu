import AdminDashboard from "@/pages/Admin/Dashboard";
import Customers from "@/pages/Admin/Customers";
import Vendors from "@/pages/Admin/Vendors";
import Categories from "@/pages/Admin/Categories";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import Services from "@/pages/Admin/Services";
import Reviews from "@/pages/Admin/Reviews";
import Transactions from "@/pages/Admin/Transactions";
import Notifications from "@/pages/Admin/Notifications";
import BookingManagement from "@/pages/Admin/Bookings";

const adminRoutes = () => (
    <>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} title="Dashboard" />
        <Route path="/admin/customers" element={<Customers />} title="Customers" />
        <Route path="/admin/vendors" element={<Vendors />} title="Vendors" />
        <Route path="/admin/categories" element={<Categories />} title="Categories" />
        <Route path="/admin/services" element={<Services />} title="Services" />
        <Route path="/admin/reviews" element={<Reviews />} title="Reviews" />
        <Route path="/admin/transactions" element={<Transactions />} title="Transactions" />
          <Route path="/admin/notifications" element={<Notifications />} title="Notifications" />
          <Route path="/admin/bookings" element={<BookingManagement />} title="Bookings" />
      </Route>
    </Route>
    

    </>

);

export default adminRoutes;
