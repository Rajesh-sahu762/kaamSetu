import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';
import { getImageUrl } from '@/utils/imageUrl';
import ConfirmModal from '../common/ConfirmModal';
import { useVendor } from '@/context/vendorContext';
import Avatar from "../common/Avatar";


const NAV_ITEMS = [
  { icon: HomeIcon, label: "Dashboard", to: "/vendor/dashboard" },
  { icon: BookingIcon, label: "Bookings", to: "/vendor/bookings" },
  { icon: EarningsIcon, label: "Earnings", to: "/vendor/earnings" },
  { icon: ServicesIcon, label: "Services", to: "/vendor/services" },
  { icon: ProfileIcon, label: "Profile", to: "/vendor/profile" },
  { icon: ReviewIcon, label: "Reviews", to: "/vendor/reviews" },
];

/* ── Icons ─────────────────────────────────────────────────────── */
function HomeIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LogoutIcon({ s = 18, c = "currentColor" }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}


function BookingIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function EarningsIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function ReviewIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ServicesIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M21 12h-2M5 12H3M18.66 18.66l-1.41-1.41M6.75 6.75L5.34 5.34M12 21v-2M12 5V3" />
    </svg>
  );
}
function ProfileIcon({ s = 18, c = 'currentColor' }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CloseIcon({ s = 20, c = 'currentColor' }) {

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}


/* ── InView hook ───────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ── Sidebar content ───────────────────────────────────────────── */
function SidebarContent({
  activeNav,
  setActiveNav,
  collapsed,
  onClose,
  toggleCollapse,
  navigate,
  handleLogout
}) {

  const { vendorData } = useVendor();

const user = vendorData?.user;
const vendor = vendorData?.vendor;
const pendingBookings = vendorData?.stats?.pendingBookings || 0;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo row */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: collapsed ? '0 18px' : '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: T.bronze,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <path
                d="M4 20 C8 8, 12 14, 14 10 C16 6, 20 14, 24 4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="14" cy="22" r="2.5" fill="white" opacity="0.55" />
            </svg>
          </div>
          {!collapsed && (
            <span
              style={{
                fontFamily: 'Geist,sans-serif',
                fontWeight: 600,
                fontSize: 17,
                color: T.white,
                whiteSpace: 'nowrap',
              }}
            >
              Kaam<span style={{ color: T.bronze }}>Setu</span>
            </span>
          )}
        </div>
        {onClose && (
          <div
            onClick={onClose}
            style={{
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              padding: 4,
            }}
          >
            <CloseIcon s={18} c="rgba(255,255,255,0.4)" />
          </div>
        )}
      </div>

      {/* Vendor profile */}
      {!collapsed && (
        <div
          style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Avatar
    image={
        user?.profileImage
            ? getImageUrl(user.profileImage, "profile")
            : ""
    }
    initials={
        user?.profileImage
            ? ""
            : user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
    }
    size={38}
    bg={T.bronze}
/>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: T.green,
                  border: `2px solid ${T.slate}`,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Geist,sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.white,
                }}
              >
                {user?.fullName || "Vendor"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'Inter,sans-serif',
                }}
              >
                {vendor?.businessType || "Business"} • {vendor?.city || ""}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 10,
              background:
    vendor?.status === "approved"
        ? "rgba(34,197,94,.12)"
        : "rgba(245,158,11,.12)",
              border:
    vendor?.status === "approved"
        ? "1px solid rgba(34,197,94,.25)"
        : "1px solid rgba(245,158,11,.25)",
              borderRadius: 4,
              padding: '3px 9px',
            }}
          >
            <span style={{ color: T.bronze, fontSize: 10 }}>✓</span>
            <span
              style={{
                fontFamily: 'Geist,sans-serif',
                fontSize: 10,
                fontWeight: 600,
                color:
    vendor?.status === "approved"
        ? T.green
        : "#F59E0B",
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {vendor?.status === "approved"
    ? "Verified Artisan"
    : "Verification Pending"}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, badge: staticBadge, to }) => {
          const badge = label === 'Bookings' ? pendingBookings : staticBadge;
          const active = activeNav === label;
          return (
            <div
              key={label}
              className="ks-nav-item"
              onClick={() => {
                setActiveNav(label);
                navigate(to);
                onClose && onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 18px' : '10px 20px',
                margin: '1px 8px',
                borderRadius: 6,
                background: active ? 'rgba(168,138,100,0.15)' : 'transparent',
                color: active ? T.bronze : 'rgba(255,255,255,0.55)',
                borderLeft:
                  active && !collapsed
                    ? `2px solid ${T.bronze}`
                    : '2px solid transparent',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ flexShrink: 0 }}>
                <Icon s={16} c={active ? T.bronze : 'rgba(255,255,255,0.45)'} />
              </span>
              {!collapsed && (
                <span
                  style={{
                    fontFamily: 'Geist,sans-serif',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              )}
              {badge && !collapsed && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: T.bronze,
                    color: T.white,
                    fontFamily: 'Geist,sans-serif',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 10,
                  }}
                >
                  {badge}
                </span>
              )}
              {badge && collapsed && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: T.bronze,
                  }}
                />
              )}
            </div>
          );
        })}
      </nav>

      <div
  className="ks-nav-item"
  onClick={() => setShowLogoutModal(true)}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: collapsed ? "10px 18px" : "10px 20px",
    margin: "0 8px 8px",
    borderRadius: 6,
    color: "#EF4444",
    cursor: "pointer",
  }}
>
  <LogoutIcon s={16} c="#EF4444" />

  {!collapsed && (
    <span
      style={{
        fontFamily: "Geist,sans-serif",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      Logout
    </span>
  )}
</div>

      

      {/* Collapse toggle — desktop only */}
      {!onClose && (
        <div
          style={{
            padding: '10px 8px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="ks-nav-item"
            onClick={toggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              padding: '9px 14px',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex' }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.2s',
                }}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </span>
            {!collapsed && (
              <span style={{ fontFamily: 'Geist,sans-serif', fontSize: 12 }}>
                Collapse
              </span>
            )}
          </div>
        </div>
      )}

          <ConfirmModal
  open={showLogoutModal}
  title="Logout from KaamSetu"
  message="Are you sure you want to logout? You can login again anytime."
  confirmText="Logout"
  cancelText="Cancel"
  danger={true}
  onCancel={() => setShowLogoutModal(false)}
  onConfirm={handleLogout}
/>
    </div>

    
  );
}

const Sidebar = ({ drawerOpen, setDrawerOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useBreakpoint();
  const [activeNav, setActiveNav] = useState('Dashboard');
  

  useEffect(() => {

  const currentRoute = NAV_ITEMS.find(
    (item) => item.to === location.pathname
  );

  if (currentRoute) {
    setActiveNav(currentRoute.label);
  }

}, [location.pathname]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // auto-collapse on tablet
  useEffect(() => {
    if (isTablet) setSidebarCollapsed(true);
    else if (!isMobile) setSidebarCollapsed(false);
  }, [isTablet, isMobile]);
  // close drawer on resize to desktop
  useEffect(() => {
    if (!isMobile && !isTablet) setDrawerOpen(false);
  }, [isMobile, isTablet]);

  const showDesktopSidebar = !isMobile;
  const sideW = sidebarCollapsed ? 68 : 240;
const { clearVendorData, vendorData } = useVendor();
const pendingBookings = vendorData?.stats?.pendingBookings || 0;


  const handleLogout = () => {

    clearVendorData();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login",{
        replace:true
    });

}

  return (
    <>
      {/* ── Mobile drawer overlay ── */}
      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
              animation: 'ks-fadeIn 0.2s ease',
            }}
          />
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: 260,
              background: T.slate,
              zIndex: 50,
              animation: 'ks-slideIn 0.25s cubic-bezier(.22,1,.36,1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SidebarContent
            handleLogout={handleLogout}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              collapsed={false}
              navigate={navigate}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Desktop / Tablet sidebar ── */}
      {showDesktopSidebar && (
        <aside
          // onClick={isTablet ? () => setSidebarCollapsed((c) => !c) : undefined}
          style={{
            width: sideW,
            flexShrink: 0,
            background: T.slate,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s cubic-bezier(.22,1,.36,1)',
            overflow: 'hidden',
            zIndex: 20,
            borderRight: '1px solid rgba(255,255,255,0.05)',
            cursor: isTablet ? 'pointer' : 'default',
          }}
        >
          <SidebarContent
          handleLogout={handleLogout}
            activeNav={activeNav}
            setActiveNav={(l) => {
              setActiveNav(l);
            }}
            collapsed={sidebarCollapsed}
            onClose={null}
            navigate={navigate}
            toggleCollapse={() => setSidebarCollapsed((c) => !c)}
          />
        </aside>
      )}

      {/* ── Mobile bottom nav ── */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: T.white,
            borderTop: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            zIndex: 30,
          }}
        >
          {NAV_ITEMS.slice(0, 5).map(({ icon: Icon, label, badge: staticBadge, to }) => {
            const badge = label === 'Bookings' ? pendingBookings : staticBadge;
            const active = activeNav === label;
            return (
              <div
                key={label}
                className="ks-bottom-nav-item"
                onClick={() => { 
                  setActiveNav(label);
                  navigate(to)
                }}
                style={{
                  color: active ? T.bronze : T.slateGray,
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Icon s={20} c={active ? T.bronze : T.slateGray} />
                  {badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -6,
                        width: 14,
                        height: 14,
                        background: T.bronze,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Geist,sans-serif',
                        fontSize: 8,
                        fontWeight: 700,
                        color: T.white,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'Geist,sans-serif',
                    fontSize: 10,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </>
  );
};

export default Sidebar;