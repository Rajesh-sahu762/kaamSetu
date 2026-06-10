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

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CustomerProfilePage = () => {
  const navigate = useNavigate();

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
              R
            </div>

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

              <h1
                className="
                  mt-4

                  text-4xl
                  font-semibold

                  text-primary
                "
              >
                Rajesh Sahu
              </h1>

              <p className="mt-2 text-muted">rajesh@gmail.com</p>

              <p className="mt-1 text-muted">+91 9999999999</p>
            </div>

            {/* Edit */}

            <button
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
          <StatCard number="24" title="Total Bookings" />

          <StatCard number="2" title="Active Services" />

          <StatCard number="21" title="Completed" />

          <StatCard number="3" title="Saved Addresses" />
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
                value="Rajesh Sahu"
              />

              <InfoRow
                icon={<Mail size={18} />}
                label="Email"
                value="rajesh@gmail.com"
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="Mobile"
                value="+91 9999999999"
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
              <ActivityItem
                title="Electrical Repair Booked"
                time="2 Hours Ago"
              />

              <ActivityItem title="Booking Completed" time="Yesterday" />

              <ActivityItem title="New Address Added" time="3 Days Ago" />

              <ActivityItem title="Review Submitted" time="1 Week Ago" />
            </div>
          </div>
        </div>

        {/* LOGOUT */}

        <div
          className="
            mt-10

            bg-card

            border
            border-red-200

            rounded-3xl

            p-6
          "
        >
          <button
            className="
              flex

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
