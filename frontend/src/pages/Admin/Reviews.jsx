import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, MessageSquareText, ShieldCheck, Star, Trash2, X } from "lucide-react";
import api from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { ActionButton, EmptyTable, FilterButton, ManagementHeader, Pagination, StatusBadge, surface } from "@/components/admin/ManagementPrimitives";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const Stars = ({ value = 0 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={12} color={T.bronze} fill={star <= Math.round(value) ? T.bronze : "none"} strokeWidth={1.6} />
    ))}
  </div>
);

const truncate = (text = "", length = 90) => (text.length > length ? `${text.slice(0, length).trim()}…` : text || "—");

const ReviewDetailModal = ({ review, onClose }) => {
  if (!review) return null;
  const rowStyle = { color: T.slateGray, fontSize: 11, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" };
  return (
    <div style={{ position: "fixed", zIndex: 100, inset: 0, display: "grid", placeItems: "center", padding: 16, background: "rgba(9,20,38,.55)", backdropFilter: "blur(5px)" }}>
      <div style={{ width: 560, maxWidth: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: T.white, borderRadius: 18, boxShadow: "0 28px 65px rgba(9,20,38,.25)" }}>
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
          <div>
            <h2 style={{ color: T.slate, margin: 0, fontSize: 17, fontWeight: 750 }}>Review detail</h2>
            <p style={{ color: T.slateGray, margin: "4px 0 0", fontSize: 11 }}>{review.vendor?.businessName || "Vendor"} · {review.service?.serviceName || "Service"}</p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 0, cursor: "pointer", background: "transparent", color: T.slateGray }}><X size={20} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Stars value={review.rating} />
            <span style={{ color: T.slateGray, fontSize: 11 }}>{formatDate(review.createdAt)}</span>
          </div>
          <div>
            <div style={rowStyle}>Customer</div>
            <div style={{ marginTop: 5, color: T.slate, fontSize: 12, fontWeight: 700 }}>{review.customer?.fullName || "—"}</div>
            <div style={{ color: T.slateGray, fontSize: 11 }}>{review.customer?.email || ""}</div>
          </div>
          <div>
            <div style={rowStyle}>Review</div>
            <p style={{ marginTop: 5, color: T.slate, fontSize: 12, lineHeight: 1.6 }}>{review.review || "No written feedback provided."}</p>
          </div>
          {review.vendorReply && (
            <div style={{ background: T.surfaceLow, borderRadius: 10, padding: 12 }}>
              <div style={rowStyle}>Vendor reply</div>
              <p style={{ marginTop: 5, color: T.slate, fontSize: 12, lineHeight: 1.6 }}>{review.vendorReply}</p>
              {review.vendorRepliedAt && <div style={{ marginTop: 5, color: T.slateGray, fontSize: 10 }}>{formatDate(review.vendorRepliedAt)}</div>}
            </div>
          )}
          {review.isReported && (
            <div style={{ background: T.redDim, borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.red, fontSize: 11, fontWeight: 750 }}><AlertTriangle size={13} />Reported · {review.reportReason || "No reason given"}</div>
              {review.reportedAt && <div style={{ marginTop: 5, color: T.slateGray, fontSize: 10 }}>{formatDate(review.reportedAt)}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const { isMobile } = useBreakpoint();
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [reported, setReported] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [resolving, setResolving] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/reviews", {
        params: { page, limit: 10, rating, reported, search },
      });
      setReviews(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, [page, search, rating, reported]);

  useEffect(() => {
    const timeout = setTimeout(loadReviews, 250);
    return () => clearTimeout(timeout);
  }, [loadReviews]);

  const reportedCount = useMemo(() => reviews.filter((review) => review.isReported).length, [reviews]);
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const resolveReport = async (review) => {
    try {
      setResolving(review._id);
      setError("");
      await api.patch(`/admin/reviews/${review._id}/resolve-report`);
      loadReviews();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The report could not be dismissed.");
    } finally {
      setResolving("");
    }
  };

  const runDelete = async () => {
    if (!deleting) return;
    try {
      setSubmitting(true);
      setError("");
      await api.delete(`/admin/reviews/${deleting._id}`);
      setDeleting(null);
      loadReviews();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The review could not be removed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <ManagementHeader
          eyebrow="Trust & safety"
          title="Reviews"
          description="Moderate customer feedback and resolve vendor-reported reviews."
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchPlaceholder="Search review, customer, vendor, or service"
          refreshing={loading}
          onRefresh={loadReviews}
        >
          {["all", "reported", "clean"].map((item) => (
            <FilterButton key={item} active={reported === item} onClick={() => { setReported(item); setPage(1); }}>
              {item}
            </FilterButton>
          ))}
          <select
            value={rating}
            onChange={(event) => { setRating(event.target.value); setPage(1); }}
            style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            <option value="all">All ratings</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} star</option>
            ))}
          </select>
        </ManagementHeader>
        {error && (
          <div style={{ border: "1px solid rgba(239,68,68,.25)", background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>
            {error}
          </div>
        )}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Visible results</div>
            <div style={{ marginTop: 7, color: T.slate, fontSize: 22, fontWeight: 750 }}>{reviews.length}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Avg rating on page</div>
            <div style={{ marginTop: 7, color: T.bronze, fontSize: 22, fontWeight: 750 }}>{avgRating}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Reported on page</div>
            <div style={{ marginTop: 7, color: T.red, fontSize: 22, fontWeight: 750 }}>{reportedCount}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Total reviews</div>
            <div style={{ marginTop: 7, color: T.slate, fontSize: 22, fontWeight: 750 }}>{pagination?.total || 0}</div>
          </div>
        </section>
        <section style={{ ...surface, overflow: "hidden" }}>
          <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}>
              <MessageSquareText size={16} color={T.bronze} />
              Review feed
            </div>
            <span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} reviews</span>
          </div>
          {loading ? (
            <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading reviews…</div>
          ) : reviews.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 980 }}>
                <thead>
                  <tr>
                    {["Review", "Customer", "Vendor / Service", "Rating", "Status", "Date", "Actions"].map((heading) => (
                      <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, maxWidth: 260 }}>
                        <span title={review.review} style={{ color: T.slate, fontSize: 11.5 }}>{truncate(review.review, 80)}</span>
                        {review.vendorReply && <div style={{ marginTop: 4, color: T.slateGray, fontSize: 10 }}>↳ Vendor replied</div>}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11 }}>
                        {review.customer?.fullName || "—"}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {review.vendor?.businessName || "—"}
                        <div style={{ marginTop: 3, fontSize: 10 }}>{review.service?.serviceName || ""}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <Stars value={review.rating} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        {review.isReported ? <StatusBadge value="reported" /> : <StatusBadge value="clean" />}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {formatDate(review.createdAt)}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <ActionButton onClick={() => setViewing(review)}>View</ActionButton>
                          {review.isReported && (
                            <ActionButton tone="success" disabled={resolving === review._id} onClick={() => resolveReport(review)}>
                              <ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                              {resolving === review._id ? "Saving…" : "Dismiss"}
                            </ActionButton>
                          )}
                          <ActionButton tone="danger" onClick={() => setDeleting(review)}>
                            <Trash2 size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                            Remove
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTable label="No reviews match the selected filters." />
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </section>
      </div>
      <ReviewDetailModal review={viewing} onClose={() => setViewing(null)} />
      <ConfirmModal
        open={Boolean(deleting)}
        title="Remove this review?"
        message="The review will be permanently removed and will no longer count toward the vendor's rating. This cannot be undone."
        confirmText="Remove review"
        danger
        loading={submitting}
        onCancel={() => !submitting && setDeleting(null)}
        onConfirm={runDelete}
      />
    </main>
  );
};

export default Reviews;