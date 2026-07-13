import { useEffect, useMemo, useState } from "react";
import { getVendorServices } from "@/services/serviceService";
import Fade from "@/components/vendor/common/Fade";

import { T, MOBILE_BOTTOM_NAV_HEIGHT } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

import {
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpRight,
  Star,
  Wallet,
  Package,
  Eye,
  CalendarCheck,
  IndianRupee,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

/* ============================================================
   Design tokens — Artisan Precision system
   Deep Slate #1E293B · Bronze #A88A64 · Soft Ivory #F8F5F0
   ============================================================ */

const SLATE = "#1E293B";
const SLATE_GRAY = "#64748B";
const BRONZE = "#A88A64";
const IVORY = "#F8F5F0";
const BORDER = "#E2E8F0";
const WHITE = "#FFFFFF";

const SHADOW_HOVER = "0 4px 20px rgba(30,41,59,0.12)";
const SHADOW_MODAL = "0 12px 40px rgba(30,41,59,0.20)";

const RADIUS_INTERACTIVE = 4; // buttons, inputs, chips
const RADIUS_CARD = 8; // cards, containers

const GEIST = "Geist, sans-serif";
const INTER = "Inter, sans-serif";

const labelSm = {
  fontFamily: GEIST,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

// const SERVICES = [
//   {
//     id: 1,
//     name: "Home Deep Cleaning",
//     category: "Cleaning",
//     price: 799,
//     duration: "90 mins",
//     bookings: 158,
//     revenue: 18400,
//     rating: 4.9,
//     views: 1240,
//     status: "active",
//     performance: 92,
//   },
//   {
//     id: 2,
//     name: "Interior Painting",
//     category: "Painting",
//     price: 3500,
//     duration: "1 Day",
//     bookings: 82,
//     revenue: 28600,
//     rating: 4.8,
//     views: 920,
//     status: "active",
//     performance: 81,
//   },
//   {
//     id: 3,
//     name: "Electrical Repair",
//     category: "Electrical",
//     price: 499,
//     duration: "45 mins",
//     bookings: 64,
//     revenue: 9600,
//     rating: 4.7,
//     views: 640,
//     status: "pending",
//     performance: 64,
//   },
//   {
//     id: 4,
//     name: "False Ceiling",
//     category: "Construction",
//     price: 5200,
//     duration: "2 Days",
//     bookings: 28,
//     revenue: 41600,
//     rating: 4.6,
//     views: 420,
//     status: "paused",
//     performance: 44,
//   },
// ];

const FILTERS = ["All", "Active", "Pending", "Paused"];

const STATUS_META = {
  active: { color: "#3F7A52", bg: "#EAF3EC", label: "Active" },
  pending: { color: "#9A6A1E", bg: "#F7EFE1", label: "Pending" },
  paused: { color: "#9A3B34", bg: "#F6E9E8", label: "Paused" },
};

export default function Services() {
  const bp = useBreakpoint();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [gridView, setGridView] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchServices = async () => {

        try {

            const response = await getVendorServices();


            setServices(response.data);


        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    fetchServices();

}, []);


  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchMatch =
        service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        (service.categoryId?.name || "").toLowerCase().includes(search.toLowerCase());

      const filterMatch =
  activeFilter === "All"
    ? true
    : activeFilter === "Active"
    ? service.isActive
    : !service.isActive;

      return searchMatch && filterMatch;
    });
  }, [search, services, activeFilter]);

  return (
    <div
      style={{
        padding: bp.isMobile ? 16 : 32,
        paddingBottom: bp.isMobile ? MOBILE_BOTTOM_NAV_HEIGHT + 24 : 32,
        background: IVORY,
        minHeight: "100%",
      }}
    >
      {/* ================= Header ================= */}
      <Fade>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ ...labelSm, color: BRONZE, marginBottom: 8 }}>
              Vendor Panel
            </div>
            <h1
              style={{
                fontFamily: GEIST,
                fontSize: bp.isMobile ? 26 : 32,
                fontWeight: 600,
                color: SLATE,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Services
            </h1>
            <p
              style={{
                marginTop: 6,
                color: SLATE_GRAY,
                fontFamily: INTER,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Manage, price, and grow every service you offer.
            </p>
          </div>

          <button
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              height: 46,
              padding: "0 20px",
              border: "none",
              borderRadius: RADIUS_INTERACTIVE,
              background: SLATE,
              color: IVORY,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: GEIST,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: hoveredButton === "add" ? SHADOW_HOVER : "none",
              transform: hoveredButton === "add" ? "translateY(-1px)" : "none",
              transition: "all .2s ease",
            }}
          >
            <Plus size={17} />
            Add Service
          </button>
        </div>
      </Fade>

      {/* ================= Hero + Summary ================= */}
      <Fade delay={0.08}>
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: bp.isDesktop
              ? "1.6fr 1fr 1fr"
              : bp.isTablet
              ? "repeat(2,1fr)"
              : "1fr",
            gap: 16,
          }}
        >
          {/* Revenue hero */}
          <div
            style={{
              background: SLATE,
              color: IVORY,
              borderRadius: RADIUS_CARD,
              padding: 28,
              position: "relative",
              overflow: "hidden",
              borderTop: `2px solid ${BRONZE}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ ...labelSm, opacity: 0.65, letterSpacing: "0.1em" }}>
                  Revenue · This Month
                </div>
                <h2
                  style={{
                    marginTop: 14,
                    fontSize: 40,
                    fontFamily: GEIST,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹48,320
                </h2>
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#D9C4A6",
                    fontFamily: INTER,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <ArrowUpRight size={15} />
                  18% vs last month
                </div>
              </div>

              {/* sparkline */}
              <svg width="96" height="40" viewBox="0 0 96 40" style={{ opacity: 0.9 }}>
                <polyline
                  points="0,32 14,28 28,30 42,20 56,22 70,10 84,14 96,4"
                  fill="none"
                  stroke={BRONZE}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                gap: 28,
              }}
            >
              <div>
                <div style={{ fontFamily: GEIST, fontSize: 20, fontWeight: 600 }}>428</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2, fontFamily: INTER }}>
                  Bookings
                </div>
              </div>
              <div>
                <div style={{ fontFamily: GEIST, fontSize: 20, fontWeight: 600 }}>18%</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2, fontFamily: INTER }}>
                  Conversion
                </div>
              </div>
            </div>
          </div>

          {[
            { title: "Active Services", value: "12", icon: Package },
            { title: "Average Rating", value: "4.9", icon: Star },
          ].map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredCard === item.title;
            return (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredCard(item.title)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: RADIUS_CARD,
                  padding: 24,
                  boxShadow: isHovered ? SHADOW_HOVER : "none",
                  transition: "box-shadow .2s ease",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: RADIUS_INTERACTIVE,
                    background: IVORY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={BRONZE} />
                </div>

                <div
                  style={{
                    marginTop: 24,
                    fontSize: 30,
                    fontWeight: 600,
                    fontFamily: GEIST,
                    color: SLATE,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.value}
                </div>

                <div style={{ marginTop: 6, color: SLATE_GRAY, fontSize: 13, fontFamily: INTER }}>
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
            marginTop: 28,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <Search
              size={17}
              color={SLATE_GRAY}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              placeholder="Search services or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                height: 46,
                paddingLeft: 46,
                paddingRight: 16,
                border: searchFocused ? `1px solid ${SLATE}` : `1px solid ${BORDER}`,
                borderRadius: RADIUS_INTERACTIVE,
                background: WHITE,
                outline: "none",
                fontFamily: INTER,
                fontSize: 14,
                color: SLATE,
                transition: "border-color .15s ease",
              }}
            />
          </div>

          <button
            style={{
              height: 46,
              padding: "0 18px",
              borderRadius: RADIUS_INTERACTIVE,
              border: `1px solid ${SLATE_GRAY}`,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: GEIST,
              fontSize: 13,
              fontWeight: 600,
              color: SLATE,
            }}
          >
            <SlidersHorizontal size={15} />
            {!bp.isMobile && "Filters"}
          </button>

          {!bp.isMobile && (
            <div
              style={{
                display: "flex",
                border: `1px solid ${BORDER}`,
                borderRadius: RADIUS_INTERACTIVE,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setGridView(true)}
                style={{
                  width: 44,
                  height: 44,
                  border: "none",
                  cursor: "pointer",
                  background: gridView ? SLATE : WHITE,
                  color: gridView ? IVORY : SLATE_GRAY,
                  transition: "all .15s ease",
                }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setGridView(false)}
                style={{
                  width: 44,
                  height: 44,
                  border: "none",
                  cursor: "pointer",
                  background: !gridView ? SLATE : WHITE,
                  color: !gridView ? IVORY : SLATE_GRAY,
                  transition: "all .15s ease",
                }}
              >
                <List size={16} />
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
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
            marginTop: 20,
          }}
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  whiteSpace: "nowrap",
                  height: 36,
                  padding: "0 16px",
                  borderRadius: 999,
                  border: active ? "none" : `1px solid ${BORDER}`,
                  background: active ? SLATE : WHITE,
                  color: active ? IVORY : SLATE_GRAY,
                  fontFamily: GEIST,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: ".15s ease",
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </Fade>

      {/* ================= Quick Stats ================= */}
      <Fade delay={0.2}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: bp.isDesktop ? "repeat(4,1fr)" : "repeat(2,1fr)",
            gap: 12,
            marginTop: 20,
          }}
        >
          {[
            { label: "Bookings", value: "428", icon: CalendarCheck },
            { label: "Revenue", value: "₹48K", icon: IndianRupee },
            { label: "Views", value: "3.2K", icon: Eye },
            { label: "Conversion", value: "18%", icon: ArrowUpRight },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  background: WHITE,
                  borderRadius: RADIUS_CARD,
                  border: `1px solid ${BORDER}`,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: RADIUS_INTERACTIVE,
                    background: IVORY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color={BRONZE} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: SLATE,
                      fontFamily: GEIST,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: SLATE_GRAY, fontFamily: INTER, marginTop: 1 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Fade>

      {/* ================= Services Section ================= */}
      <Fade delay={0.25}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: bp.isDesktop ? "2fr 320px" : "1fr",
            gap: 24,
            alignItems: "start", 
            marginTop: 32,
          }}
        >
          {/* ================= Left: Service Cards ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                bp.isDesktop && gridView ? "repeat(2,minmax(0,1fr))" : "1fr",
              gap: 16,
            }}
          >
            
            {filteredServices.map((service) => {
             
             const statusKey = service.isActive ? "active" : "paused";

const meta = STATUS_META[statusKey];

const isHovered = hoveredCard === service._id;
              return (
                <div
                  key={service._id}
                  onMouseEnter={() => setHoveredCard(service._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: WHITE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: RADIUS_CARD,
                    overflow: "hidden",
                    boxShadow: isHovered ? SHADOW_HOVER : "none",
                    transform: isHovered ? "translateY(-2px)" : "none",
                    transition: "all .25s ease",
                  }}
                >
                  {/* Media */}
                  <div
                    style={{
                      height: 140,
                      background: IVORY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 44,
                      filter: isHovered ? "grayscale(0%)" : "grayscale(35%)",
                      transition: "filter .3s ease",
                      position: "relative",
                    }}
                  >
                    🛠️
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        ...labelSm,
                        color: meta.color,
                        background: meta.bg,
                        padding: "5px 10px",
                        borderRadius: 999,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {meta.label}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
                      <div>
                        <h3
                          style={{
                            fontFamily: GEIST,
                            fontSize: 19,
                            fontWeight: 600,
                            color: SLATE,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {service.serviceName}
                        </h3>
                        <div
                          style={{
                            marginTop: 8,
                            display: "inline-block",
                            background: IVORY,
                            color: SLATE,
                            fontFamily: INTER,
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: RADIUS_INTERACTIVE,
                          }}
                        >
                          {service.categoryId?.name}
                        </div>
                      </div>
                    </div>

                    {/* Price + Duration */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 22,
                        paddingTop: 18,
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      <div>
                        <div style={{ ...labelSm, color: SLATE_GRAY, letterSpacing: "0.06em" }}>
                          Starting From
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontFamily: GEIST,
                            fontSize: 26,
                            fontWeight: 600,
                            color: SLATE,
                          }}
                        >
                         ₹{service.startingPrice}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...labelSm, color: SLATE_GRAY, letterSpacing: "0.06em" }}>
                          Duration
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontFamily: INTER,
                            fontWeight: 500,
                            color: SLATE,
                            fontSize: 15,
                          }}
                        >
                          {service.duration} mins
                        </div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div
                      style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 8,
                      }}
                    >
                      {[
                        { value: service.totalBookings, label: "Bookings" },
                        { value: 0, label: "Views" },
                        { value: "₹" + (0).toFixed(1) + "K", label: "Revenue" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          style={{
                            background: IVORY,
                            borderRadius: RADIUS_INTERACTIVE,
                            padding: "10px 6px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: SLATE,
                              fontFamily: GEIST,
                            }}
                          >
                            {item.value}
                          </div>
                          <div style={{ marginTop: 2, fontSize: 10.5, color: SLATE_GRAY, fontFamily: INTER }}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Performance */}
                    <div style={{ marginTop: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12.5, color: SLATE_GRAY, fontFamily: INTER }}>
                          Performance
                        </span>
                        <span style={{ fontWeight: 600, color: SLATE, fontFamily: GEIST, fontSize: 13 }}>
                        --
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: IVORY,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: 0 + "%",
                            height: "100%",
                            background: BRONZE,
                            borderRadius: 999,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <Star size={14} fill={BRONZE} color={BRONZE} />
                          <span style={{ fontFamily: GEIST, fontWeight: 600, color: SLATE, fontSize: 13 }}>
                            {(service.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <div style={{ color: "#3F7A52", fontSize: 12, fontWeight: 600, fontFamily: INTER }}>
                          Excellent
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div
  style={{
    display: "flex",
    gap: 8,
    marginTop: 22,
    alignItems: "center",
  }}
>
                      <button
                        style={{
                          flex: 1,
minWidth: 0,
                          height: 40,
                          border: "none",
                          borderRadius: RADIUS_INTERACTIVE,
                          background: SLATE,
                          color: IVORY,
                          cursor: "pointer",
                          fontFamily: GEIST,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        Edit Service
                      </button>
                      <button
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: RADIUS_INTERACTIVE,
                          border: `1px solid ${BORDER}`,
                          background: WHITE,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: SLATE_GRAY,
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= Right Panel ================= */}
          {bp.isDesktop && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Performance */}
              <div
                style={{
                  background: SLATE,
                  color: IVORY,
                  borderRadius: RADIUS_CARD,
                  padding: 24,
                  borderTop: `2px solid ${BRONZE}`,
                }}
              >
                <div style={{ ...labelSm, opacity: 0.65 }}>Overall Performance</div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    marginTop: 12,
                    fontFamily: GEIST,
                    letterSpacing: "-0.02em",
                  }}
                >
                  92%
                </div>
                <div
                  style={{
                    marginTop: 14,
                    height: 6,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 100,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: "92%", height: "100%", background: BRONZE, borderRadius: 100 }} />
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 13,
                    lineHeight: 1.7,
                    opacity: 0.75,
                    fontFamily: INTER,
                  }}
                >
                  Your services are performing better than 81% of vendors this month.
                </div>
              </div>

              {/* Tips */}
              <div
                style={{
                  background: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: RADIUS_CARD,
                  padding: 22,
                }}
              >
                <h3
                  style={{
                    fontFamily: GEIST,
                    color: SLATE,
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 16,
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
                ].map((tip, i) => (
                  <div
                    key={tip}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...labelSm,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: IVORY,
                        color: BRONZE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 10,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ color: SLATE_GRAY, fontSize: 13, lineHeight: 1.6, fontFamily: INTER }}>
                      {tip}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div
                style={{
                  background: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: RADIUS_CARD,
                  padding: 22,
                }}
              >
                <h3
                  style={{
                    fontFamily: GEIST,
                    color: SLATE,
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  Recent Activity
                </h3>

                {[
                  "New 5-star review received",
                  "Interior Painting booked",
                  "Cleaning viewed 43 times",
                  "₹8,500 payment received",
                ].map((item, i, arr) => (
                  <div
                    key={item}
                    style={{
                      padding: "12px 0",
                      borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                      color: SLATE_GRAY,
                      fontSize: 13,
                      fontFamily: INTER,
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

      {/* ================= Empty State ================= */}
      {filteredServices.length === 0 && (
        <Fade>
          <div
            style={{
              marginTop: 40,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: RADIUS_CARD,
              padding: 60,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto",
                borderRadius: "50%",
                background: IVORY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package size={24} color={BRONZE} />
            </div>
            <h2
              style={{
                marginTop: 20,
                color: SLATE,
                fontFamily: GEIST,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              No services found
            </h2>
            <p style={{ marginTop: 8, color: SLATE_GRAY, fontFamily: INTER, fontSize: 14 }}>
              Try a different search, or add your first professional service.
            </p>
          </div>
        </Fade>
      )}

      {/* ================= Mobile FAB ================= */}
      {bp.isMobile && (
        <button
          style={{
            position: "fixed",
            right: 18,
            bottom: MOBILE_BOTTOM_NAV_HEIGHT + 18,
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "none",
            background: BRONZE,
            color: WHITE,
            cursor: "pointer",
            boxShadow: SHADOW_MODAL,
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