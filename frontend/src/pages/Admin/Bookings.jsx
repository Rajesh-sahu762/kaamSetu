import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  IndianRupee,
  MapPin,
  Phone,
  User,
  Briefcase,
  X,
} from "lucide-react";

import api from "@/services/api";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";

import {
  ActionButton,
  EmptyTable,
  FilterButton,
  ManagementHeader,
  Pagination,
  StatusBadge,
  surface,
} from "@/components/admin/ManagementPrimitives";


const formatDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
};

const formatMoney = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const rowStyle = {
    color: T.slateGray,
    fontSize: 10,
    fontWeight: 750,
    textTransform: "uppercase",
    letterSpacing: ".07em",
  };

  const Row = ({ label, children }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <span style={rowStyle}>{label}</span>

      <span
        style={{
          color: T.slate,
          fontSize: 12,
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {children}
      </span>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "rgba(9,20,38,.55)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          width: 560,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          background: T.white,
          borderRadius: 18,
          boxShadow: "0 28px 65px rgba(9,20,38,.25)",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: T.slate,
                fontSize: 17,
                fontWeight: 750,
              }}
            >
              Booking Detail
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: T.slateGray,
                fontSize: 11,
              }}
            >
              Booking #{booking.bookingNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              color: T.slateGray,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "6px 20px 20px",
          }}
        >           <Row label="Customer">
            {booking.customerId?.fullName || "—"}
          </Row>

          <Row label="Customer Email">
            {booking.customerId?.email || "—"}
          </Row>

          <Row label="Customer Mobile">
            {booking.customerId?.mobile || "—"}
          </Row>
                    <Row label="Vendor">
            {booking.vendorId?.businessName || "—"}
          </Row>

          <Row label="Vendor Email">
            {booking.vendorId?.email || "—"}
          </Row>
                    <Row label="Service">
            {booking.serviceId?.serviceName || "—"}
          </Row>

          <Row label="Booking Date">
            {formatDate(booking.bookingDate)}
          </Row>

          <Row label="Booking Time">
            {booking.bookingTime || "—"}
          </Row>

                    <Row label="Status">
            <StatusBadge value={booking.status} />
          </Row>

          <Row label="Payment Status">
            <StatusBadge value={booking.paymentStatus} />
          </Row>

          <Row label="Payment Method">
            {booking.paymentMethod}
          </Row>

          <Row label="Amount">
            {formatMoney(booking.totalAmount)}
          </Row>

                    <Row label="Address">
            {booking.address || "—"}
          </Row>

          <Row label="Notes">
            {booking.notes || "—"}
          </Row>

          <Row label="Created">
            {formatDate(booking.createdAt)}
          </Row>

                    {booking.status === "cancelled" && (
            <>
              <Row label="Cancelled By">
                {booking.cancelledBy || "—"}
              </Row>

              <Row label="Reason">
                {booking.cancelReason || "—"}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingManagement = () => {
  const { isMobile } = useBreakpoint();

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [paymentStatus, setPaymentStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [viewing, setViewing] = useState(null);

    const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/bookings", {
        params: {
          page,
          limit: 10,
          search,
          status,
          paymentStatus,
        },
      });

      setBookings(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Could not load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status, paymentStatus]);

  useEffect(() => {
    const timeout = setTimeout(loadBookings, 250);

    return () => clearTimeout(timeout);
  }, [loadBookings]);

  const handleRefresh = () => {
    loadBookings();
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handlePaymentFilter = (event) => {
    setPaymentStatus(event.target.value);
    setPage(1);
  };

  const handleViewBooking = async (bookingId) => {
    try {
      setError("");

      const response = await api.get(`/admin/bookings/${bookingId}`);

      setViewing(response.data.data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Could not load booking details."
      );
    }
  };

  return (
    <main
      style={{
        padding: isMobile
          ? "18px 14px 36px"
          : "28px clamp(20px, 3vw, 48px) 48px",
        minHeight: "100%",
        background: T.ivory,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
                <ManagementHeader
          eyebrow="Bookings"
          title="Booking Management"
          description="Monitor all customer bookings across the platform."
          search={search}
          onSearch={handleSearch}
          searchPlaceholder="Search booking number, customer, vendor or service"
          refreshing={loading}
          onRefresh={handleRefresh}
        >
          {[
            "all",
            "pending",
            "accepted",
            "on_the_way",
            "in_progress",
            "completed",
            "cancelled",
            "rejected",
          ].map((item) => (
            <FilterButton
              key={item}
              active={status === item}
              onClick={() => handleStatusFilter(item)}
            >
              {item.replaceAll("_", " ")}
            </FilterButton>
          ))}

          <select
            value={paymentStatus}
            onChange={handlePaymentFilter}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              background: T.white,
              color: T.slate,
              padding: "8px 10px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </ManagementHeader>
                {error && (
          <div
            style={{
              border: "1px solid rgba(239,68,68,.25)",
              background: T.redDim,
              borderRadius: 10,
              padding: "11px 13px",
              color: T.red,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

                <section
          style={{
            ...surface,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "15px 17px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                color: T.slate,
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              Booking List
            </div>

            <span
              style={{
                color: T.slateGray,
                fontSize: 11,
              }}
            >
              {pagination?.total || 0} bookings
            </span>
          </div>
                    {loading ? (
            <div
              style={{
                padding: 56,
                textAlign: "center",
                color: T.slateGray,
                fontSize: 12,
              }}
            >
              Loading bookings...
            </div>
          ) : bookings.length ? (
            <div
              style={{
                // overflowX: "auto",
              }}
            >
                              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: 1200,
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Booking",
                      "Customer",
                      "Vendor",
                      "Service",
                      "Date",
                      "Amount",
                      "Payment",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "11px 16px",
                          color: T.slateGray,
                          background: T.surfaceLow,
                          borderBottom: `1px solid ${T.border}`,
                          textAlign: "left",
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                                              <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            color: T.slate,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          #{booking.bookingNumber}
                        </div>

                        <div
                          style={{
                            marginTop: 3,
                            color: T.slateGray,
                            fontSize: 10,
                          }}
                        >
                          {formatDate(booking.createdAt)}
                        </div>
                      </td>
                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            color: T.slate,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {booking.customerId?.fullName || "—"}
                        </div>

                        <div
                          style={{
                            marginTop: 3,
                            color: T.slateGray,
                            fontSize: 10,
                          }}
                        >
                          {booking.customerId?.mobile || "—"}
                        </div>
                      </td>

                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          color: T.slateGray,
                          fontSize: 11,
                        }}
                      >
                        {booking.vendorId?.businessName || "—"}
                      </td>
                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            color: T.slate,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {booking.serviceId?.serviceName || "—"}
                        </div>

                        <div
                          style={{
                            marginTop: 3,
                            color: T.slateGray,
                            fontSize: 10,
                          }}
                        >
                          {booking.bookingTime || "—"}
                        </div>
                      </td>

                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          color: T.slateGray,
                          fontSize: 11,
                        }}
                      >
                        {formatDate(booking.bookingDate)}
                      </td>

                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          color: T.slate,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <IndianRupee
                          size={11}
                          style={{
                            verticalAlign: "-1px",
                            marginRight: 2,
                          }}
                        />

                        {Number(
                          booking.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <StatusBadge value={booking.paymentStatus} />

                        <div
                          style={{
                            marginTop: 5,
                            color: T.slateGray,
                            fontSize: 10,
                            textTransform: "capitalize",
                          }}
                        >
                          {booking.paymentMethod}
                        </div>
                      </td>
                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <StatusBadge value={booking.status} />
                      </td>

                                            <td
                        style={{
                          padding: "13px 16px",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <ActionButton
                          onClick={() =>
                            handleViewBooking(booking._id)
                          }
                        >
                          View
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                      ) : (
            <EmptyTable label="No bookings match the selected filters." />
          )}

          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        </section>
      </div>

      <BookingDetailModal
        booking={viewing}
        onClose={() => setViewing(null)}
      />
    </main>
  );
};

export default BookingManagement;