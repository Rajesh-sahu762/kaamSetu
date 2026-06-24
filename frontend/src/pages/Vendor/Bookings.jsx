import { useMemo, useState } from 'react';

import Sidebar from '@/components/vendor/sidebar';
import Topbar from '@/components/vendor/topbar';

import Avatar from '@/components/vendor/common/Avatar';
import StatusPill from '@/components/vendor/common/StatusPill';
import Fade from '@/components/vendor/common/Fade';

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: T.surface,
      }}
    >
      

      <main
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
      

        <div
          style={{
            padding: bp.isMobile ? 16 : 24,
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
                    margin: 0,
                    color: T.slate,
                    fontSize: bp.isMobile ? 26 : 34,
                    fontWeight: 700,
                  }}
                >
                  Bookings
                </h1>

                <p
                  style={{
                    color: T.slateGray,
                    marginTop: 6,
                  }}
                >
                  Manage all your upcoming jobs.
                </p>
              </div>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,

                  border: 'none',

                  background: T.slate,

                  color: T.white,

                  padding: '12px 18px',

                  borderRadius: 12,

                  cursor: 'pointer',
                }}
              >
                <Plus size={18} />
                New Booking
              </button>
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
                  top: 15,
                  color: T.slateGray,
                }}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',

                  border: `1px solid ${T.border}`,

                  borderRadius: 12,

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
                    border:
                      activeTab === tab ? 'none' : `1px solid ${T.border}`,

                    background: activeTab === tab ? T.bronze : T.white,

                    color: activeTab === tab ? T.white : T.slate,

                    padding: '10px 18px',

                    borderRadius: 999,

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

              gridTemplateColumns: bp.isDesktop ? '1fr 320px' : '1fr',

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

                      borderRadius: 18,

                      padding: 20,

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

                              color: T.slate,
                            }}
                          >
                            {booking.client}
                          </h3>

                          <p
                            style={{
                              color: T.slateGray,
                              margin: '4px 0',
                            }}
                          >
                            {booking.service}
                          </p>

                          <small
                            style={{
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
                          border: 'none',

                          background: T.slate,

                          color: T.white,

                          padding: '10px 16px',

                          borderRadius: 10,

                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>

                      <button
                        style={{
                          border: `1px solid ${T.border}`,

                          background: T.white,

                          padding: '10px 16px',

                          borderRadius: 10,

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

            {/* Right Sidebar */}

            <div>
              {/* Performance */}

              <Fade>
                <div
                  style={{
                    background: T.slate,

                    color: T.white,

                    borderRadius: 18,

                    padding: 20,
                  }}
                >
                  <h3>Weekly Performance</h3>

                  <h1
                    style={{
                      margin: '12px 0',
                    }}
                  >
                    ₹32,500
                  </h1>

                  <p>+18% from last week</p>
                </div>
              </Fade>

              {/* Calendar */}

              <Fade delay={0.1}>
                <div
                  style={{
                    background: T.white,

                    border: `1px solid ${T.border}`,

                    borderRadius: 18,

                    padding: 20,

                    marginTop: 18,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',

                      alignItems: 'center',

                      gap: 8,
                    }}
                  >
                    <CalendarDays size={18} />

                    <strong>Upcoming</strong>
                  </div>

                  <p
                    style={{
                      color: T.slateGray,
                      marginTop: 12,
                    }}
                  >
                    4 Jobs scheduled this week.
                  </p>
                </div>
              </Fade>

              {/* Support */}

              <Fade delay={0.2}>
                <div
                  style={{
                    background: T.bronzeLight,

                    borderRadius: 18,

                    padding: 20,

                    marginTop: 18,
                  }}
                >
                  <CircleHelp size={22} />

                  <h3>Need Help?</h3>

                  <p>Contact support for booking issues.</p>

                  <button
                    style={{
                      marginTop: 10,

                      border: 'none',

                      background: T.slate,

                      color: T.white,

                      padding: '10px 16px',

                      borderRadius: 10,

                      display: 'flex',

                      alignItems: 'center',

                      gap: 6,

                      cursor: 'pointer',
                    }}
                  >
                    Contact Support
                    <ArrowRight size={16} />
                  </button>
                </div>
              </Fade>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}

        <button
          style={{
            position: 'fixed',

            right: 24,
            bottom: 24,

            width: 58,
            height: 58,

            borderRadius: '50%',

            border: 'none',

            background: T.bronze,

            color: T.white,

            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',

            cursor: 'pointer',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={24} />
        </button>
      </main>
    </div>
  );
}
