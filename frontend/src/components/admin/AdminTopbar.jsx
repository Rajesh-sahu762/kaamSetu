import { useContext, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Menu, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import api from "@/services/api";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

const PAGE_TITLES = {
  "/admin/dashboard": "Marketplace overview",
  "/admin/customers": "Customer management",
  "/admin/vendors": "Vendor management",
};

const relativeTime = (date) => {
  const difference = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(difference / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

const AdminTopbar = ({ onMenuClick }) => {
  const { isMobile } = useBreakpoint();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);
  useEffect(() => {
    const closeOnOutsideClick = (event) => { if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const markAllRead = async () => {
    if (!unreadCount) return;
    try {
      await api.patch("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
    } catch {
      // Preserve the current list when the request cannot be completed.
    }
  };

  const pageTitle = PAGE_TITLES[location.pathname] || "Administration";
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return <header style={{ minHeight: 68, padding: isMobile ? "0 14px" : "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 30 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
      {isMobile && <button type="button" aria-label="Open navigation" onClick={onMenuClick} style={{ border: 0, color: T.slate, background: T.surfaceLow, width: 36, height: 36, borderRadius: 9, cursor: "pointer", display: "grid", placeItems: "center" }}><Menu size={19} /></button>}
      <div style={{ minWidth: 0 }}><h1 style={{ margin: 0, color: T.slate, fontSize: isMobile ? 14 : 16, fontWeight: 750, letterSpacing: "-.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pageTitle}</h1>{!isMobile && <p style={{ margin: "3px 0 0", color: T.slateGray, fontSize: 11 }}>{today}</p>}</div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
      <div ref={panelRef} style={{ position: "relative" }}>
        <button type="button" aria-label="Notifications" onClick={() => { setOpen((value) => !value); if (!open) loadNotifications(); }} style={{ position: "relative", border: `1px solid ${T.border}`, color: T.slateGray, background: T.white, width: 37, height: 37, borderRadius: 10, cursor: "pointer", display: "grid", placeItems: "center" }}><Bell size={18} />{unreadCount > 0 && <span style={{ position: "absolute", right: -4, top: -4, minWidth: 16, height: 16, padding: "0 4px", display: "grid", placeItems: "center", borderRadius: 999, background: T.bronze, border: `2px solid ${T.white}`, color: T.white, fontSize: 8, fontWeight: 800 }}>{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>
        {open && <div style={{ position: "absolute", top: 45, right: 0, width: isMobile ? "min(330px, calc(100vw - 28px))" : 350, maxHeight: 420, overflowY: "auto", background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 18px 45px rgba(9,20,38,.16)", zIndex: 60 }}>
          <div style={{ padding: "14px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}><div><div style={{ color: T.slate, fontSize: 13, fontWeight: 750 }}>Notifications</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 10 }}>{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</div></div><button type="button" onClick={markAllRead} disabled={!unreadCount} style={{ display: "inline-flex", alignItems: "center", gap: 5, border: 0, color: unreadCount ? T.bronze : T.borderDim, background: "transparent", cursor: unreadCount ? "pointer" : "default", fontSize: 10, fontWeight: 750 }}><CheckCheck size={14} /> Mark read</button></div>
          {loading ? <div style={{ padding: 28, color: T.slateGray, fontSize: 12, textAlign: "center" }}><RefreshCw size={16} style={{ marginBottom: 7 }} /><br />Loading notifications…</div> : notifications.length ? notifications.slice(0, 6).map((notification) => <div key={notification._id} style={{ padding: "12px 15px", background: notification.isRead ? T.white : T.surfaceLow, borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span style={{ color: T.slate, fontWeight: 700, fontSize: 11 }}>{notification.title}</span><span style={{ color: T.slateGray, whiteSpace: "nowrap", fontSize: 10 }}>{relativeTime(notification.createdAt)}</span></div><p style={{ color: T.slateGray, margin: "5px 0 0", fontSize: 11, lineHeight: 1.45 }}>{notification.message}</p></div>) : <div style={{ padding: 30, color: T.slateGray, fontSize: 12, textAlign: "center" }}>No notifications yet.</div>}
        </div>}
      </div>
      <div style={{ width: 1, height: 27, background: T.border }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%", color: T.white, background: T.slate, fontSize: 11, fontWeight: 750 }}>{(user?.fullName || "A").split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>{!isMobile && <div style={{ maxWidth: 140 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.slate, fontSize: 11, fontWeight: 700 }}>{user?.fullName || "Administrator"}</div><div style={{ color: T.bronze, marginTop: 2, fontSize: 9, fontWeight: 750, letterSpacing: ".06em", textTransform: "uppercase" }}>Admin</div></div>}</div>
    </div>
  </header>;
};

export default AdminTopbar;
