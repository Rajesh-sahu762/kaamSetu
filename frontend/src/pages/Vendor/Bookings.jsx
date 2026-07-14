import { useMemo, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import StatusPill from '@/components/common/StatusPill';
import Fade from '@/components/common/Fade';

import { T } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';

import {
  Search,
  Plus,
  CalendarDays,
  CircleHelp,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const BOOKINGS = [
  {
    id: 'KS-4821',
    client: 'Meera Joshi',
    service: 'Interior Painting',
    date: 'Today • 10:00 AM',
    amount: '₹8,500',
    status: 'confirmed',
    avatar: 'MJ',
  },
  {
    id: 'KS-4820',
    client: 'Arjun Kapoor',
    service: 'Plumbing Repair',
    date: 'Today • 2:00 PM',
    amount: '₹3,200',
    status: 'in-progress',
    avatar: 'AK',
  },
  {
    id: 'KS-4818',
    client: 'Sunita Rao',
    service: 'Electrical Wiring',
    date: 'Tomorrow • 9:00 AM',
    amount: '₹12,000',
    status: 'confirmed',
    avatar: 'SR',
  },
  {
    id: 'KS-4815',
    client: 'Ravi Malhotra',
    service: 'Carpentry Work',
    date: '19 Jun • 11:00 AM',
    amount: '₹6,800',
    status: 'pending',
    avatar: 'RM',
  },
];

const tabs = ['All', 'Confirmed', 'In Progress', 'Pending'];

export default function Bookings() {
  const bp = useBreakpoint();

  const [activeTab, setActiveTab] = useState('All');

  const [search, setSearch] = useState('');

  const filteredBookings = useMemo(() => {
    return BOOKINGS.filter((booking) => {
      const matchesSearch =
        booking.client.toLowerCase().includes(search.toLowerCase()) ||
        booking.service.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === 'All'
          ? true
          : booking.status.toLowerCase() ===
            activeTab.toLowerCase().replace(' ', '-');

      return matchesSearch && matchesTab;
    });
  }, [activeTab, search]);

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
            {filteredBookings.map((booking, index) => (
              <Fade key={booking.id} delay={index * 0.08}>
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
                      <Avatar initials={booking.avatar} size={52} />

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
                          {booking.client}
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
                          {booking.service}
                        </p>

                        <small
                          style={{
                            fontSize: 12,
                            fontFamily: 'Inter,sans-serif',
                            color: T.slateGray,
                          }}
                        >
                          {booking.date}
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
                        {booking.amount}
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
                    >
                      View Details
                    </button>

                    <button
                      style={{
                        border: `1px solid ${T.border}`,

                        height: 38,
                        padding: '0 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        background: T.white,

                        display: 'flex',

                        alignItems: 'center',

                        gap: 6,

                        cursor: 'pointer',
                      }}
                    >
                      <MessageCircle size={16} />
                      Message
                    </button>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}
