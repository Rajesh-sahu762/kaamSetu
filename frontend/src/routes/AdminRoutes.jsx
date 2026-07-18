import AdminDashboard from "@/pages/Admin/Dashboard";
import Customers from "@/pages/Admin/Customers";
import Vendors from "@/pages/Admin/Vendors";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";

const adminRoutes = () => (
    <>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/vendors" element={<Vendors />} />
      </Route>
    </Route>
    

    </>

);

export default adminRoutes;
