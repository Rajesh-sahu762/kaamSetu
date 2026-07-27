import {
  User,
  Mail,
  Phone,
  Bell,
  BookOpen,
  Shield,
  LogOut,
  Edit,
  CheckCircle2,
  Clock3,
  X,
} from 'lucide-react';
import { AuthContext } from '@/context/authContext';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  getCustomerProfile,
  updateCustomerProfile,
  getMyBookings,
} from '@/services/customerService';

const ACTIVE_STATUSES = ["pending", "accepted", "on_the_way", "in_progress"];

const CustomerProfilePage = () => {

  const { logout } = useContext(AuthContext)
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

        if (bookingsResponse.success) {
          setBookings(bookingsResponse.data);
        }
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
  const activeBookings = bookings.filter((b) =>
    ACTIVE_STATUSES.includes(b.status),
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledBookings = bookings.filter((b) =>
    ["cancelled", "rejected"].includes(b.status),
  ).length;

  const recentActivity = [...bookings]
    .sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    )
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
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-muted">
          Loading your profile...
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        min-h-screen
        bg-theme
        pt-32
        pb-20
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-8
        "
      >
        {/* HERO */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            relative

            overflow-hidden

            bg-card

            border
            border-theme

            rounded-[32px]

            p-8

            shadow-theme
          "
        >
          <div
            className="
              absolute

              -top-24
              -right-24

              w-72
              h-72

              rounded-full

              bg-[#745A38]/10

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex

              flex-col
              lg:flex-row

              items-center

              gap-8
            "
          >
            {/* Avatar */}

            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="
                  w-32
                  h-32

                  rounded-full

                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-32
                  h-32

                  rounded-full

                  bg-gradient-to-br
                  from-[#745A38]
                  to-[#A88A64]

                  flex
                  items-center
                  justify-center

                  text-white

                  text-5xl
                  font-bold
                "
              >
                {profile?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            {/* Info */}

            <div className="flex-1">
              <div
                className="
                  inline-flex

                  items-center

                  gap-2

                  px-4
                  py-2

                  rounded-full

                  bg-green-100

                  text-green-700

                  text-sm
                  font-medium
                "
              >
                <CheckCircle2 size={16} />
                Verified Customer
              </div>

              {isEditing ? (
                <div className="mt-4 space-y-3 max-w-sm">
                  <input
                    type="text"
                    value={editValues.fullName}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Full Name"
                    className="
                      w-full
                      p-3
                      rounded-xl
                      border
                      border-theme
                      bg-surface
                      outline-none
                    "
                  />

                  <input
                    type="text"
                    value={editValues.mobile}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    placeholder="Mobile Number"
                    className="
                      w-full
                      p-3
                      rounded-xl
                      border
                      border-theme
                      bg-surface
                      outline-none
                    "
                  />
                </div>
              ) : (
                <>
                  <h1
                    className="
                      mt-4

                      text-4xl
                      font-semibold

                      text-primary
                    "
                  >
                    {profile?.fullName}
                  </h1>

                  <p className="mt-2 text-muted">{profile?.email}</p>

                  <p className="mt-1 text-muted">
                    {profile?.mobile || "No mobile number added"}
                  </p>
                </>
              )}
            </div>

            {/* Edit */}

            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="
                    flex
                    items-center

                    gap-2

                    px-6
                    py-3

                    rounded-2xl

                    bg-[#745A38]

                    text-white

                    font-medium

                    disabled:opacity-60

                    transition
                  "
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="
                    flex
                    items-center
                    justify-center

                    w-12
                    h-12

                    rounded-2xl

                    border
                    border-theme
                  "
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="
                  flex
                  items-center

                  gap-2

                  px-6
                  py-3

                  rounded-2xl

                  bg-[#745A38]

                  text-white

                  font-medium

                  hover:scale-105

                  transition
                "
              >
                <Edit size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* STATS */}

        <div
          className="
            grid

            md:grid-cols-2
            xl:grid-cols-4

            gap-6

            mt-8
          "
        >
          <StatCard number={totalBookings} title="Total Bookings" />

          <StatCard number={activeBookings} title="Active Bookings" />

          <StatCard number={completedBookings} title="Completed" />

          <StatCard number={cancelledBookings} title="Cancelled" />
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-10">
          <h2
            className="
              text-2xl
              font-semibold

              text-primary

              mb-6
            "
          >
            Quick Actions
          </h2>

          <div
            className="
              grid

              md:grid-cols-2
              xl:grid-cols-4

              gap-6
            "
          >
            <QuickAction
              icon={<BookOpen />}
              title="My Bookings"
              onClick={() => navigate('/my-booking')}
            />

            <QuickAction
              icon={<Bell />}
              title="Notifications"
              onClick={() => navigate('/notifications')}
            />

            <QuickAction
              icon={<Shield />}
              title="Support"
              onClick={() => navigate('/support')}
            />

            <QuickAction
              icon={<User />}
              title="Browse Experts"
              onClick={() => navigate('/experts')}
            />
          </div>
        </div>

        {/* INFO + ACTIVITY */}

        <div
          className="
            grid

            lg:grid-cols-2

            gap-8

            mt-10
          "
        >
          {/* Personal Info */}

          <div
            className="
              bg-card

              border
              border-theme

              rounded-3xl

              p-8
            "
          >
            <h2
              className="
                text-2xl
                font-semibold

                text-primary

                mb-6
              "
            >
              Personal Information
            </h2>

            <div className="space-y-5">
              <InfoRow
                icon={<User size={18} />}
                label="Full Name"
                value={profile?.fullName}
              />

              <InfoRow
                icon={<Mail size={18} />}
                label="Email"
                value={profile?.email}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="Mobile"
                value={profile?.mobile || "Not added"}
              />
            </div>
          </div>

          {/* Activity */}

          <div
            className="
              bg-card

              border
              border-theme

              rounded-3xl

              p-8
            "
          >
            <h2
              className="
                text-2xl
                font-semibold

                text-primary

                mb-6
              "
            >
              Recent Activity
            </h2>

            {recentActivity.length === 0 ? (
              <p className="text-muted">No activity yet.</p>
            ) : (
              <div className="space-y-5">
                {recentActivity.map((booking) => (
                  <ActivityItem
                    key={booking._id}
                    title={`${ACTIVITY_LABELS[booking.status] || booking.status} — ${
                      booking.serviceId?.serviceName || "Service"
                    }`}
                    time={new Date(booking.updatedAt).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short" },
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOGOUT */}

        <div
          className="
            mt-10

            bg-card
            flex  
          
            justify-center

            border
            border-red-200

            rounded-3xl

            p-6
          "
        >
          <button
          onClick={handleLogout}
            className="
              flex
              cursor-pointer

              items-center
            

              gap-3

              text-red-600

              font-medium

              hover:opacity-80

              transition
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

/* Components */

const StatCard = ({ number, title }) => (
  <div
    className="
      bg-card

      border
      border-theme

      rounded-3xl

      p-6

      text-center

      hover:-translate-y-1

      transition
    "
  >
    <h3
      className="
        text-4xl

        font-bold

        text-[#745A38]
      "
    >
      {number}
    </h3>

    <p
      className="
        mt-2

        text-muted
      "
    >
      {title}
    </p>
  </div>
);

const QuickAction = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="
      bg-card

      border
      border-theme

      rounded-3xl

      p-6

      flex
      flex-col

      items-center

      gap-4

      hover:-translate-y-1

      transition
    "
  >
    <div className="text-[#745A38]">{icon}</div>

    <span
      className="
        font-medium

        text-primary
      "
    >
      {title}
    </span>
  </button>
);

const InfoRow = ({ icon, label, value }) => (
  <div
    className="
      flex

      justify-between

      items-center
    "
  >
    <div
      className="
        flex

        items-center

        gap-3
      "
    >
      {icon}
      <span>{label}</span>
    </div>

    <span
      className="
        font-medium

        text-primary
      "
    >
      {value}
    </span>
  </div>
);

const ActivityItem = ({ title, time }) => (
  <div
    className="
      flex

      items-center

      gap-4
    "
  >
    <div
      className="
        w-10
        h-10

        rounded-full

        bg-[#745A38]/10

        flex
        items-center
        justify-center
      "
    >
      <Clock3
        size={18}
        className="
          text-[#745A38]
        "
      />
    </div>

    <div>
      <h4
        className="
          font-medium

          text-primary
        "
      >
        {title}
      </h4>

      <p
        className="
          text-sm

          text-muted
        "
      >
        {time}
      </p>
    </div>
  </div>
);

export default CustomerProfilePage;
