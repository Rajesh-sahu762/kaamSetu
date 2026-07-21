import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  BookOpen,
  Shield,
  LogOut,
  Edit,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import { AuthContext } from '@/context/authContext';
import { getDashboardSummary } from '@/services/customerService';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

const timeAgo = (value) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} Min${minutes === 1 ? "" : "s"} Ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Hour${hours === 1 ? "" : "s"} Ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days} Days Ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} Week${weeks === 1 ? "" : "s"} Ago`;
};

const CustomerProfilePage = () => {

  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getDashboardSummary();
        if (!cancelled) setSummary(response.data);
      } catch (error) {
        console.error("Failed to load dashboard summary:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const profile = summary?.profile;
  const stats = summary?.stats;
  const recentActivity = summary?.recentActivity || [];

  const displayName = profile?.fullName || user?.fullName || "Customer";
  const displayEmail = profile?.email || user?.email || "";
  const displayMobile = profile?.mobile || "";
  const isVerified = profile?.isVerified ?? true;
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {

  logout();

  navigate(
    "/login",
    {
      replace: true,
    }
  );

};

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
              {avatarInitial}
            </div>

            {/* Info */}

            <div className="flex-1 text-center lg:text-left">
              <div
                className={`
                  inline-flex

                  items-center

                  gap-2

                  px-4
                  py-2

                  rounded-full

                  ${isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}

                  text-sm
                  font-medium
                `}
              >
                <CheckCircle2 size={16} />
                {isVerified ? "Verified Customer" : "Unverified Customer"}
              </div>

              <h1
                className="
                  mt-4

                  text-4xl
                  font-semibold

                  text-primary
                "
              >
                {displayName}
              </h1>

              <p className="mt-2 text-muted">{displayEmail}</p>

              <p className="mt-1 text-muted">{displayMobile}</p>
            </div>

            {/* Edit */}

            <button
              className="
                w-full
                lg:w-auto

                flex
                items-center
                justify-center

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
          <StatCard number={loading ? "…" : (stats?.totalBookings ?? 0)} title="Total Bookings" />

          <StatCard number={loading ? "…" : (stats?.activeBookings ?? 0)} title="Active Services" />

          <StatCard number={loading ? "…" : (stats?.completedBookings ?? 0)} title="Completed" />

          <StatCard number={loading ? "…" : (stats?.savedAddresses ?? 0)} title="Saved Addresses" />
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
              onClick={() => navigate('/my-bookings')}
            />

            <QuickAction
              icon={<MapPin />}
              title="Saved Addresses"
              onClick={() => navigate('/addresses')}
            />

            <QuickAction
              icon={<Bell />}
              title="Notifications"
              onClick={() => navigate('/notifications')}
            />

            <QuickAction icon={<Shield />} title="Support" />
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
                value={displayName}
              />

              <InfoRow
                icon={<Mail size={18} />}
                label="Email"
                value={displayEmail}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="Mobile"
                value={displayMobile || "—"}
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

            <div className="space-y-5">
              {loading ? (
                <p className="text-muted text-sm">Loading activity…</p>
              ) : recentActivity.length ? (
                recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    time={timeAgo(activity.time)}
                  />
                ))
              ) : (
                <p className="text-muted text-sm">No recent activity yet. Book a service to get started.</p>
              )}
            </div>
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