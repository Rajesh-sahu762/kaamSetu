import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  IndianRupee,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import api from "@/services/api";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "1 year", value: 365 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
};

const cardStyle = {
  background: T.white,
  border: `1px solid ${T.border}`,
  borderRadius: 18,
  boxShadow: "0 2px 10px rgba(9, 20, 38, 0.025)",
};

const statusStyle = (status) => {
  const value = String(status || "pending").toLowerCase();
  if (["completed", "accepted", "approved"].includes(value)) {
    return { color: T.green, background: T.greenDim, label: value.replaceAll("_", " ") };
  }
  if (["cancelled", "rejected", "failed"].includes(value)) {
    return { color: T.red, background: T.redDim, label: value.replaceAll("_", " ") };
  }
  if (["in_progress", "on_the_way"].includes(value)) {
    return { color: T.blue, background: T.blueDim, label: value.replaceAll("_", " ") };
  }
  return { color: T.amber, background: T.amberDim, label: value.replaceAll("_", " ") };
};

const StatusBadge = ({ status }) => {
  const config = statusStyle(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: config.color,
        background: config.background,
        borderRadius: 999,
        padding: "5px 9px",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: config.color }} />
      {config.label}
    </span>
  );
};

const MetricCard = ({ icon: Icon, label, value, note, tone = T.bronze, softTone = "rgba(168, 138, 100, 0.12)" }) => (
  <article
    style={{
      ...cardStyle,
      padding: "18px 18px 16px",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <span style={{ color: T.slateGray, fontSize: 12, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          color: tone,
          background: softTone,
          flexShrink: 0,
        }}
      >
        <Icon size={17} strokeWidth={2.2} />
      </span>
    </div>
    <div>
      <div style={{ fontSize: 25, lineHeight: 1, fontWeight: 750, color: T.slate, letterSpacing: "-0.6px" }}>
        {value}
      </div>
      <div style={{ marginTop: 8, minHeight: 16, color: tone, fontSize: 11, fontWeight: 650 }}>{note}</div>
    </div>
  </article>
);

const Panel = ({ title, subtitle, action, children, style = {} }) => (
  <section style={{ ...cardStyle, padding: 20, minWidth: 0, ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
      <div>
        <h2 style={{ margin: 0, color: T.slate, fontSize: 15, lineHeight: 1.2, fontWeight: 750 }}>{title}</h2>
        {subtitle && <p style={{ margin: "5px 0 0", color: T.slateGray, fontSize: 11 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const EmptyState = ({ label }) => (
  <div
    style={{
      minHeight: 150,
      display: "grid",
      placeItems: "center",
      color: T.slateGray,
      fontSize: 12,
      textAlign: "center",
    }}
  >
    {label}
  </div>
);

const DashboardSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div className="admin-shimmer" style={{ height: 110, borderRadius: 20 }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="admin-shimmer" key={index} style={{ height: 142, borderRadius: 18 }} />
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
      <div className="admin-shimmer" style={{ height: 315, borderRadius: 18 }} />
      <div className="admin-shimmer" style={{ height: 315, borderRadius: 18 }} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async ({ background = false } = {}) => {
    try {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");

      const [statsResponse, chartsResponse, activityResponse] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get(`/admin/dashboard/charts?range=${range}`),
        api.get("/admin/dashboard/recent-activity"),
      ]);

      setData({
        stats: statsResponse.data.data,
        charts: chartsResponse.data.data,
        activity: activityResponse.data.data,
      });
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "We could not load the marketplace overview.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const dashboard = useMemo(() => data || { stats: {}, charts: {}, activity: {} }, [data]);
  const { stats, charts, activity } = dashboard;
  const categories = (charts.categoryPerformance || []).slice(0, 5);
  const cities = (charts.cityWiseBookings || []).slice(0, 5);
  const maximumCategoryBookings = Math.max(...categories.map((item) => item.totalBookings || 0), 1);
  const maximumCityBookings = Math.max(...cities.map((item) => item.count || 0), 1);
  const adminName = JSON.parse(localStorage.getItem("user") || "{}").fullName?.split(" ")[0] || "Admin";

  const metrics = [
    {
      icon: IndianRupee,
      label: "Marketplace revenue",
      value: formatCurrency(stats.totalRevenue),
      note: `${stats.monthlyGrowth > 0 ? "+" : ""}${stats.monthlyGrowth || 0}% vs. last month`,
    },
    {
      icon: ClipboardList,
      label: "Total bookings",
      value: formatNumber(stats.totalBookings),
      note: `${formatNumber(stats.ongoingServices)} services currently active`,
      tone: T.blue,
      softTone: T.blueDim,
    },
    {
      icon: Building2,
      label: "Active vendors",
      value: formatNumber(stats.activeVendors),
      note: `${formatNumber(stats.pendingVendorApprovals)} awaiting review`,
      tone: T.amber,
      softTone: T.amberDim,
    },
    {
      icon: Users,
      label: "Active customers",
      value: formatNumber(stats.activeCustomers),
      note: `${formatNumber(stats.completedServices)} services completed`,
      tone: T.green,
      softTone: T.greenDim,
    },
    {
      icon: ShieldCheck,
      label: "Platform commission",
      value: formatCurrency(stats.platformCommission),
      note: `${formatNumber(stats.cancelledBookings)} cancelled bookings`,
      tone: T.slateMid,
      softTone: T.surfaceLow,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: T.ivory,
        padding: isMobile ? "16px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px",
        fontFamily: "Geist, Inter, system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes adminShimmer { 100% { transform: translateX(100%); } }
        .admin-shimmer { background: #ece8e2; position: relative; overflow: hidden; }
        .admin-shimmer::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.62), transparent); animation: adminShimmer 1.35s infinite; }
        .admin-refresh:hover { background: ${T.slateMid} !important; transform: translateY(-1px); }
        .admin-range:hover { color: ${T.slate} !important; }
      `}</style>

      {loading && !data ? (
        <DashboardSkeleton />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1540, margin: "0 auto" }}>
          <header
            style={{
              ...cardStyle,
              padding: isMobile ? 18 : "21px 24px",
              background: `linear-gradient(112deg, ${T.slate} 0%, #162945 64%, #2d405c 100%)`,
              border: "none",
              color: T.white,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", width: 240, height: 240, right: -80, top: -132, borderRadius: "50%", background: "rgba(254, 218, 175, 0.12)" }} />
            <div style={{ position: "absolute", width: 120, height: 120, right: 98, bottom: -90, borderRadius: "50%", background: "rgba(168, 138, 100, 0.22)" }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 18, flexDirection: isMobile ? "column" : "row" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: T.bronzeLight, fontSize: 11, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 0 4px ${T.greenDim}` }} />
                  Live marketplace pulse
                </div>
                <h1 style={{ fontSize: isMobile ? 24 : 30, margin: "10px 0 6px", letterSpacing: "-0.8px", lineHeight: 1.1 }}>Good to see you, {adminName}.</h1>
                <p style={{ margin: 0, color: "rgba(255,255,255,.68)", fontSize: 13 }}>A clear view of KaamSetu’s marketplace performance.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "rgba(255,255,255,.58)", fontSize: 11 }}>
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                </span>
                <button
                  type="button"
                  className="admin-refresh"
                  onClick={() => loadDashboard({ background: true })}
                  disabled={refreshing}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid rgba(255,255,255,.18)", borderRadius: 9,
                    background: "rgba(255,255,255,.11)", color: T.white, cursor: refreshing ? "wait" : "pointer", padding: "9px 11px", fontSize: 12, fontWeight: 650,
                    transition: "0.2s ease", opacity: refreshing ? 0.7 : 1,
                  }}
                >
                  <RefreshCw size={14} style={{ animation: refreshing ? "adminShimmer 1s linear infinite" : "none" }} />
                  Refresh
                </button>
              </div>
            </div>
          </header>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid rgba(239,68,68,.22)`, background: T.redDim, borderRadius: 12, padding: "12px 14px", color: T.red, fontSize: 13 }}>
              <CircleAlert size={17} />
              <span>{error}</span>
            </div>
          )}

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: 12 }}>
            {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </section>

          <section style={{ display: "grid", gridTemplateColumns: isTablet || isMobile ? "1fr" : "minmax(0, 1.25fr) minmax(320px, .75fr)", gap: 16 }}>
            <Panel
              title="Revenue performance"
              subtitle="Completed transaction value over the selected period"
              action={
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 3, background: T.surfaceLow, borderRadius: 9 }}>
                  {RANGE_OPTIONS.map((option) => (
                    <button key={option.value} type="button" className="admin-range" onClick={() => setRange(option.value)} style={{ border: 0, borderRadius: 7, cursor: "pointer", padding: "6px 8px", background: range === option.value ? T.white : "transparent", color: range === option.value ? T.slate : T.slateGray, boxShadow: range === option.value ? "0 1px 3px rgba(9,20,38,.08)" : "none", fontSize: 10, fontWeight: 700 }}>
                      {option.label}
                    </button>
                  ))}
                </div>
              }
            >
              {(charts.revenueTrend || []).length ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={charts.revenueTrend} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                    <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={T.bronze} stopOpacity={.22} /><stop offset="100%" stopColor={T.bronze} stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke={T.border} strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fill: T.slateGray, fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis tick={{ fill: T.slateGray, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} labelStyle={{ color: T.slate, fontWeight: 700 }} contentStyle={{ border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12, boxShadow: "0 8px 20px rgba(9,20,38,.1)" }} />
                    <Line type="monotone" dataKey="revenue" stroke={T.bronze} strokeWidth={2.7} dot={false} activeDot={{ r: 5, fill: T.bronze, stroke: T.white, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyState label="Revenue will appear after completed payments are recorded." />}
            </Panel>

            <Panel title="Bookings pulse" subtitle="Demand created across the marketplace">
              {(charts.bookingTrend || []).length ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={charts.bookingTrend} margin={{ top: 6, right: 2, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke={T.border} strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fill: T.slateGray, fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={26} />
                    <YAxis allowDecimals={false} tick={{ fill: T.slateGray, fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => [formatNumber(value), "Bookings"]} labelStyle={{ color: T.slate, fontWeight: 700 }} contentStyle={{ border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12, boxShadow: "0 8px 20px rgba(9,20,38,.1)" }} cursor={{ fill: T.surfaceLow }} />
                    <Bar dataKey="count" fill={T.slateMid} radius={[5, 5, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyState label="Bookings will appear here as customers start scheduling services." />}
            </Panel>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: isTablet || isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <Panel title="Top service categories" subtitle="Ranked by completed service volume">
              {categories.length ? categories.map((category, index) => (
                <div key={category._id || category.name || index} style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr) auto", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: index === categories.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <span style={{ color: T.slateGray, fontSize: 11, fontWeight: 750 }}>0{index + 1}</span>
                  <div style={{ minWidth: 0 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7, color: T.slate, fontSize: 12, fontWeight: 650 }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{category._id || "Uncategorised"}</span></div><div style={{ height: 5, borderRadius: 999, background: T.surfaceLow, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: "inherit", background: T.bronze, width: `${((category.totalBookings || 0) / maximumCategoryBookings) * 100}%` }} /></div></div>
                  <span style={{ color: T.slate, fontSize: 12, fontWeight: 750 }}>{formatNumber(category.totalBookings)}</span>
                </div>
              )) : <EmptyState label="Category performance will be calculated once services receive bookings." />}
            </Panel>

            <Panel title="Demand by city" subtitle="Top locations in the selected period">
              {cities.length ? cities.map((city, index) => (
                <div key={city._id || index} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr) auto", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: index === cities.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <MapPin size={15} color={T.blue} />
                  <div style={{ minWidth: 0 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7, color: T.slate, fontSize: 12, fontWeight: 650 }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{city._id || "Unspecified"}</span></div><div style={{ height: 5, borderRadius: 999, background: T.surfaceLow, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: "inherit", background: T.blue, width: `${((city.count || 0) / maximumCityBookings) * 100}%` }} /></div></div>
                  <span style={{ color: T.slate, fontSize: 12, fontWeight: 750 }}>{formatNumber(city.count)}</span>
                </div>
              )) : <EmptyState label="City performance will appear as booking activity is recorded." />}
            </Panel>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Panel title="Vendor approvals" subtitle="Latest providers waiting for review" action={<span style={{ color: T.amber, background: T.amberDim, padding: "5px 8px", borderRadius: 999, fontSize: 10, fontWeight: 750 }}>{formatNumber(stats.pendingVendorApprovals)} pending</span>}>
              {(activity.newVendors || []).length ? activity.newVendors.map((vendor, index) => (
                <div key={vendor._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: index === activity.newVendors.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, color: T.bronze, background: "rgba(168, 138, 100, .12)", fontSize: 12, fontWeight: 800 }}>{vendor.businessName?.slice(0, 1)?.toUpperCase() || "V"}</span>
                  <div style={{ minWidth: 0, flex: 1 }}><div style={{ color: T.slate, fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vendor.businessName}</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vendor.userId?.email || "No email available"}</div></div>
                  <span style={{ color: T.slateGray, fontSize: 10 }}>{formatDate(vendor.createdAt)}</span>
                </div>
              )) : <EmptyState label="No vendors are waiting for approval." />}
            </Panel>

            <Panel title="Recent bookings" subtitle="Most recently placed customer requests" action={<CalendarCheck2 size={17} color={T.bronze} />}>
              {(activity.newBookings || []).length ? activity.newBookings.map((booking, index) => (
                <div key={booking._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: index === activity.newBookings.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, color: T.blue, background: T.blueDim }}><ClipboardList size={16} /></span>
                  <div style={{ minWidth: 0, flex: 1 }}><div style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{booking.bookingNumber || "New booking"}</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.customerId?.fullName || "Customer"} <span style={{ color: T.borderDim }}>→</span> {booking.vendorId?.businessName || "Vendor"}</div></div>
                  <StatusBadge status={booking.status} />
                </div>
              )) : <EmptyState label="No bookings have been created yet." />}
            </Panel>

            <Panel title="Latest reviews" subtitle="Recent feedback from customers" action={<Star size={17} fill={T.amber} color={T.amber} />}>
              {(activity.recentReviews || []).length ? activity.recentReviews.map((review, index) => (
                <div key={review._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: index === activity.recentReviews.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <span style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, color: T.amber, background: T.amberDim, fontSize: 11, fontWeight: 800 }}>{review.rating || 0}</span>
                  <div style={{ minWidth: 0, flex: 1 }}><div style={{ color: T.slate, fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{review.vendorId?.businessName || "Vendor review"}</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 11 }}>{review.customerId?.fullName || "Customer"} · {formatDate(review.createdAt)}</div></div>
                  <CheckCircle2 size={16} color={T.green} />
                </div>
              )) : <EmptyState label="Customer reviews will appear here." />}
            </Panel>
          </section>

          <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, color: T.slateGray, fontSize: 11, padding: "0 4px" }}>
            <span>Data refreshes from the KaamSetu admin API.</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: T.slate }}><TrendingUp size={13} color={T.green} /> Live operational overview <ArrowUpRight size={12} /></span>
          </footer>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
