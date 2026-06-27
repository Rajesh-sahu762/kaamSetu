import { useMemo, useState } from "react";

import Fade from "@/components/vendor/common/Fade";

import { T, MOBILE_BOTTOM_NAV_HEIGHT } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  TrendingUp,
  Star,
  Wallet,
  Package,
} from "lucide-react";

const SERVICES = [
  {
    id: 1,
    name: "Home Deep Cleaning",
    category: "Cleaning",
    price: 799,
    duration: "90 mins",
    bookings: 158,
    revenue: 18400,
    rating: 4.9,
    views: 1240,
    status: "active",
    performance: 92,
  },

  {
    id: 2,
    name: "Interior Painting",
    category: "Painting",
    price: 3500,
    duration: "1 Day",
    bookings: 82,
    revenue: 28600,
    rating: 4.8,
    views: 920,
    status: "active",
    performance: 81,
  },

  {
    id: 3,
    name: "Electrical Repair",
    category: "Electrical",
    price: 499,
    duration: "45 mins",
    bookings: 64,
    revenue: 9600,
    rating: 4.7,
    views: 640,
    status: "pending",
    performance: 64,
  },

  {
    id: 4,
    name: "False Ceiling",
    category: "Construction",
    price: 5200,
    duration: "2 Days",
    bookings: 28,
    revenue: 41600,
    rating: 4.6,
    views: 420,
    status: "paused",
    performance: 44,
  },
];

const FILTERS = [
  "All",
  "Active",
  "Pending",
  "Paused",
];

export default function Services() {

  const bp = useBreakpoint();

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [gridView, setGridView] =
    useState(true);

  const filteredServices = useMemo(() => {

    return SERVICES.filter((service) => {

      const searchMatch =
        service.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        service.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const filterMatch =
        activeFilter === "All"
          ? true
          : service.status ===
            activeFilter.toLowerCase();

      return searchMatch && filterMatch;

    });

  }, [search, activeFilter]);

  return (

    <div
      style={{
        padding: bp.isMobile ? 16 : 24,
        paddingBottom: bp.isMobile
          ? MOBILE_BOTTOM_NAV_HEIGHT + 24
          : 24,
      }}
    >

              <Fade>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >

          <div>

            <h1
              style={{
                fontFamily: "Geist,sans-serif",
                fontSize: bp.isMobile ? 28 : 30,
                fontWeight: 600,
                color: T.slate,
                letterSpacing: "-0.02em",
              }}
            >
              Services
            </h1>

            <p
              style={{
                marginTop: 4,
                color: T.slateGray,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Manage, optimise and grow your professional services.
            </p>

          </div>

          <button
            style={{
              height: 44,
              padding: "0 18px",
              border: "none",
              borderRadius: 8,
              background: T.slate,
              color: T.white,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "Geist,sans-serif",
              fontWeight: 600,
            }}
          >
            <Plus size={18} />

            Add Service

          </button>

        </div>

      </Fade>


            <Fade delay={0.08}>

        <div
          style={{
            marginTop: 26,

            display: "grid",

            gridTemplateColumns:
              bp.isDesktop
                ? "2fr 1fr 1fr"
                : bp.isTablet
                ? "repeat(2,1fr)"
                : "1fr",

            gap: 18,
          }}
        >

          {/* Hero */}

          <div
            style={{
              background: T.slate,

              color: T.white,

              borderRadius: 18,

              padding: 24,

              overflow: "hidden",

              position: "relative",
            }}
          >

            <div
              style={{
                fontSize: 13,
                opacity: .7,
              }}
            >
              This Month
            </div>

            <h2
              style={{
                marginTop: 12,
                fontSize: 38,
                fontFamily: "Geist,sans-serif",
                fontWeight: 700,
              }}
            >
              ₹48,320
            </h2>

            <div
              style={{
                marginTop: 10,

                display: "inline-flex",

                alignItems: "center",

                gap: 6,

                background: "rgba(255,255,255,.08)",

                padding: "6px 12px",

                borderRadius: 100,
              }}
            >
              <TrendingUp size={16} />

              +18% this month

            </div>

            <div
              style={{
                position: "absolute",

                right: -40,

                bottom: -40,

                width: 180,

                height: 180,

                borderRadius: "50%",

                background:
                  "rgba(255,255,255,.05)",
              }}
            />

          </div>

          {[
            {
              title: "Active Services",
              value: "12",
              icon: Package,
            },

            {
              title: "Average Rating",
              value: "4.9",
              icon: Star,
            },

          ].map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                style={{
                  background: T.white,

                  border: `1px solid ${T.border}`,

                  borderRadius: 18,

                  padding: 20,
                }}
              >

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.surfaceLow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    size={20}
                    color={T.bronze}
                  />
                </div>

                <div
                  style={{
                    marginTop: 20,

                    fontSize: 30,

                    fontWeight: 700,

                    fontFamily: "Geist,sans-serif",

                    color: T.slate,
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    marginTop: 6,

                    color: T.slateGray,

                    fontSize: 13,
                  }}
                >
                  {item.title}
                </div>

              </div>

            );

          })}

        </div>

      </Fade>

            {/* ================= Search + Actions ================= */}

      <Fade delay={0.12}>

        <div
          style={{
            marginTop: 26,

            display: "flex",

            gap: 14,

            flexWrap: "wrap",

            alignItems: "center",
          }}
        >

          {/* Search */}

          <div
            style={{
              flex: 1,

              minWidth: 240,

              position: "relative",
            }}
          >

            <Search
              size={18}
              color={T.slateGray}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              placeholder="Search services..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                width: "100%",
                height: 48,
                paddingLeft: 48,
                paddingRight: 16,

                border: `1px solid ${T.border}`,

                borderRadius: 14,

                background: T.white,

                outline: "none",

                fontSize: 14,

                transition: ".2s",

                boxShadow:
                  "0 4px 18px rgba(15,23,42,.03)",
              }}
            />

          </div>

          {/* Filter */}

          <button
            style={{
              height: 48,

              padding: "0 18px",

              borderRadius: 14,

              border: `1px solid ${T.border}`,

              background: T.white,

              display: "flex",

              alignItems: "center",

              gap: 8,

              cursor: "pointer",

              fontWeight: 600,

              color: T.slate,
            }}
          >

            <Filter size={17} />

            {!bp.isMobile && "Filters"}

          </button>

          {/* View Toggle */}

          {!bp.isMobile && (

            <div
              style={{
                display: "flex",

                background: T.white,

                border: `1px solid ${T.border}`,

                borderRadius: 14,

                overflow: "hidden",
              }}
            >

              <button
                onClick={() =>
                  setGridView(true)
                }
                style={{
                  width: 46,

                  height: 46,

                  border: "none",

                  cursor: "pointer",

                  background:
                    gridView
                      ? T.slate
                      : T.white,

                  color:
                    gridView
                      ? T.white
                      : T.slate,
                }}
              >

                <LayoutGrid size={18} />

              </button>

              <button
                onClick={() =>
                  setGridView(false)
                }
                style={{
                  width: 46,

                  height: 46,

                  border: "none",

                  cursor: "pointer",

                  background:
                    !gridView
                      ? T.slate
                      : T.white,

                  color:
                    !gridView
                      ? T.white
                      : T.slate,
                }}
              >

                <List size={18} />

              </button>

            </div>

          )}

        </div>

      </Fade>

            {/* ================= Filter Chips ================= */}

      <Fade delay={0.16}>

        <div
          style={{
            display: "flex",

            gap: 10,

            overflowX: "auto",

            paddingBottom: 4,

            marginTop: 22,
          }}
        >

          {FILTERS.map((filter) => {

            const active =
              activeFilter === filter;

            return (

              <button
                key={filter}

                onClick={() =>
                  setActiveFilter(filter)
                }

                style={{
                  whiteSpace: "nowrap",

                  height: 38,

                  padding: "0 18px",

                  borderRadius: 100,

                  border: active
                    ? "none"
                    : `1px solid ${T.border}`,

                  background: active
                    ? T.bronze
                    : T.white,

                  color: active
                    ? T.white
                    : T.slate,

                  fontSize: 13,

                  fontWeight: 600,

                  cursor: "pointer",

                  transition: ".2s",

                  boxShadow: active
                    ? "0 8px 18px rgba(168,138,100,.25)"
                    : "none",
                }}
              >

                {filter}

              </button>

            );

          })}

        </div>

      </Fade>

            <Fade delay={0.20}>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              bp.isDesktop
                ? "repeat(4,1fr)"
                : "repeat(2,1fr)",

            gap: 14,

            marginTop: 22,
          }}
        >

          {[
            {
              label: "Bookings",
              value: "428",
            },

            {
              label: "Revenue",
              value: "₹48K",
            },

            {
              label: "Views",
              value: "3.2K",
            },

            {
              label: "Conversion",
              value: "18%",
            },

          ].map((item) => (

            <div
              key={item.label}
              style={{
                background: T.white,

                borderRadius: 14,

                border: `1px solid ${T.border}`,

                padding: 18,
              }}
            >

              <div
                style={{
                  fontSize: 12,

                  color: T.slateGray,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  marginTop: 8,

                  fontSize: 24,

                  fontWeight: 700,

                  color: T.slate,

                  fontFamily:
                    "Geist,sans-serif",
                }}
              >
                {item.value}
              </div>

            </div>

          ))}

        </div>

      </Fade>

            {/* ================= Services Section ================= */}

      <Fade delay={0.25}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              bp.isDesktop
                ? "2fr 340px"
                : "1fr",
            gap: 24,
            marginTop: 28,
          }}
        >

          {/* ================= Left ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                bp.isDesktop && gridView
                  ? "repeat(2,minmax(0,1fr))"
                  : "1fr",
              gap: 20,
            }}
          >

            {filteredServices.map((service) => {

              const statusColor =
                service.status === "active"
                  ? "#22c55e"
                  : service.status === "pending"
                  ? "#f59e0b"
                  : "#ef4444";

              const statusBg =
                service.status === "active"
                  ? "rgba(34,197,94,.10)"
                  : service.status === "pending"
                  ? "rgba(245,158,11,.10)"
                  : "rgba(239,68,68,.10)";

              return (

                <div
                  key={service.id}
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 18,
                    overflow: "hidden",
                    transition: ".25s",
                    boxShadow:
                      "0 8px 28px rgba(15,23,42,.05)",
                  }}
                >

                  {/* Image */}

                  <div
                    style={{
                      height: 170,
                      background:
                        "linear-gradient(135deg,#eff4ff,#dfe8ff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 60,
                    }}
                  >
                    🛠️
                  </div>

                  {/* Body */}

                  <div
                    style={{
                      padding: 20,
                    }}
                  >

                    {/* Top */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 14,
                      }}
                    >

                      <div>

                        <h3
                          style={{
                            fontFamily:
                              "Geist,sans-serif",
                            fontSize: 20,
                            fontWeight: 600,
                            color: T.slate,
                          }}
                        >
                          {service.name}
                        </h3>

                        <div
                          style={{
                            marginTop: 5,
                            color: T.slateGray,
                            fontSize: 13,
                          }}
                        >
                          {service.category}
                        </div>

                      </div>

                      <div
                        style={{
                          background: statusBg,
                          color: statusColor,
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "capitalize",
                          height: 30,
                        }}
                      >
                        {service.status}
                      </div>

                    </div>

                    {/* Price */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 22,
                      }}
                    >

                      <div>

                        <div
                          style={{
                            fontSize: 12,
                            color: T.slateGray,
                          }}
                        >
                          Starting From
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontFamily:
                              "Geist,sans-serif",
                            fontSize: 30,
                            fontWeight: 700,
                            color: T.slate,
                          }}
                        >
                          ₹{service.price}
                        </div>

                      </div>

                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >

                        <div
                          style={{
                            fontSize: 12,
                            color: T.slateGray,
                          }}
                        >
                          Duration
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontWeight: 600,
                            color: T.slate,
                          }}
                        >
                          {service.duration}
                        </div>

                      </div>

                    </div>

                    {/* Analytics */}

                    <div
                      style={{
                        marginTop: 24,
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(3,1fr)",
                        gap: 12,
                      }}
                    >

                      {[
                        {
                          value: service.bookings,
                          label: "Bookings",
                        },

                        {
                          value: service.views,
                          label: "Views",
                        },

                        {
                          value:
                            "₹" +
                            (service.revenue / 1000)
                              .toFixed(1) +
                            "K",

                          label: "Revenue",
                        },

                      ].map((item) => (

                        <div
                          key={item.label}
                          style={{
                            background: T.surface,
                            borderRadius: 12,
                            padding: 14,
                            textAlign: "center",
                          }}
                        >

                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: T.slate,
                              fontFamily:
                                "Geist,sans-serif",
                            }}
                          >
                            {item.value}
                          </div>

                          <div
                            style={{
                              marginTop: 3,
                              fontSize: 11,
                              color: T.slateGray,
                            }}
                          >
                            {item.label}
                          </div>

                        </div>

                      ))}

                    </div>

                    {/* Rating */}

                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginBottom: 8,
                        }}
                      >

                        <span
                          style={{
                            fontSize: 13,
                            color: T.slateGray,
                          }}
                        >
                          Performance
                        </span>

                        <span
                          style={{
                            fontWeight: 700,
                            color: T.slate,
                          }}
                        >
                          {service.performance}%
                        </span>

                      </div>

                      <div
                        style={{
                          height: 8,
                          background: T.surfaceLow,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >

                        <div
                          style={{
                            width:
                              service.performance +
                              "%",
                            height: "100%",
                            background: T.bronze,
                          }}
                        />

                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                            color: "#f59e0b",
                            fontWeight: 700,
                          }}
                        >
                          ⭐ {service.rating}
                        </div>

                        <div
                          style={{
                            color: T.green,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Excellent
                        </div>

                      </div>

                    </div>

                    {/* Buttons */}

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 22,
                      }}
                    >

                      <button
                        style={{
                          flex: 1,
                          height: 42,
                          border: "none",
                          borderRadius: 10,
                          background: T.slate,
                          color: T.white,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        style={{
                          width: 44,
                          borderRadius: 10,
                          border: `1px solid ${T.border}`,
                          background: T.white,
                          cursor: "pointer",
                          fontSize: 18,
                        }}
                      >
                        ⋮
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>
                    

          {/* ================= Right Panel ================= */}

          {bp.isDesktop && (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >

              {/* Performance */}

              <div
                style={{
                  background: T.slate,
                  color: T.white,
                  borderRadius: 18,
                  padding: 22,
                  overflow: "hidden",
                  position: "relative",
                }}
              >

                <div
                  style={{
                    fontSize: 13,
                    opacity: .75,
                  }}
                >
                  Overall Performance
                </div>

                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 700,
                    marginTop: 12,
                    fontFamily: "Geist,sans-serif",
                  }}
                >
                  92%
                </div>

                <div
                  style={{
                    marginTop: 14,
                    height: 8,
                    background: "rgba(255,255,255,.15)",
                    borderRadius: 100,
                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      width: "92%",
                      height: "100%",
                      background: T.bronze,
                    }}
                  />

                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontSize: 13,
                    lineHeight: 1.8,
                    opacity: .8,
                  }}
                >
                  Your services are performing better than
                  81% of vendors this month.
                </div>

              </div>

              {/* Tips */}

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 20,
                }}
              >

                <h3
                  style={{
                    fontFamily: "Geist,sans-serif",
                    color: T.slate,
                    fontSize: 18,
                    marginBottom: 18,
                  }}
                >
                  Improve Bookings
                </h3>

                {[
                  "Add at least 5 photos",
                  "Keep response time under 15 mins",
                  "Offer weekend discounts",
                  "Update pricing monthly",
                  "Maintain 4.8★ rating",
                ].map((tip) => (

                  <div
                    key={tip}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 14,
                      alignItems: "flex-start",
                    }}
                  >

                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: T.bronze,
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />

                    <div
                      style={{
                        color: T.slateGray,
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    >
                      {tip}
                    </div>

                  </div>

                ))}

              </div>

              {/* Recent Activity */}

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 20,
                }}
              >

                <h3
                  style={{
                    fontFamily: "Geist,sans-serif",
                    color: T.slate,
                    fontSize: 18,
                    marginBottom: 18,
                  }}
                >
                  Recent Activity
                </h3>

                {[
                  "⭐ New 5 star review received",
                  "📅 Interior Painting booked",
                  "👀 Cleaning viewed 43 times",
                  "💰 ₹8,500 payment received",
                ].map((item) => (

                  <div
                    key={item}
                    style={{
                      padding: "12px 0",
                      borderBottom: `1px solid ${T.border}`,
                      color: T.slateGray,
                      fontSize: 13,
                    }}
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </Fade>

            {filteredServices.length === 0 && (

        <Fade>

          <div
            style={{
              marginTop: 50,
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: 60,
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: 60,
              }}
            >
              📦
            </div>

            <h2
              style={{
                marginTop: 20,
                color: T.slate,
                fontFamily: "Geist,sans-serif",
              }}
            >
              No Services Found
            </h2>

            <p
              style={{
                marginTop: 8,
                color: T.slateGray,
              }}
            >
              Create your first professional service.
            </p>

          </div>

        </Fade>

      )}
            {bp.isMobile && (

        <button
          style={{
            position: "fixed",
            right: 18,
            bottom:
              MOBILE_BOTTOM_NAV_HEIGHT + 18,
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "none",
            background: T.bronze,
            color: T.white,
            cursor: "pointer",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >

          <Plus size={24} />

        </button>

      )}

    </div>

  );

}