import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { T } from "@/utils/vendorTheme";

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return <div style={{ minHeight: "100vh", display: "flex", background: T.ivory }}>
    <AdminSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
    <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
      <AdminTopbar onMenuClick={() => setDrawerOpen(true)} />
      <div style={{ minWidth: 0, flex: 1 }}><Outlet /></div>
    </div>
  </div>;
};

export default AdminLayout;
