import { useContext, useEffect } from "react";
import { BarChart3, ChevronLeft, FolderKanban, LayoutDashboard, LogOut, ShieldCheck, Store, Users, Wrench, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Vendors", to: "/admin/vendors", icon: Store },
  { label: "Categories", to: "/admin/categories", icon: FolderKanban },
  { label: "Services", to: "/admin/services", icon: Wrench },
];

const initials = (name = "Admin") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const SidebarContent = ({ collapsed, onClose, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const activeItem = NAV_ITEMS.find((item) => item.to === location.pathname);

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ minHeight: 72, padding: collapsed ? "0 17px" : "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 34, height: 34, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 11, background: `linear-gradient(135deg, ${T.bronzeLight}, ${T.bronze})`, color: T.slate }}><BarChart3 size={18} strokeWidth={2.4} /></div>
          {!collapsed && <div style={{ minWidth: 0 }}><div style={{ color: T.white, fontSize: 16, fontWeight: 750, letterSpacing: "-.35px" }}>Kaam<span style={{ color: T.bronze }}>Setu</span></div><div style={{ color: "rgba(255,255,255,.42)", fontSize: 9, marginTop: 2, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Control centre</div></div>}
        </div>
        {onClose && <button type="button" onClick={onClose} aria-label="Close navigation" style={{ color: "rgba(255,255,255,.65)", border: 0, background: "transparent", cursor: "pointer", padding: 4 }}><X size={19} /></button>}
      </div>

      {!collapsed && <div style={{ margin: "18px 12px 10px", padding: 13, borderRadius: 13, background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "50%", color: T.white, background: T.bronze, fontWeight: 750, fontSize: 12 }}>{initials(user?.fullName)}</div>
          <div style={{ minWidth: 0 }}><div style={{ color: T.white, fontWeight: 650, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.fullName || "Administrator"}</div><div style={{ marginTop: 3, color: "rgba(255,255,255,.43)", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || "Admin account"}</div></div>
        </div>
        <div style={{ marginTop: 11, display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 7px", background: "rgba(34,197,94,.11)", borderRadius: 999, color: "#7ee5a3", fontSize: 9, fontWeight: 750, letterSpacing: ".06em", textTransform: "uppercase" }}><ShieldCheck size={11} /> Administrator</div>
      </div>}

      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {!collapsed && <div style={{ padding: "0 12px 8px", color: "rgba(255,255,255,.34)", fontSize: 9, fontWeight: 750, letterSpacing: ".12em", textTransform: "uppercase" }}>Workspace</div>}
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active = activeItem?.to === to;
          return <button key={to} type="button" title={collapsed ? label : undefined} onClick={() => { navigate(to); onClose?.(); }} style={{ width: "100%", border: 0, cursor: "pointer", padding: collapsed ? "11px" : "11px 12px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 11, borderRadius: 9, color: active ? T.bronzeLight : "rgba(255,255,255,.57)", background: active ? "rgba(168,138,100,.18)" : "transparent", boxShadow: active ? "inset 2px 0 0 #A88A64" : "none", transition: "background .18s ease" }}><Icon size={17} strokeWidth={active ? 2.35 : 1.85} /><span style={{ display: collapsed ? "none" : "block", fontSize: 12, fontWeight: active ? 700 : 550 }}>{label}</span></button>;
        })}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <button type="button" onClick={signOut} title={collapsed ? "Sign out" : undefined} style={{ width: "100%", border: 0, cursor: "pointer", padding: collapsed ? "10px" : "10px 12px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 11, borderRadius: 9, color: "#fca5a5", background: "transparent" }}><LogOut size={17} /><span style={{ display: collapsed ? "none" : "block", fontSize: 12, fontWeight: 650 }}>Sign out</span></button>
        {onToggle && <button type="button" onClick={onToggle} style={{ width: "100%", marginTop: 5, border: 0, cursor: "pointer", padding: collapsed ? "10px" : "10px 12px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 11, borderRadius: 9, color: "rgba(255,255,255,.38)", background: "transparent" }}><ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .2s" }} /><span style={{ display: collapsed ? "none" : "block", fontSize: 11 }}>Collapse sidebar</span></button>}
      </div>
    </div>
  );
};

const AdminSidebar = ({ open, onClose, collapsed, onToggle }) => {
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    if (!isMobile) onClose?.();
  }, [isMobile, onClose]);

  if (isMobile) {
    return open ? <><button type="button" aria-label="Close navigation overlay" onClick={onClose} style={{ position: "fixed", zIndex: 40, inset: 0, border: 0, background: "rgba(9,20,38,.58)" }} /><aside style={{ position: "fixed", zIndex: 50, inset: "0 auto 0 0", width: 278, maxWidth: "85vw", background: T.slate, boxShadow: "18px 0 48px rgba(9,20,38,.28)" }}><SidebarContent collapsed={false} onClose={onClose} /></aside></> : null;
  }

  const isCollapsed = isTablet || collapsed;
  return <aside style={{ width: isCollapsed ? 68 : 264, minHeight: "100vh", flexShrink: 0, background: T.slate, transition: "width .22s ease", overflow: "hidden" }}><SidebarContent collapsed={isCollapsed} onToggle={isTablet ? undefined : onToggle} /></aside>;
};

export default AdminSidebar;