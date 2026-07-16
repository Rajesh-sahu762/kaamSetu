import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,    
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

const API_BASE = import.meta.env.VITE_API_URL ;

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const StatCard = ({ label, value, sub, accent }) => (
  <div
    style={{
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 0,
    }}
  >
    <span style={{ fontSize: 12, color: T.slateGray, fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 22, color: T.slate, fontWeight: 700, letterSpacing: -0.3 }}>
      {value}
    </span>
    {sub && (
      <span style={{ fontSize: 12, fontWeight: 600, color: accent || T.slateGray }}>{sub}</span>
    )}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div
    style={{
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 18,
    }}
  >
    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.slate, marginBottom: 14 }}>{title}</h3>
    {children}
  </div>
);

const AdminDashboard = () => {
  const { isMobile } = useBreakpoint();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        setLoading(true);
        const [statsRes, chartsRes, activityRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/dashboard/stats`, { headers }),
          axios.get(`${API_BASE}/admin/dashboard/charts?range=30`, { headers }),
          axios.get(`${API_BASE}/admin/dashboard/recent-activity`, { headers }),
        ]);
        setStats(statsRes.data.data);
        setCharts(chartsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, color: T.slateGray, fontSize: 14 }}>Loading dashboard…</div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          margin: 24,
          padding: 16,
          background: T.redDim,
          color: T.red,
          borderRadius: 10,
          fontSize: 14,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 14 : 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: T.slate }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: T.slateGray, marginTop: 2 }}>
          Marketplace overview — last 30 days
        </p>
      </div>

      {/* Overview cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard label="Total Revenue" value={fmtCurrency(stats.totalRevenue)} />
        <StatCard label="Platform Commission" value={fmtCurrency(stats.platformCommission)} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
        <StatCard label="Ongoing Services" value={stats.ongoingServices} accent={T.blue} />
        <StatCard label="Completed Services" value={stats.completedServices} accent={T.green} />
        <StatCard label="Cancelled Bookings" value={stats.cancelledBookings} accent={T.red} />
        <StatCard label="Active Vendors" value={stats.activeVendors} />
        <StatCard label="Active Customers" value={stats.activeCustomers} />
        <StatCard
          label="Pending Vendor Approvals"
          value={stats.pendingVendorApprovals}
          accent={stats.pendingVendorApprovals > 0 ? T.amber : T.green}
        />
        <StatCard
          label="Monthly Growth"
          value={`${stats.monthlyGrowth > 0 ? "+" : ""}${stats.monthlyGrowth}%`}
          accent={stats.monthlyGrowth >= 0 ? T.green : T.red}
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14,
        }}
      >
        <SectionCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.revenueTrend}>
              <CartesianGrid stroke={T.border} vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: T.slateGray }} hide={isMobile} />
              <YAxis tick={{ fontSize: 10, fill: T.slateGray }} width={40} />
              <Tooltip
                formatter={(v) => fmtCurrency(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={T.bronze}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Booking Trend">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.bookingTrend}>
              <CartesianGrid stroke={T.border} vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: T.slateGray }} hide={isMobile} />
              <YAxis tick={{ fontSize: 10, fill: T.slateGray }} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} />
              <Bar dataKey="count" fill={T.slate} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Recent activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: 14,
        }}
      >
        <SectionCard title="Pending Vendor Approvals">
          {activity.newVendors.length === 0 ? (
            <p style={{ fontSize: 13, color: T.slateGray }}>No pending vendors right now.</p>
          ) : (
            activity.newVendors.map((v) => (
              <div
                key={v._id}
                style={{
                  padding: "8px 0",
                  borderBottom: `1px solid ${T.border}`,
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600, color: T.slate }}>{v.businessName}</div>
                <div style={{ color: T.slateGray, fontSize: 12 }}>{v.userId?.email}</div>
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Recent Bookings">
          {activity.newBookings.map((b) => (
            <div
              key={b._id}
              style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}
            >
              <div style={{ fontWeight: 600, color: T.slate }}>{b.bookingNumber}</div>
              <div style={{ color: T.slateGray, fontSize: 12 }}>
                {b.customerId?.fullName} → {b.vendorId?.businessName} · {b.status}
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Recent Reviews">
          {activity.recentReviews.map((r) => (
            <div
              key={r._id}
              style={{ padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}
            >
              <div style={{ fontWeight: 600, color: T.slate }}>
                {r.vendorId?.businessName} · {"★".repeat(r.rating)}
              </div>
              <div style={{ color: T.slateGray, fontSize: 12 }}>{r.customerId?.fullName}</div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboard;