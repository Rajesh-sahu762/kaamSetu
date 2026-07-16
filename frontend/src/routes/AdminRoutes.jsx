import AdminDashboard from "@/pages/Admin/Dashboard";
import { Route } from "react-router-dom";

const adminRoutes = () => (
    <>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    

    </>

);

export default adminRoutes;