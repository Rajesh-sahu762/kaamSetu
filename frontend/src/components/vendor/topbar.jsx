import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { useLocation, useNavigate } from 'react-router-dom';

/* ── Icons ─────────────────────────────────────────────────────── */

function BellIcon({ s = 18, c = 'currentColor' }) {
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function MenuIcon({ s = 20, c = 'currentColor' }) {
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
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function Avatar({ initials, size = 36, bg = T.slateMid }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: T.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Geist,sans-serif',
        fontSize: size * 0.33,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
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

const Topbar = ({ onMenuClick }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [notifOpen, setNotifOpen] = useState(false);4
  const navigate = useNavigate();
const location = useLocation();

const currentDate = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const pageTitles = {
  "/vendor/dashboard": "Dashboard",
  "/vendor/bookings": "Bookings",
  "/vendor/services": "Services",
  "/vendor/reviews": "Reviews",
  "/vendor/profile": "Profile",
  "/vendor/earnings": "Earnings",
  "/vendor/notifications": "Notifications",
};

  return (
    <>
      {/* Topbar */}
      <header
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${isMobile ? '16px' : '24px'}`,
          justifyContent: 'space-between',
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 0,
          }}
        >
          {isMobile && (
            <div
              className="ks-iconbtn"
             onClick={onMenuClick}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MenuIcon s={19} c={T.slateGray} />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'Geist,sans-serif',
                fontSize: isMobile ? 15 : 17,
                fontWeight: 600,
                color: T.slate,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
    {pageTitles[location.pathname] || "Dashboard"}

            </h1>
            {!isMobile && (
              <p
                style={{
                  fontSize: 11,
                  color: T.slateGray,
                  fontFamily: 'Inter,sans-serif',
                  marginTop: 1,
                }}
              >
                 {currentDate}

              </p>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Search — hide on mobile */}
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                padding: '7px 12px',
                width: isTablet ? 160 : 200,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.slateGray}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Search..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  fontFamily: 'Inter,sans-serif',
                  color: T.slate,
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          )}

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <div
              className="ks-iconbtn"
              onClick={() => navigate("/vendor/notifications")}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <BellIcon s={17} c={T.slateGray} />
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  background: T.bronze,
                  borderRadius: '50%',
                  border: `1.5px solid ${T.white}`,
                }}
              />
            </div>
            {notifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: isMobile ? Math.min(window.innerWidth - 16, 300) : 290,
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  boxShadow: '0 8px 32px rgba(30,41,59,0.12)',
                  overflow: 'hidden',
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${T.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.slate,
                    }}
                  >
                    Notifications
                  </span>
                  <span
                    style={{
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 11,
                      color: T.bronze,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </span>
                </div>
                {ACTIVITY.slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="ks-row"
                    style={{
                      padding: '11px 16px',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: 'rgba(168,138,100,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {a.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontFamily: 'Inter,sans-serif',
                          color: T.slate,
                          lineHeight: 1.5,
                        }}
                      >
                        {a.text}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.slateGray,
                          marginTop: 2,
                        }}
                      >
                        {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 22, background: T.border }} />
          <div
    onClick={() => navigate("/vendor/profile")}
    style={{ cursor: "pointer" }}
>
    <Avatar initials="RK" size={32} bg={T.bronze} />
</div>
        </div>
      </header>
    </>
  );
};

export default Topbar;
