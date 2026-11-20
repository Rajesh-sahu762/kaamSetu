import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Clock3, MapPin, ArrowRight, CheckCircle2, XCircle,
  LoaderCircle, ClipboardList, Sparkles, Search, RefreshCw, BriefcaseBusiness,
  CircleAlert, ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMyBookings } from "@/services/customerService";
import { getImageUrl } from "@/utils/imageUrl";
import "./MyBookingsPage.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000";
const ACTIVE_STATUSES = ["pending", "accepted", "on_the_way", "in_progress"];
const CANCELLED_STATUSES = ["cancelled", "rejected"];

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  on_the_way: "On the way",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyBookings({ limit: 50 });
      if (response.success) setBookings(response.data);
      else setError(response.message || "Failed to load bookings.");
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const counts = useMemo(() => ({
    active: bookings.filter((booking) => ACTIVE_STATUSES.includes(booking.status)).length,
    completed: bookings.filter((booking) => booking.status === "completed").length,
    cancelled: bookings.filter((booking) => CANCELLED_STATUSES.includes(booking.status)).length,
  }), [bookings]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    if (activeTab === "active") return ACTIVE_STATUSES.includes(booking.status);
    if (activeTab === "completed") return booking.status === "completed";
    return CANCELLED_STATUSES.includes(booking.status);
  }), [bookings, activeTab]);

  const tabs = [
    { id: "active", label: "Active", icon: <LoaderCircle size={16} /> },
    { id: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
    { id: "cancelled", label: "Cancelled", icon: <XCircle size={16} /> },
  ];

  return (
    <main className="ks-my-bookings">
      <div className="ks-my-bookings__decoration ks-my-bookings__decoration--one" aria-hidden="true" />
      <div className="ks-my-bookings__decoration ks-my-bookings__decoration--two" aria-hidden="true" />
      <div className="ks-my-bookings__shell">
        <motion.header
          className="ks-bookings-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .45 }}
        >
          <div>
            <span className="ks-bookings-eyebrow"><Sparkles size={14} /> YOUR SERVICE JOURNEY</span>
            <h1>My <span>Bookings.</span></h1>
            <p>All your home services, organised in one place. Track progress and revisit completed work.</p>
          </div>
          <button type="button" className="ks-bookings-explore" onClick={() => navigate("/services")}>
            Book a service <ArrowUpRight size={18} />
          </button>
        </motion.header>

        <section className="ks-bookings-overview" aria-label="Booking summary">
          <div className="ks-bookings-overview__intro">
            <span className="ks-bookings-overview__icon"><ClipboardList size={21} /></span>
            <div><span>BOOKING OVERVIEW</span><strong>{bookings.length} <small>total requests</small></strong></div>
          </div>
          <div className="ks-bookings-overview__metrics">
            <div><strong>{counts.active}</strong><span>Active</span></div>
            <div><strong>{counts.completed}</strong><span>Completed</span></div>
            <div><strong>{counts.cancelled}</strong><span>Cancelled</span></div>
          </div>
          <div className="ks-bookings-overview__accent" aria-hidden="true"><BriefcaseBusiness size={62} /></div>
        </section>

        <section className="ks-bookings-list-section">
          <div className="ks-bookings-section-heading">
            <div><span className="ks-bookings-kicker">YOUR ACTIVITY</span><h2>Every booking, <em>at a glance.</em></h2></div>
            <button type="button" className="ks-bookings-refresh" onClick={fetchBookings} disabled={loading}>
              <RefreshCw size={15} className={loading ? "is-spinning" : ""} /> Refresh
            </button>
          </div>

          <div className="ks-bookings-tabs" role="tablist" aria-label="Filter bookings">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`ks-bookings-tab ${activeTab === tab.id ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}<span>{tab.label}</span><b>{counts[tab.id]}</b>
              </button>
            ))}
          </div>

          {loading && (
            <div className="ks-bookings-skeleton-list" aria-label="Loading bookings">
              {[1, 2, 3].map((item) => <div className="ks-bookings-skeleton" key={item}><div /><section><i /><i /><i /></section></div>)}
            </div>
          )}

          {!loading && error && (
            <div className="ks-bookings-state ks-bookings-state--error">
              <span><CircleAlert size={25} /></span><h3>We couldn’t load your bookings</h3><p>{error}</p>
              <button type="button" onClick={fetchBookings}><RefreshCw size={15} /> Try again</button>
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="ks-bookings-state">
              <span><CalendarDays size={27} /></span>
              <h3>{activeTab === "active" ? "Nothing in progress yet" : activeTab === "completed" ? "No completed bookings yet" : "No cancelled bookings"}</h3>
              <p>{activeTab === "active" ? "Your upcoming and ongoing services will show up here once you book an expert." : activeTab === "completed" ? "Once a service is completed, you’ll find its details and review option here." : "Great! You don’t have any cancelled or rejected bookings."}</p>
              {activeTab !== "cancelled" && <button type="button" onClick={() => navigate("/services")}>Explore services <ArrowRight size={16} /></button>}
            </div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <motion.div className="ks-bookings-cards" layout>
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking, index) => (
                  <BookingCard key={booking._id} booking={booking} index={index} navigate={navigate} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <footer className="ks-bookings-footer">
          <span><CheckCircle2 size={15} /> Your bookings are securely stored in your account.</span>
          <button type="button" onClick={() => navigate("/support")}>Need help? Contact support <ArrowRight size={15} /></button>
        </footer>
      </div>
    </main>
  );
};

const BookingCard = ({ booking, index, navigate }) => {
  const isCancelled = CANCELLED_STATUSES.includes(booking.status);
  const isCompleted = booking.status === "completed";
  const image = getImageUrl(booking.serviceId?.coverImage, "services") || FALLBACK_IMAGE;
  const bookingDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Date not available";

  return (
    <motion.article
      className="ks-booking-card"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: .32, delay: Math.min(index * .045, .18) }}
      whileHover={{ y: -3 }}
    >
      <div className="ks-booking-card__image-wrap">
        <img src={image} alt={booking.serviceId?.serviceName || "Booked service"} className="ks-booking-card__image" />
        <span className="ks-booking-card__image-tag"><BriefcaseBusiness size={13} /> KAAMSETU SERVICE</span>
      </div>
      <div className="ks-booking-card__main">
        <div className="ks-booking-card__top">
          <div className="ks-booking-card__title">
            <span className="ks-booking-card__vendor">{booking.vendorId?.businessName || "Service professional"}</span>
            <h3>{booking.serviceId?.serviceName || "Home service"}</h3>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="ks-booking-card__details">
          <InfoItem icon={<CalendarDays size={16} />} label="SERVICE DATE" value={bookingDate} />
          <InfoItem icon={<Clock3 size={16} />} label="TIME SLOT" value={booking.bookingTime || "Not specified"} />
          <InfoItem icon={<MapPin size={16} />} label="LOCATION" value={booking.vendorId?.city || "Location pending"} />
        </div>

        <div className="ks-booking-card__footer">
          <div className="ks-booking-card__reference"><span>BOOKING ID</span><strong>{booking.bookingNumber || booking._id}</strong></div>
          <div className="ks-booking-card__actions">
            {isCompleted && (
              <button type="button" className="ks-booking-action ks-booking-action--secondary" onClick={() => navigate(`/review/${booking._id}`)}>
                Write review <ArrowUpRight size={15} />
              </button>
            )}
            {!isCancelled && (
              <button type="button" className="ks-booking-action ks-booking-action--primary" onClick={() => navigate(`/booking/${booking._id}`)}>
                Track booking <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="ks-booking-info">
    <span className="ks-booking-info__icon">{icon}</span>
    <span className="ks-booking-info__copy"><small>{label}</small><strong>{value}</strong></span>
  </div>
);

const StatusBadge = ({ status }) => {
  const active = ACTIVE_STATUSES.includes(status);
  const completed = status === "completed";
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`ks-booking-status ${active ? "is-active" : completed ? "is-completed" : "is-cancelled"}`}>
      {active ? <LoaderCircle size={15} /> : completed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
      {label}
    </span>
  );
};

const TabButton = () => null;
export default MyBookingsPage;
