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

const adminRoutes = () => (
    <>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/vendors" element={<Vendors />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/notifications" element={<Notifications />} />
      </Route>
    </Route>
    

    </>

);

export default adminRoutes;
