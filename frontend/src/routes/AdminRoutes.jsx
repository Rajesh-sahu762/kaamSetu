import AdminDashboard from "@/pages/Admin/Dashboard";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const adminRoutes = () => (
    <>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Route>
    

    </>

);

export default adminRoutes;
