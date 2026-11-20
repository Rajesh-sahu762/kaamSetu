import {
  User, Mail, Phone, Bell, BookOpen, Shield, LogOut, Edit,
  CheckCircle2, Clock3, X, ArrowUpRight, ArrowRight, CalendarCheck,
  Activity, BadgeCheck, Sparkles, MapPin, TrendingUp,
} from "lucide-react";
import { AuthContext } from "@/context/authContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getImageUrl } from "@/utils/imageUrl";
import {
  getCustomerProfile,
  updateCustomerProfile,
  getMyBookings,
} from "@/services/customerService";
import "./CustomerProfilePage.css";

const ACTIVE_STATUSES = ["pending", "accepted", "on_the_way", "in_progress"];

const CustomerProfilePage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ fullName: "", mobile: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, bookingsResponse] = await Promise.all([
          getCustomerProfile(),
          getMyBookings({ limit: 50 }),
        ]);
        if (profileResponse.success) {
          setProfile(profileResponse.data);
          setEditValues({
            fullName: profileResponse.data.fullName || "",
            mobile: profileResponse.data.mobile || "",
          });
        }
        if (bookingsResponse.success) setBookings(bookingsResponse.data);
      } catch (err) {
        toast.error("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSaveProfile = async () => {
    if (!editValues.fullName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      const response = await updateCustomerProfile(editValues);
      if (response.success) {
        setProfile((prev) => ({ ...prev, ...response.data }));
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const cancelledBookings = bookings.filter((b) => ["cancelled", "rejected"].includes(b.status)).length;
  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  const ACTIVITY_LABELS = {
    pending: "Booking Placed",
    accepted: "Booking Accepted",
    on_the_way: "Expert On The Way",
    in_progress: "Service Started",
    completed: "Booking Completed",
    cancelled: "Booking Cancelled",
    rejected: "Booking Rejected",
  };

  if (loading) {
    return (
      <section className="ks-customer-dashboard ks-customer-dashboard--loading">
        <div className="ks-dashboard-shell">
          <div className="ks-dashboard-skeleton ks-dashboard-skeleton--hero" />
          <div className="ks-dashboard-skeleton-grid">{[1, 2, 3, 4].map((item) => <div className="ks-dashboard-skeleton" key={item} />)}</div>
          <div className="ks-dashboard-skeleton ks-dashboard-skeleton--body" />
        </div>
      </section>
    );
  }

  return (
    <main className="ks-customer-dashboard">
      <div className="ks-dashboard-decoration ks-dashboard-decoration--one" aria-hidden="true" />
      <div className="ks-dashboard-decoration ks-dashboard-decoration--two" aria-hidden="true" />
      <div className="ks-dashboard-shell">
        <motion.header
          className="ks-dashboard-welcome"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
        >
          <div>
            <span className="ks-dashboard-eyebrow"><Sparkles size={14} /> YOUR KAAMSETU SPACE</span>
            <h1>Good to see you, <span>{profile?.fullName?.split(" ")[0] || "there"}.</span></h1>
            <p>Here’s what’s happening with your home services.</p>
          </div>
          <button type="button" className="ks-dashboard-browse" onClick={() => navigate("/services")}>
            Book a service <ArrowUpRight size={18} />
          </button>
        </motion.header>

        <motion.section
          className="ks-dashboard-profile"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, delay: .06 }}
        >
          <div className="ks-dashboard-profile__glow" aria-hidden="true" />
          <div className="ks-dashboard-avatar-wrap">
            {profile?.profileImage ? (
              <img src={getImageUrl(profile.profileImage, "profile")} alt={profile.fullName} className="ks-dashboard-avatar" />
            ) : (
              <div className="ks-dashboard-avatar ks-dashboard-avatar--fallback">{profile?.fullName?.[0]?.toUpperCase() || "?"}</div>
            )}
            <span className="ks-dashboard-avatar-check"><CheckCircle2 size={16} /></span>
          </div>
          <div className="ks-dashboard-profile__info">
            <span className="ks-dashboard-verified"><BadgeCheck size={15} /> VERIFIED CUSTOMER</span>
            {isEditing ? (
              <div className="ks-dashboard-edit-fields">
                <input type="text" value={editValues.fullName} onChange={(e) => setEditValues((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Full Name" aria-label="Full name" />
                <input type="text" value={editValues.mobile} onChange={(e) => setEditValues((prev) => ({ ...prev, mobile: e.target.value }))} placeholder="Mobile Number" aria-label="Mobile number" />
              </div>
            ) : (
              <>
                <h2>{profile?.fullName}</h2>
                <div className="ks-dashboard-profile__meta">
                  <span><Mail size={15} />{profile?.email}</span>
                  <span><Phone size={15} />{profile?.mobile || "No mobile number added"}</span>
                </div>
              </>
            )}
          </div>
          <div className="ks-dashboard-profile__actions">
            {isEditing ? (
              <>
                <button type="button" className="ks-dashboard-button ks-dashboard-button--primary" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save changes"} <CheckCircle2 size={17} /></button>
                <button type="button" className="ks-dashboard-button ks-dashboard-button--quiet" onClick={() => { setIsEditing(false); setEditValues({ fullName: profile?.fullName || "", mobile: profile?.mobile || "" }); }} aria-label="Cancel editing"><X size={18} /></button>
              </>
            ) : (
              <button type="button" className="ks-dashboard-button ks-dashboard-button--outline" onClick={() => setIsEditing(true)}><Edit size={16} /> Edit profile</button>
            )}
          </div>
        </motion.section>

        <section className="ks-dashboard-stats" aria-label="Booking overview">
          <StatCard icon={<BookOpen size={20} />} number={totalBookings} title="Total bookings" note="All your requests" tone="green" index={0} />
          <StatCard icon={<Activity size={20} />} number={activeBookings} title="Active bookings" note="Currently in progress" tone="lime" index={1} />
          <StatCard icon={<CheckCircle2 size={20} />} number={completedBookings} title="Completed" note="Services finished" tone="blue" index={2} />
          <StatCard icon={<X size={20} />} number={cancelledBookings} title="Cancelled" note="Cancelled or rejected" tone="amber" index={3} />
        </section>

        <section className="ks-dashboard-section">
          <div className="ks-dashboard-section-heading">
            <div><span className="ks-dashboard-kicker">MADE FOR YOU</span><h2>Your shortcuts</h2></div>
            <span className="ks-dashboard-section-caption">Everything you need, one tap away</span>
          </div>
          <div className="ks-dashboard-shortcuts">
            <QuickAction icon={<CalendarCheck size={21} />} title="My bookings" description="View and track services" onClick={() => navigate("/my-booking")} />
            <QuickAction icon={<Bell size={21} />} title="Notifications" description="Stay in the loop" onClick={() => navigate("/notifications")} />
            <QuickAction icon={<Shield size={21} />} title="Help & support" description="We’re here to help" onClick={() => navigate("/support")} />
            <QuickAction icon={<User size={21} />} title="Find an expert" description="Explore trusted professionals" onClick={() => navigate("/experts")} />
          </div>
        </section>

        <section className="ks-dashboard-lower">
          <div className="ks-dashboard-panel ks-dashboard-personal">
            <div className="ks-dashboard-panel-heading">
              <div><span className="ks-dashboard-kicker">YOUR DETAILS</span><h2>Personal information</h2></div>
              <span className="ks-dashboard-panel-icon"><User size={19} /></span>
            </div>
            <div className="ks-dashboard-info-list">
              <InfoRow icon={<User size={17} />} label="Full name" value={profile?.fullName || "Not added"} />
              <InfoRow icon={<Mail size={17} />} label="Email address" value={profile?.email || "Not added"} />
              <InfoRow icon={<Phone size={17} />} label="Mobile number" value={profile?.mobile || "Not added"} />
            </div>
            <button type="button" className="ks-dashboard-text-link" onClick={() => setIsEditing(true)}>Update your details <ArrowRight size={16} /></button>
          </div>

          <div className="ks-dashboard-panel ks-dashboard-activity">
            <div className="ks-dashboard-panel-heading">
              <div><span className="ks-dashboard-kicker">THE LATEST</span><h2>Recent activity</h2></div>
              <span className="ks-dashboard-panel-icon"><Clock3 size={19} /></span>
            </div>
            {recentActivity.length === 0 ? (
              <div className="ks-dashboard-empty">
                <span><CalendarCheck size={23} /></span>
                <strong>Your journey starts here</strong>
                <p>Your booking updates will appear here once you book a service.</p>
                <button type="button" onClick={() => navigate("/services")}>Explore services <ArrowRight size={15} /></button>
              </div>
            ) : (
              <div className="ks-dashboard-timeline">
                {recentActivity.map((booking, index) => (
                  <ActivityItem
                    key={booking._id}
                    title={`${ACTIVITY_LABELS[booking.status] || booking.status} — ${booking.serviceId?.serviceName || "Service"}`}
                    time={new Date(booking.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    status={booking.status}
                    last={index === recentActivity.length - 1}
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  />
                ))}
              </div>
            )}
            <button type="button" className="ks-dashboard-text-link" onClick={() => navigate("/my-booking")}>View all bookings <ArrowRight size={16} /></button>
          </div>
        </section>

        <footer className="ks-dashboard-footer">
          <div><Shield size={17} /><span>Your account and personal details are protected.</span></div>
          <button type="button" onClick={handleLogout}><LogOut size={16} /> Sign out</button>
        </footer>
      </div>
    </main>
  );
};

const StatCard = ({ icon, number, title, note, tone, index }) => (
  <motion.article className={`ks-dashboard-stat ks-dashboard-stat--${tone}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + index * .07, duration: .4 }} whileHover={{ y: -5 }}>
    <div className="ks-dashboard-stat__top"><span className="ks-dashboard-stat__icon">{icon}</span><TrendingUp size={16} className="ks-dashboard-stat__trend" /></div>
    <strong>{number}</strong><span className="ks-dashboard-stat__title">{title}</span><small>{note}</small>
  </motion.article>
);

const QuickAction = ({ icon, title, description, onClick }) => (
  <motion.button type="button" onClick={onClick} className="ks-dashboard-shortcut" whileHover={{ y: -4 }} whileTap={{ scale: .98 }}>
    <span className="ks-dashboard-shortcut__icon">{icon}</span>
    <span className="ks-dashboard-shortcut__copy"><strong>{title}</strong><small>{description}</small></span>
    <ArrowUpRight size={17} className="ks-dashboard-shortcut__arrow" />
  </motion.button>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="ks-dashboard-info-row">
    <span className="ks-dashboard-info-row__icon">{icon}</span>
    <span className="ks-dashboard-info-row__label">{label}</span>
    <strong>{value}</strong>
  </div>
);

const ActivityItem = ({ title, time, status, last, onClick }) => (
  <button type="button" className={`ks-dashboard-activity-item ${last ? "is-last" : ""}`} onClick={onClick}>
    <span className={`ks-dashboard-activity-item__dot ks-dashboard-activity-item__dot--${status}`}><span /></span>
    <span className="ks-dashboard-activity-item__copy"><strong>{title}</strong><small>{time}</small></span>
    <ArrowUpRight size={16} className="ks-dashboard-activity-item__arrow" />
  </button>
);

export default CustomerProfilePage;
