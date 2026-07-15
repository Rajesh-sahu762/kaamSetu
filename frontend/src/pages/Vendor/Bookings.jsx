import { useMemo, useState, useEffect } from 'react';
import Avatar from '@/components/common/Avatar';
import StatusPill from '@/components/common/StatusPill';
import Fade from '@/components/common/Fade';
import { getVendorBookings, getVendorBookingById } from '@/services/vendorService';
import BookingDetailsModal from "@/components/vendor/bookings/BookingDetailsModal";
import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';

import {
  Search,
  CalendarDays,
  CircleHelp,
  MessageCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

import ConfirmModal from "@/components/common/ConfirmModal";
import { updateBookingStatus } from "@/services/vendorService";
import { toast } from "react-toastify";


const tabs = [
  'All',

  'Pending',

  'Accepted',

  'In Progress',

  'Completed',

  'Cancelled',

  'Rejected',
];

export default function Bookings() {
  const bp = useBreakpoint();

  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);

  const [showBookingModal, setShowBookingModal] = useState(false);

  const [bookingDetails, setBookingDetails] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({});

  const [search, setSearch] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);

const [selectedBooking, setSelectedBooking] = useState(null);

const [selectedStatus, setSelectedStatus] = useState("");

const [statusLoading, setStatusLoading] = useState(false);

const handleStatusClick = (booking, status) => {

  setSelectedBooking(booking);

  setSelectedStatus(status);

  setShowStatusModal(true);

};

const handleConfirmStatus = async () => {

  setStatusLoading(true);

  const response = await updateBookingStatus(
    selectedBooking._id,
    selectedStatus
  );

  if (response.success) {

    toast.success(response.message);

    fetchBookings();

    if (
      bookingDetails &&
      bookingDetails._id === selectedBooking._id
    ) {
      handleViewDetails(selectedBooking._id);
    }

    setShowStatusModal(false);

  } else {

    toast.error(response.message);

  }

  setStatusLoading(false);

};

  const fetchBookings = async () => {
    setLoading(true);

    const response = await getVendorBookings({
      page,

      status:
        activeTab === 'All' ? 'all' : activeTab.toLowerCase().replace(' ', '_'),

      search,
    });

    if (response.success) {
      setBookings(response.data);

      setStats(response.stats);

      setPagination(response.pagination);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [page, activeTab, search]);

  const handleViewDetails = async (bookingId) => {

    setShowBookingModal(true);

    setDetailsLoading(true);

    const response = await getVendorBookingById(bookingId);

    if (response.success) {

        setBookingDetails(response.data);

    }

    setDetailsLoading(false);

};

const getStatusOptions = (status) => {
  switch (status) {
    case "pending":
      return [
        { label: "Accept Booking", value: "accepted" },
        { label: "Reject Booking", value: "rejected" },
      ];

    case "accepted":
      return [
        { label: "Start Service", value: "in_progress" },
      ];

    case "in_progress":
      return [
        { label: "Complete Service", value: "completed" },
      ];

    default:
      return [];
  }
};

  return (
    <>
      <div
        style={{
          background: 'transparent',
          padding: bp.isMobile ? 16 : 24,
          paddingBottom: bp.isMobile ? 90 : 24,
        }}
      >
        {/* Header */}

        <Fade>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'Geist,sans-serif',
                  fontSize: bp.isMobile ? 28 : 30,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: T.slate,
                  margin: 0,
                }}
              >
                Bookings
              </h1>

              <p
                style={{
                  fontFamily: 'Inter,sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: T.slateGray,
                  marginTop: 4,
                }}
              >
                Manage all your upcoming jobs.
              </p>
            </div>
          </div>
        </Fade>

        {/* Search */}

        <Fade delay={0.1}>
          <div
            style={{
              marginTop: 20,
              position: 'relative',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 14,
                top: 13,
                color: T.slateGray,
              }}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings..."
              style={{
                width: '100%',

                border: `1px solid ${T.border}`,

                height: 44,
                padding: '0 14px 0 42px',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'Inter,sans-serif',

                outline: 'none',

                background: T.white,
              }}
            />
          </div>
        </Fade>

        {/* Tabs */}

        <Fade delay={0.15}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',

              marginTop: 20,
              paddingBottom: 6,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  border: activeTab === tab ? 'none' : `1px solid ${T.border}`,

                  background: activeTab === tab ? T.bronze : T.white,

                  color: activeTab === tab ? T.white : T.slate,

                  borderRadius: 8,

                  height: 36,
                  padding: '0 16px',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'Geist,sans-serif',

                  cursor: 'pointer',

                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </Fade>

        {/* Main Grid */}

        <div
          style={{
            display: 'grid',

            gridTemplateColumns: bp.isDesktop ? '1fr' : '1fr',

            gap: 24,

            marginTop: 24,
          }}
        >
          {/* Left */}

          <div>
            {bookings.map((booking, index) => (
              <Fade key={booking._id} delay={index * 0.08}>
                <div
                  style={{
                    background: T.white,

                    border: `1px solid ${T.border}`,

                    borderRadius: 12,
                    padding: 18,
                    boxShadow: '0 2px 8px rgba(15,23,42,.04)',

                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',

                      justifyContent: 'space-between',

                      gap: 16,

                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',

                        gap: 14,
                      }}
                    >
                      <Avatar
                        initials={booking.customerId.fullName
                          .split(' ')
                          .map((name) => name[0])
                          .join('')}
                        size={52}
                      />

                      <div>
                        <h3
                          style={{
                            margin: 0,

                            fontFamily: 'Geist,sans-serif',
                            fontSize: 18,
                            fontWeight: 600,

                            color: T.slate,
                          }}
                        >
                          {booking.customerId.fullName}
                        </h3>

                        <p
                          style={{
                            fontSize: 13,
                            fontFamily: 'Inter,sans-serif',
                            fontWeight: 500,
                            color: T.slateGray,
                            margin: '4px 0',
                          }}
                        >
                          {booking.serviceId.serviceName}
                        </p>

                        <small
                          style={{
                            fontSize: 12,
                            fontFamily: 'Inter,sans-serif',
                            color: T.slateGray,
                          }}
                        >
                          {new Date(booking.bookingDate).toLocaleDateString()}{' '}
                          {booking.bookingTime}
                        </small>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'Geist,sans-serif',
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.slate,
                          margin: 0,
                        }}
                      >
                        ₹{booking.totalAmount}
                      </h3>

                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        <StatusPill status={booking.status} />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',

                      gap: 10,

                      marginTop: 18,

                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      style={{
                        height: 38,
                        padding: '0 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        border: 'none',

                        background: T.slate,

                        color: T.white,

                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewDetails(booking._id)}
                    >
                      View Details
                    </button>

                      {
  getStatusOptions(booking.status).length > 0 ? (

    <select

      defaultValue=""

      onChange={(e) => {

        if (!e.target.value) return;

        handleStatusClick(
          booking,
          e.target.value
        );

        e.target.selectedIndex = 0;

      }}

      style={{
        height: 38,
        padding: "0 14px",
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: T.white,
        cursor: "pointer",
        fontSize: 12,
      }}

    >

      <option value="">
        Update Status
      </option>

      {

        getStatusOptions(
          booking.status
        ).map(option => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))

      }

    </select>

  ) : (

    <button

      disabled

      style={{

        height: 38,

        padding: "0 16px",

        borderRadius: 8,

        border: `1px solid ${T.border}`,

        background: "#F8FAFC",

        color: "#94A3B8",

      }}

    >

      {booking.status.replace("_", " ")}

    </button>

  )
}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      
  <BookingDetailsModal

open={showBookingModal}

onClose={() => {

setShowBookingModal(false);

setBookingDetails(null);

}}

booking={bookingDetails}

loading={detailsLoading}

refreshBookings={fetchBookings}
/>

<ConfirmModal

  open={showStatusModal}

  title="Update Booking Status"

  message={`Are you sure you want to change booking status to "${selectedStatus.replace("_", " ")}"?`}

  confirmText="Update"

  cancelText="Cancel"

  loading={statusLoading}

  danger={selectedStatus === "rejected"}

  onCancel={() => setShowStatusModal(false)}

  onConfirm={handleConfirmStatus}

/>

    </>
  );
}
