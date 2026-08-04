import Sidebar from '@/components/vendor/sidebar';
import Topbar from '@/components/vendor/topbar';
import Fade from '@/components/common/Fade';
import Avatar from '@/components/common/Avatar';
import StatusPill from '@/components/common/StatusPill';

import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getVendorProfile,
  getVendorBookings,
  getVendorReviews,
  getVendorEarnings,
} from '@/services/vendorService';

/* ── Helpers ───────────────────────────────────────────────────── */
// Same "N days ago" convention already used for review dates in
// components/client/expertProfile/ExpertReview.jsx — repeated here
// (no shared util module exists in this codebase to import it from).
const formatRelative = (dateString) => {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return `${Math.floor(diffDays / 30)} month(s) ago`;
};

// Same `new Date(...).toLocaleDateString()` convention used for dates
// elsewhere (e.g. pages/Vendor/Bookings.jsx), extended to show
// Today/Tomorrow for near-term bookings plus the booking's time slot.
const formatBookingWhen = (dateString, time) => {
  if (!dateString) return time || '-';
  const d = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const dayLabel = sameDay(d, today)
    ? 'Today'
    : sameDay(d, tomorrow)
      ? 'Tomorrow'
      : d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return time ? `${dayLabel}, ${time}` : dayLabel;
};

// Same initials-from-fullName convention already used in
// pages/Vendor/Bookings.jsx and pages/Vendor/Reviews.jsx.
const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// Same `₹${value.toLocaleString()}` convention already used in
// pages/Vendor/Profile.jsx and pages/Vendor/Earnings.jsx.
const formatCurrency = (n) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;

// Same month-name lookup already used in pages/Vendor/Earnings.jsx to
// turn the API's numeric `monthName` (1-12) into a short label.
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const ACTIVE_BOOKING_STATUSES = ['pending', 'accepted', 'in_progress', 'on_the_way'];

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
        {stat.delta && (stat.up ? <TrendUp /> : <TrendDown />)}
        {stat.delta && (
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
        )}
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
function EarningsChart({ inView, bars }) {
  if (!bars || bars.length === 0) {
    return (
      <div
        style={{
          height: 72,
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: T.slateGray,
        }}
      >
        No earnings yet
      </div>
    );
  }
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
      {bars.map((b, i) => (
        <div
          key={`${b.month}-${i}`}
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
              background: i === bars.length - 1 ? T.bronze : T.border,
              height: inView ? `${b.value * 0.56}px` : '0px',
              transition: `height 0.6s cubic-bezier(.22,1,.36,1) ${i * 0.07}s`,
              position: 'relative',
            }}
          >
            {i === bars.length - 1 && (
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
                This month
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
  const navigate = useNavigate();

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

  /* ── Real data ────────────────────────────────────────────────── */
  const [profile, setProfile] = useState(null);
  const [bookingsRes, setBookingsRes] = useState(null);
  const [reviewsRes, setReviewsRes] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthsFilter, setMonthsFilter] = useState(6); // 6M / 1Y('12') / All(0 = no cap)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, bookingsData, reviewsData, earningsRes] = await Promise.all([
          getVendorProfile(),
          getVendorBookings({ page: 1, limit: 20, sort: 'newest' }),
          getVendorReviews({ page: 1, limit: 3 }),
          getVendorEarnings(),
        ]);

        if (profileRes?.success) setProfile(profileRes.data);
        if (bookingsData?.success) setBookingsRes(bookingsData);
        if (reviewsData?.success) setReviewsRes(reviewsData);
        if (earningsRes?.success) setEarnings(earningsRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const user = profile?.user;
  const vendor = profile?.vendor;
  const stats = profile?.stats;

  const bookingList = bookingsRes?.data || [];
  const bookingStats = bookingsRes?.stats || {};
  const activeBookingsCount =
    (bookingStats.pending || 0) + (bookingStats.accepted || 0) + (bookingStats.inProgress || 0);

  const bookingsToday = bookingList.filter(
    (b) => new Date(b.bookingDate).toDateString() === new Date().toDateString(),
  ).length;

  // "Upcoming" = not yet finished, soonest first — the bookings API itself
  // has no dedicated "upcoming" filter, so this reuses the same
  // newest-sorted list already fetched above and re-sorts client-side.
  const upcomingBookings = [...bookingList]
    .filter((b) => ACTIVE_BOOKING_STATUSES.includes(b.status))
    .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
    .slice(0, 5)
    .map((b) => ({
      id: b.bookingNumber,
      client: b.customerId?.fullName || 'Customer',
      service: b.serviceId?.serviceName || 'Service',
      date: formatBookingWhen(b.bookingDate, b.bookingTime),
      amount: formatCurrency(b.totalAmount),
      status: b.status,
      avatar: initialsOf(b.customerId?.fullName || 'C'),
      _createdAt: b.createdAt,
    }));

  const reviewStats = reviewsRes?.stats || {};
  const reviewsList = (reviewsRes?.data || []).map((r) => ({
    name: r.customerId?.fullName || 'Customer',
    rating: r.rating,
    text: r.review || '',
    date: formatRelative(r.createdAt),
    avatar: initialsOf(r.customerId?.fullName || 'C'),
    _createdAt: r.createdAt,
  }));
  const ratingDistribution = reviewStats.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const ratingTotal = Object.values(ratingDistribution).reduce((a, b) => a + b, 0) || 1;

  const monthlyAnalytics = earnings?.monthlyAnalytics || [];
  const visibleMonths =
    monthsFilter === 0 ? monthlyAnalytics : monthlyAnalytics.slice(-monthsFilter);
  const maxEarnings = Math.max(...visibleMonths.map((m) => m.earnings), 1);
  const earningsBars = visibleMonths.map((m) => ({
    month: MONTH_NAMES[m.monthName - 1] || '',
    value: Math.round((m.earnings / maxEarnings) * 100),
  }));

  // Delta vs the previous month — only shown when there are at least two
  // months of real data to compare, so nothing is ever guessed.
  let earningsDelta = null;
  if (monthlyAnalytics.length >= 2) {
    const last = monthlyAnalytics[monthlyAnalytics.length - 1].earnings;
    const prev = monthlyAnalytics[monthlyAnalytics.length - 2].earnings;
    if (prev > 0) {
      const pct = ((last - prev) / prev) * 100;
      earningsDelta = { up: pct >= 0, label: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%` };
    }
  }

  const STATS = [
    {
      label: 'Total Earnings',
      value: formatCurrency(stats?.totalEarnings),
      delta: earningsDelta?.label,
      up: earningsDelta?.up,
      sub: earningsDelta ? 'vs last month' : 'all-time',
      icon: '₹',
    },
    {
      label: 'Active Bookings',
      value: String(activeBookingsCount),
      sub: `${bookingStats.pending || 0} pending response${(bookingStats.pending || 0) === 1 ? '' : 's'}`,
      icon: '📋',
    },
    {
      label: 'Avg. Rating',
      value: stats?.averageRating ? stats.averageRating.toFixed(2) : '0.00',
      sub: `${stats?.totalReviews || 0} reviews`,
      icon: '★',
    },
    {
      label: 'Business Health',
      value: `${stats?.businessHealth || 0}%`,
      sub: 'profile completion score',
      icon: '✓',
    },
  ];

  // Recent activity feed: merges real records from the three sources
  // already fetched above (recent transactions, recent reviews, recent
  // bookings) into one timeline, sorted by when they actually happened —
  // there is no dedicated activity-log API in the backend.
  const activityItems = [
    ...(earnings?.recentTransactions || []).map((t) => ({
      icon: '₹',
      color: T.blue,
      text: `Payment of ${formatCurrency(t.amount)} received from ${t.customerName}`,
      time: formatRelative(t.createdAt),
      _at: t.createdAt,
    })),
    ...reviewsList.map((r) => ({
      icon: '★',
      color: T.bronze,
      text: `New ${r.rating}-star review from ${r.name}`,
      time: r.date,
      _at: r._createdAt,
    })),
    ...bookingList.slice(0, 5).map((b) => ({
      icon: b.status === 'completed' ? '✓' : '📋',
      color: b.status === 'completed' ? T.green : T.amber,
      text: `Booking ${b.bookingNumber} is ${b.status.replace('_', ' ')}`,
      time: formatRelative(b.updatedAt || b.createdAt),
      _at: b.updatedAt || b.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b._at) - new Date(a._at))
    .slice(0, 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (loading) {
    return <h2 style={{ padding: 28, fontFamily: 'Inter,sans-serif' }}>Loading...</h2>;
  }

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
                    {greeting}
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
                    {user?.fullName || vendor?.businessName || 'Vendor'}
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
                      {bookingsToday} booking{bookingsToday === 1 ? '' : 's'}
                    </span>{' '}
                    today ·{' '}
                    <span style={{ color: T.bronzeLight, fontWeight: 600 }}>
                      {bookingStats.pending || 0} pending
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
                    onClick={() => navigate('/vendor/bookings')}
                    style={{
                      background: T.bronze,
                      color: T.white,
                      border: 'none',
                      borderRadius: 6,
                      padding: '9px 18px',
                      fontFamily: 'Geist,sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
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
                        {formatCurrency(earnings?.thisMonthEarnings)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[
                        { label: '6M', value: 6 },
                        { label: '1Y', value: 12 },
                        { label: 'All', value: 0 },
                      ].map((f) => (
                        <button
                          key={f.label}
                          onClick={() => setMonthsFilter(f.value)}
                          style={{
                            border:
                              monthsFilter === f.value
                                ? `1px solid ${T.bronze}`
                                : `1px solid ${T.border}`,
                            background: monthsFilter === f.value ? T.bronzeLight : 'transparent',
                            color: monthsFilter === f.value ? T.slateMid : T.slateGray,
                            borderRadius: 4,
                            padding: '4px 9px',
                            fontFamily: 'Geist,sans-serif',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {earningsDelta && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        marginBottom: 16,
                      }}
                    >
                      {earningsDelta.up ? <TrendUp /> : <TrendDown />}
                      <span
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 12,
                          fontWeight: 600,
                          color: earningsDelta.up ? T.green : T.red,
                        }}
                      >
                        {earningsDelta.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 12,
                          color: T.slateGray,
                        }}
                      >
                        vs previous month
                      </span>
                    </div>
                  )}
                  <EarningsChart inView={chartInView} bars={earningsBars} />
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
                    {activityItems.length === 0 ? (
                      <p
                        style={{
                          fontFamily: 'Inter,sans-serif',
                          fontSize: 12,
                          color: T.slateGray,
                          padding: '8px 0',
                        }}
                      >
                        No recent activity yet.
                      </p>
                    ) : (
                      activityItems.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start',
                          padding: '9px 0',
                          borderBottom:
                            i < activityItems.length - 1
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
                          {i < activityItems.length - 1 && (
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
                      ))
                    )}
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
                      onClick={() => navigate('/vendor/bookings')}
                      style={{
                        background: T.bronzeLight,
                        color: T.slateMid,
                        border: 'none',
                        borderRadius: 5,
                        padding: '6px 12px',
                        fontFamily: 'Geist,sans-serif',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      View All
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
                      {upcomingBookings.length === 0 ? (
                        <div
                          style={{
                            padding: '20px',
                            fontFamily: 'Inter,sans-serif',
                            fontSize: 12,
                            color: T.slateGray,
                          }}
                        >
                          No upcoming bookings.
                        </div>
                      ) : (
                      upcomingBookings.map((b, i) => (
                        <div
                          key={b.id}
                          className="ks-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '76px 1fr 1fr 120px 80px 90px',
                            padding: '13px 20px',
                            alignItems: 'center',
                            borderBottom:
                              i < upcomingBookings.length - 1
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
                      ))
                      )}
                    </>
                  ) : (
                    /* Mobile/tablet: stacked cards */
                    <div style={{ padding: '12px' }}>
                      {upcomingBookings.length === 0 ? (
                        <p
                          style={{
                            fontFamily: 'Inter,sans-serif',
                            fontSize: 12,
                            color: T.slateGray,
                            padding: '8px 4px',
                          }}
                        >
                          No upcoming bookings.
                        </p>
                      ) : (
                        upcomingBookings.map((b, i) => (
                          <BookingCard key={b.id} b={b} index={i} />
                        ))
                      )}
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
                        onClick={() => navigate('/vendor/reviews')}
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 11,
                          color: T.bronze,
                          cursor: 'pointer',
                        }}
                      >
                        See all {reviewStats.totalReviews || 0}
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
                          {reviewStats.averageRating || '0.0'}
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
                          {reviewStats.totalReviews || 0} reviews
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingDistribution[star] || 0;
                          const pct = Math.round((count / ratingTotal) * 100);
                          return (
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
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {reviewsList.length === 0 ? (
                    <p
                      style={{
                        fontFamily: 'Inter,sans-serif',
                        fontSize: 12,
                        color: T.slateGray,
                        padding: '14px 20px',
                      }}
                    >
                      No reviews yet.
                    </p>
                  ) : (
                  reviewsList.map((r, i) => (
                    <div
                      key={r.name}
                      style={{
                        padding: '14px 20px',
                        borderBottom:
                          i < reviewsList.length - 1
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
                  ))
                  )}
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