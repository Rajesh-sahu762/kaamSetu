import Sidebar from '@/components/vendor/sidebar';
import Topbar from '@/components/vendor/topbar';
import Fade from '@/components/vendor/common/Fade';
import Avatar from '@/components/vendor/common/Avatar';
import StatusPill from '@/components/vendor/common/StatusPill';

import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';
import { useState, useEffect, useRef } from 'react';

/* ── Mock data ─────────────────────────────────────────────────── */
const STATS = [
  {
    label: 'Total Earnings',
    value: '₹1,24,800',
    delta: '+18.4%',
    up: true,
    sub: 'vs last month',
    icon: '₹',
  },
  {
    label: 'Active Bookings',
    value: '14',
    delta: '+3',
    up: true,
    sub: '2 starting today',
    icon: '📋',
  },
  {
    label: 'Avg. Rating',
    value: '4.92',
    delta: '+0.04',
    up: true,
    sub: '138 reviews',
    icon: '★',
  },
  {
    label: 'Profile Views',
    value: '2,341',
    delta: '-6.1%',
    up: false,
    sub: 'last 30 days',
    icon: '👁',
  },
];

const BOOKINGS = [
  {
    id: 'KS-4821',
    client: 'Meera Joshi',
    service: 'Interior Painting',
    date: 'Today, 10:00 AM',
    amount: '₹8,500',
    status: 'confirmed',
    avatar: 'MJ',
  },
  {
    id: 'KS-4820',
    client: 'Arjun Kapoor',
    service: 'Plumbing Repair',
    date: 'Today, 2:00 PM',
    amount: '₹3,200',
    status: 'in-progress',
    avatar: 'AK',
  },
  {
    id: 'KS-4818',
    client: 'Sunita Rao',
    service: 'Electrical Wiring',
    date: 'Tomorrow, 9:00 AM',
    amount: '₹12,000',
    status: 'confirmed',
    avatar: 'SR',
  },
  {
    id: 'KS-4815',
    client: 'Ravi Malhotra',
    service: 'Carpentry Work',
    date: 'Jun 19, 11:00 AM',
    amount: '₹6,800',
    status: 'pending',
    avatar: 'RM',
  },
  {
    id: 'KS-4810',
    client: 'Priya Nair',
    service: 'False Ceiling',
    date: 'Jun 20, 10:00 AM',
    amount: '₹22,000',
    status: 'pending',
    avatar: 'PN',
  },
];

const REVIEWS = [
  {
    name: 'Deepa Sharma',
    rating: 5,
    text: 'Exceptional work, very professional and timely. Will definitely hire again.',
    date: '2 days ago',
    avatar: 'DS',
  },
  {
    name: 'Vikram Singh',
    rating: 5,
    text: 'Quality of work was outstanding. Clean, precise, and hassle-free experience.',
    date: '5 days ago',
    avatar: 'VS',
  },
  {
    name: 'Anita Bose',
    rating: 4,
    text: 'Good work overall, minor delay in arrival but the output was excellent.',
    date: '1 week ago',
    avatar: 'AB',
  },
];

const EARNINGS_BARS = [
  { month: 'Jan', value: 68 },
  { month: 'Feb', value: 82 },
  { month: 'Mar', value: 59 },
  { month: 'Apr', value: 91 },
  { month: 'May', value: 74 },
  { month: 'Jun', value: 100 },
];

const ACTIVITY = [
  {
    icon: '✓',
    color: T.green,
    text: 'Booking KS-4821 confirmed by client',
    time: '9:32 AM',
  },
  {
    icon: '★',
    color: T.bronze,
    text: 'New 5-star review from Deepa Sharma',
    time: 'Yesterday',
  },
  {
    icon: '₹',
    color: T.blue,
    text: 'Payment of ₹8,500 received',
    time: 'Yesterday',
  },
  {
    icon: '📋',
    color: T.amber,
    text: 'New booking request from Priya Nair',
    time: 'Jun 15',
  },
  {
    icon: '✓',
    color: T.green,
    text: 'Booking KS-4810 marked complete',
    time: 'Jun 14',
  },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', bg: T.greenDim, color: T.green },
  'in-progress': { label: 'In Progress', bg: T.blueDim, color: T.blue },
  pending: { label: 'Pending', bg: T.amberDim, color: T.amber },
};

/* ── Icons ─────────────────────────────────────────────────────── */

function TrendUp() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke={T.green}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TrendDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke={T.red}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

/* ── Animated counter ──────────────────────────────────────────── */
function AnimatedValue({ value, inView }) {
  const [disp, setDisp] = useState('0');
  useEffect(() => {
    if (!inView) return;
    const numStr = value.replace(/[^\d.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) {
      setDisp(value);
      return;
    }
    const prefix = value.match(/^[^\d]*/)?.[0] || '';
    const suffix = value.match(/[^\d.]+$/)?.[0] || '';
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(ease * num * 100) / 100;
      setDisp(
        prefix +
          (Number.isInteger(num)
            ? Math.round(cur).toLocaleString('en-IN')
            : cur.toFixed(2)) +
          suffix
      );
      if (p < 1) requestAnimationFrame(step);
      else setDisp(value);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return <>{disp}</>;
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

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ stat, index }) {
  const [ref, inView] = useInView(0.15);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.white,
        border: `1px solid ${hov ? T.borderDim : T.border}`,
        borderRadius: 8,
        padding: '20px 22px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s, box-shadow 0.2s`,
        boxShadow: hov ? '0 4px 20px rgba(30,41,59,0.08)' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            color: T.slateGray,
          }}
        >
          {stat.label}
        </span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: stat.up ? T.greenDim : T.redDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
          }}
        >
          {stat.icon}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'Geist,sans-serif',
          fontSize: 28,
          fontWeight: 600,
          color: T.slate,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        <AnimatedValue value={stat.value} inView={inView} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexWrap: 'wrap',
        }}
      >
        {stat.up ? <TrendUp /> : <TrendDown />}
        <span
          style={{
            fontFamily: 'Geist,sans-serif',
            fontSize: 12,
            fontWeight: 600,
            color: stat.up ? T.green : T.red,
          }}
        >
          {stat.delta}
        </span>
        <span
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            color: T.slateGray,
          }}
        >
          {stat.sub}
        </span>
      </div>
    </div>
  );
}

/* ── Earnings bar chart ────────────────────────────────────────── */
function EarningsChart({ inView }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: 72,
        marginTop: 8,
      }}
    >
      {EARNINGS_BARS.map((b, i) => (
        <div
          key={b.month}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <div
            style={{
              width: '100%',
              borderRadius: '3px 3px 0 0',
              background: i === EARNINGS_BARS.length - 1 ? T.bronze : T.border,
              height: inView ? `${b.value * 0.56}px` : '0px',
              transition: `height 0.6s cubic-bezier(.22,1,.36,1) ${i * 0.07}s`,
              position: 'relative',
            }}
          >
            {i === EARNINGS_BARS.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: T.bronze,
                  color: T.white,
                  fontSize: 9,
                  fontFamily: 'Geist,sans-serif',
                  fontWeight: 600,
                  padding: '2px 5px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                Best
              </div>
            )}
          </div>
          <span
            style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 10,
              color: T.slateGray,
            }}
          >
            {b.month}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Booking card (mobile) ─────────────────────────────────────── */
function BookingCard({ b, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: '16px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.4s ease ${index * 0.06}s, transform 0.4s ease ${index * 0.06}s`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={b.avatar} size={36} />
          <div>
            <div
              style={{
                fontFamily: 'Geist,sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: T.slate,
              }}
            >
              {b.client}
            </div>
            <div
              style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                color: T.slateGray,
                marginTop: 2,
              }}
            >
              {b.service}
            </div>
          </div>
        </div>
        <StatusPill status={b.status} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <span
          style={{
            fontFamily: 'Geist,sans-serif',
            fontSize: 11,
            color: T.bronze,
            fontWeight: 600,
          }}
        >
          {b.id}
        </span>
        <span
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            color: T.slateGray,
          }}
        >
          {b.date}
        </span>
        <span
          style={{
            fontFamily: 'Geist,sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: T.slate,
          }}
        >
          {b.amount}
        </span>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export default function VendorDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const [chartRef, chartInView] = useInView();
  // grid columns based on breakpoint
  const statCols = isMobile
    ? 'repeat(2,1fr)'
    : isTablet
      ? 'repeat(2,1fr)'
      : 'repeat(4,1fr)';
  const midCols = isMobile ? '1fr' : isTablet ? '1fr' : '1fr 320px';
  const bottomCols = isMobile ? '1fr' : isTablet ? '1fr' : '1fr 340px';
  const contentPad = isMobile ? '16px' : isTablet ? '20px' : '28px 32px';

  return (
    <>
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .ks-nav-item:hover { background: rgba(168,138,100,0.09) !important; }
        .ks-row:hover { background: ${T.surfaceLow} !important; }
        .ks-abtn { transition: opacity 0.15s, transform 0.15s; cursor: pointer; }
        .ks-abtn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ks-iconbtn { border-radius: 6px; cursor: pointer; transition: background 0.15s; }
        .ks-iconbtn:hover { background: ${T.border} !important; }
        .ks-bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0; flex: 1; cursor: pointer; transition: color 0.15s; }
        @keyframes ks-slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes ks-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style> */}

      <div
        style={{
          display: 'flex',
          height: '100vh',
          fontFamily: 'Inter,sans-serif',
          background: 'transparent',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
       
        {/* ── Main area ── */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          

          {/* ── Page content ── */}
          <div
            style={{
              padding: contentPad,
              flex: 1,
              paddingBottom: isMobile ? '80px' : '28px',
            }}
          >
            {/* Welcome strip */}
            <Fade delay={0}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${T.slateMid} 0%, ${T.slate} 100%)`,
                  borderRadius: 10,
                  padding: isMobile ? '18px 20px' : '22px 28px',
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 16,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -30,
                    top: -30,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    border: '1px solid rgba(168,138,100,0.1)',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 10,
                      fontWeight: 600,
                      color: T.bronze,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    Good morning
                  </p>
                  <h2
                    style={{
                      fontFamily: 'Geist,sans-serif',
                      fontSize: isMobile ? 18 : 21,
                      fontWeight: 600,
                      color: T.white,
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}
                  >
                    Ramesh Kumar
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Inter,sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: T.bronzeLight, fontWeight: 600 }}>
                      2 bookings
                    </span>{' '}
                    today ·{' '}
                    <span style={{ color: T.bronzeLight, fontWeight: 600 }}>
                      1 pending
                    </span>{' '}
                    response
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    position: 'relative',
                  }}
                >
                  <button
                    className="ks-abtn"
                    style={{
                      background: T.bronze,
                      color: T.white,
                      border: 'none',
                      borderRadius: 6,
                      padding: '9px 18px',
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    View Bookings
                  </button>
                  <button
                    className="ks-abtn"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: T.white,
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 6,
                      padding: '9px 18px',
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 13,
                    }}
                  >
                    Edit Availability
                  </button>
                </div>
              </div>
            </Fade>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: statCols,
                gap: 12,
                marginBottom: 20,
              }}
            >
              {STATS.map((s, i) => (
                <StatCard key={s.label} stat={s} index={i} />
              ))}
            </div>

            {/* Mid row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: midCols,
                gap: 16,
                marginBottom: 20,
              }}
            >
              {/* Chart */}
              <Fade delay={0.05}>
                <div
                  ref={chartRef}
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: '22px 24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 12,
                          color: T.slateGray,
                        }}
                      >
                        Monthly Earnings
                      </p>
                      <p
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 26,
                          fontWeight: 600,
                          color: T.slate,
                          letterSpacing: '-0.02em',
                          marginTop: 3,
                        }}
                      >
                        ₹1,24,800
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['6M', '1Y', 'All'].map((f, i) => (
                        <button
                          key={f}
                          style={{
                            border:
                              i === 0
                                ? `1px solid ${T.bronze}`
                                : `1px solid ${T.border}`,
                            background: i === 0 ? T.bronzeLight : 'transparent',
                            color: i === 0 ? T.slateMid : T.slateGray,
                            borderRadius: 4,
                            padding: '4px 9px',
                            fontFamily: 'Geist,sans-serif',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      marginBottom: 16,
                    }}
                  >
                    <TrendUp />
                    <span
                      style={{
                        fontFamily: 'Geist,sans-serif',
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.green,
                      }}
                    >
                      +18.4%
                    </span>
                    <span
                      style={{
                        fontFamily: 'Inter,sans-serif',
                        fontSize: 12,
                        color: T.slateGray,
                      }}
                    >
                      vs previous period
                    </span>
                  </div>
                  <EarningsChart inView={chartInView} />
                </div>
              </Fade>

              {/* Activity — hidden on mobile to save space (shown in drawer) */}
              {!isMobile && (
                <Fade delay={0.1}>
                  <div
                    style={{
                      background: T.white,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: '22px 20px',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 18,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.slate,
                        }}
                      >
                        Recent Activity
                      </p>
                      <span
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 11,
                          color: T.bronze,
                          cursor: 'pointer',
                        }}
                      >
                        View all
                      </span>
                    </div>
                    {ACTIVITY.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start',
                          padding: '9px 0',
                          borderBottom:
                            i < ACTIVITY.length - 1
                              ? `1px solid ${T.border}`
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `${a.color}18`,
                              fontSize: 11,
                              flexShrink: 0,
                            }}
                          >
                            {a.icon}
                          </span>
                          {i < ACTIVITY.length - 1 && (
                            <div
                              style={{
                                width: 1,
                                flex: 1,
                                minHeight: 10,
                                background: T.border,
                                marginTop: 3,
                              }}
                            />
                          )}
                        </div>
                        <div style={{ paddingBottom: 6 }}>
                          <p
                            style={{
                              fontFamily: 'Inter,sans-serif',
                              fontSize: 12,
                              color: T.slate,
                              lineHeight: 1.5,
                            }}
                          >
                            {a.text}
                          </p>
                          <p
                            style={{
                              fontFamily: 'Inter,sans-serif',
                              fontSize: 11,
                              color: T.slateGray,
                              marginTop: 2,
                            }}
                          >
                            {a.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Fade>
              )}
            </div>

            {/* Bottom row: Bookings + Reviews */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: bottomCols,
                gap: 16,
              }}
            >
              {/* Bookings — table on desktop, cards on mobile/tablet */}
              <Fade delay={0.1}>
                <div
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '18px 20px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Geist,sans-serif',
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.slate,
                      }}
                    >
                      Upcoming Bookings
                    </p>
                    <button
                      className="ks-abtn"
                      style={{
                        background: T.bronzeLight,
                        color: T.slateMid,
                        border: 'none',
                        borderRadius: 5,
                        padding: '6px 12px',
                        fontFamily: 'Geist,sans-serif',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      + Add
                    </button>
                  </div>

                  {/* Desktop table */}
                  {!isMobile && !isTablet ? (
                    <>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '76px 1fr 1fr 120px 80px 90px',
                          padding: '9px 20px',
                          background: T.surface,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {[
                          'ID',
                          'Client',
                          'Service',
                          'Date & Time',
                          'Amount',
                          'Status',
                        ].map((h) => (
                          <span
                            key={h}
                            style={{
                              fontFamily: 'Geist,sans-serif',
                              fontSize: 10,
                              fontWeight: 600,
                              color: T.slateGray,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                      {BOOKINGS.map((b, i) => (
                        <div
                          key={b.id}
                          className="ks-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '76px 1fr 1fr 120px 80px 90px',
                            padding: '13px 20px',
                            alignItems: 'center',
                            borderBottom:
                              i < BOOKINGS.length - 1
                                ? `1px solid ${T.border}`
                                : 'none',
                            background: T.white,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Geist,sans-serif',
                              fontSize: 11,
                              fontWeight: 600,
                              color: T.bronze,
                            }}
                          >
                            {b.id}
                          </span>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Avatar initials={b.avatar} size={28} />
                            <span
                              style={{
                                fontFamily: 'Inter,sans-serif',
                                fontSize: 13,
                                color: T.slate,
                              }}
                            >
                              {b.client}
                            </span>
                          </div>
                          <span
                            style={{
                              fontFamily: 'Inter,sans-serif',
                              fontSize: 12,
                              color: T.slateGray,
                            }}
                          >
                            {b.service}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Inter,sans-serif',
                              fontSize: 12,
                              color: T.slateGray,
                            }}
                          >
                            {b.date}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Geist,sans-serif',
                              fontSize: 13,
                              fontWeight: 600,
                              color: T.slate,
                            }}
                          >
                            {b.amount}
                          </span>
                          <StatusPill status={b.status} />
                        </div>
                      ))}
                    </>
                  ) : (
                    /* Mobile/tablet: stacked cards */
                    <div style={{ padding: '12px' }}>
                      {BOOKINGS.map((b, i) => (
                        <BookingCard key={b.id} b={b} index={i} />
                      ))}
                    </div>
                  )}
                </div>
              </Fade>

              {/* Reviews */}
              <Fade delay={0.15}>
                <div
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '18px 20px 14px',
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 14,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.slate,
                        }}
                      >
                        Client Reviews
                      </p>
                      <span
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 11,
                          color: T.bronze,
                          cursor: 'pointer',
                        }}
                      >
                        See all 138
                      </span>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: 'Geist,sans-serif',
                            fontSize: 36,
                            fontWeight: 600,
                            color: T.slate,
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                          }}
                        >
                          4.92
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            marginTop: 5,
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              style={{ color: T.bronze, fontSize: 12 }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Inter,sans-serif',
                            fontSize: 10,
                            color: T.slateGray,
                            marginTop: 4,
                          }}
                        >
                          138 reviews
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[
                          [5, 88],
                          [4, 9],
                          [3, 2],
                          [2, 1],
                          [1, 0],
                        ].map(([star, pct]) => (
                          <div
                            key={star}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 7,
                              marginBottom: 5,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'Inter,sans-serif',
                                fontSize: 10,
                                color: T.slateGray,
                                width: 7,
                              }}
                            >
                              {star}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                height: 4,
                                background: T.border,
                                borderRadius: 2,
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  background: pct > 50 ? T.bronze : T.borderDim,
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {REVIEWS.map((r, i) => (
                    <div
                      key={r.name}
                      style={{
                        padding: '14px 20px',
                        borderBottom:
                          i < REVIEWS.length - 1
                            ? `1px solid ${T.border}`
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                          }}
                        >
                          <Avatar initials={r.avatar} size={28} />
                          <div>
                            <div
                              style={{
                                fontFamily: 'Geist,sans-serif',
                                fontSize: 13,
                                fontWeight: 600,
                                color: T.slate,
                              }}
                            >
                              {r.name}
                            </div>
                            <div
                              style={{ display: 'flex', gap: 1, marginTop: 2 }}
                            >
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                  key={s}
                                  style={{
                                    color: s <= r.rating ? T.bronze : T.border,
                                    fontSize: 10,
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: 'Inter,sans-serif',
                            fontSize: 11,
                            color: T.slateGray,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {r.date}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 12,
                          color: T.slateGray,
                          lineHeight: 1.6,
                        }}
                      >
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Fade>
            </div>

            <div style={{ height: 24 }} />
          </div>
        </main>
      </div>
    </>
  );
}
