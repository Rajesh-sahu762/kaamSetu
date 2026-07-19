import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, IndianRupee, RefreshCcw, Wallet, X } from "lucide-react";
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

const formatMoney = (value = 0) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;
  const rowStyle = { color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" };
  const Row = ({ label, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={rowStyle}>{label}</span>
      <span style={{ color: T.slate, fontSize: 12, fontWeight: 700, textAlign: "right" }}>{children}</span>
    </div>
  );
  return (
    <div style={{ position: "fixed", zIndex: 100, inset: 0, display: "grid", placeItems: "center", padding: 16, background: "rgba(9,20,38,.55)", backdropFilter: "blur(5px)" }}>
      <div style={{ width: 520, maxWidth: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: T.white, borderRadius: 18, boxShadow: "0 28px 65px rgba(9,20,38,.25)" }}>
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
          <div>
            <h2 style={{ color: T.slate, margin: 0, fontSize: 17, fontWeight: 750 }}>Transaction detail</h2>
            <p style={{ color: T.slateGray, margin: "4px 0 0", fontSize: 11 }}>{transaction.booking?.bookingNumber ? `Booking #${transaction.booking.bookingNumber}` : "No linked booking number"}</p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 0, cursor: "pointer", background: "transparent", color: T.slateGray }}><X size={20} /></button>
        </div>
        <div style={{ padding: "6px 20px 20px" }}>
          <Row label="Customer">{transaction.customer?.fullName || "—"}</Row>
          <Row label="Vendor">{transaction.vendor?.businessName || "—"}</Row>
          <Row label="Gross amount">{formatMoney(transaction.amount)}</Row>
          <Row label="Platform commission">{formatMoney(transaction.commission)} ({transaction.commissionRate || 0}%)</Row>
          <Row label="Vendor payout">{formatMoney(transaction.vendorAmount)}</Row>
          <Row label="Payment method">{transaction.paymentMethod}</Row>
          <Row label="Gateway">{transaction.paymentGateway}</Row>
          <Row label="Gateway transaction ID">{transaction.gatewayTransactionId || "—"}</Row>
          <Row label="Gateway order ID">{transaction.gatewayOrderId || "—"}</Row>
          <Row label="Status"><StatusBadge value={transaction.status} /></Row>
          <Row label="Settlement"><StatusBadge value={transaction.settlementStatus} /></Row>
          <Row label="Date">{formatDate(transaction.createdAt)}</Row>
          {transaction.remarks && (
            <div style={{ marginTop: 12, background: T.surfaceLow, borderRadius: 10, padding: 12 }}>
              <div style={rowStyle}>Remarks</div>
              <p style={{ marginTop: 5, color: T.slate, fontSize: 12, lineHeight: 1.6 }}>{transaction.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { isMobile } = useBreakpoint();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [settlement, setSettlement] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [settling, setSettling] = useState("");
  const [refundTarget, setRefundTarget] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/transactions", {
        params: { page, limit: 10, status, settlement, method, search },
      });
      setTransactions(response.data.data || []);
      setPagination(response.data.pagination || null);
      setSummary(response.data.summary || null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, settlement, method]);

  useEffect(() => {
    const timeout = setTimeout(loadTransactions, 250);
    return () => clearTimeout(timeout);
  }, [loadTransactions]);

  const advanceSettlement = async (transaction) => {
    const next = transaction.settlementStatus === "pending" ? "processing" : "settled";
    try {
      setSettling(transaction._id);
      setError("");
      await api.patch(`/admin/transactions/${transaction._id}/settlement`, { settlementStatus: next });
      loadTransactions();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The settlement status could not be updated.");
    } finally {
      setSettling("");
    }
  };

  const runRefund = async () => {
    if (!refundTarget) return;
    if (!remarks.trim()) { setError("A remark is required to mark a transaction as refunded."); return; }
    try {
      setSubmitting(true);
      setError("");
      await api.patch(`/admin/transactions/${refundTarget._id}/status`, { status: "refunded", remarks: remarks.trim() });
      setRefundTarget(null);
      setRemarks("");
      loadTransactions();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The transaction could not be refunded.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <ManagementHeader
          eyebrow="Finance"
          title="Transactions"
          description="Track platform revenue, vendor payouts, and settlement status."
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchPlaceholder="Search customer, vendor, booking, or gateway ID"
          refreshing={loading}
          onRefresh={loadTransactions}
        >
          {["all", "pending", "completed", "failed", "refunded"].map((item) => (
            <FilterButton key={item} active={status === item} onClick={() => { setStatus(item); setPage(1); }}>
              {item}
            </FilterButton>
          ))}
          <select
            value={settlement}
            onChange={(event) => { setSettlement(event.target.value); setPage(1); }}
            style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            <option value="all">All settlements</option>
            <option value="pending">Settlement pending</option>
            <option value="processing">Settlement processing</option>
            <option value="settled">Settled</option>
          </select>
          <select
            value={method}
            onChange={(event) => { setMethod(event.target.value); setPage(1); }}
            style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            <option value="all">All methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </ManagementHeader>
        {error && (
          <div style={{ border: "1px solid rgba(239,68,68,.25)", background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>
            {error}
          </div>
        )}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Gross revenue</div>
            <div style={{ marginTop: 7, color: T.slate, fontSize: 20, fontWeight: 750 }}>{formatMoney(summary?.totalAmount)}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Platform commission</div>
            <div style={{ marginTop: 7, color: T.bronze, fontSize: 20, fontWeight: 750 }}>{formatMoney(summary?.totalCommission)}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Pending payout</div>
            <div style={{ marginTop: 7, color: T.amber, fontSize: 20, fontWeight: 750 }}>{formatMoney(summary?.pendingSettlementAmount)}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Completed</div>
            <div style={{ marginTop: 7, color: T.green, fontSize: 20, fontWeight: 750 }}>{summary?.completedCount || 0}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Refunded / Failed</div>
            <div style={{ marginTop: 7, color: T.red, fontSize: 20, fontWeight: 750 }}>{summary?.refundedCount || 0} / {summary?.failedCount || 0}</div>
          </div>
        </section>
        <section style={{ ...surface, overflow: "hidden" }}>
          <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}>
              <Wallet size={16} color={T.bronze} />
              Payment ledger
            </div>
            <span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} transactions</span>
          </div>
          {loading ? (
            <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading transactions…</div>
          ) : transactions.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1040 }}>
                <thead>
                  <tr>
                    {["Customer", "Vendor", "Amount", "Method", "Status", "Settlement", "Date", "Actions"].map((heading) => (
                      <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11, fontWeight: 700 }}>
                        {transaction.customer?.fullName || "—"}
                        <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10, fontWeight: 500 }}>{transaction.booking?.bookingNumber ? `#${transaction.booking.bookingNumber}` : ""}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {transaction.vendor?.businessName || "—"}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11, fontWeight: 700 }}>
                        <IndianRupee size={11} style={{ verticalAlign: "-1px", marginRight: 2 }} />
                        {Number(transaction.amount || 0).toLocaleString("en-IN")}
                        <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10, fontWeight: 500 }}>Payout {formatMoney(transaction.vendorAmount)}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11, textTransform: "capitalize" }}>
                        {transaction.paymentMethod}
                        <div style={{ marginTop: 3, fontSize: 10 }}>{transaction.paymentGateway}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <StatusBadge value={transaction.status} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <StatusBadge value={transaction.settlementStatus} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <ActionButton onClick={() => setViewing(transaction)}>View</ActionButton>
                          {transaction.settlementStatus !== "settled" && transaction.status === "completed" && (
                            <ActionButton tone="success" disabled={settling === transaction._id} onClick={() => advanceSettlement(transaction)}>
                              {transaction.settlementStatus === "pending" ? <Clock3 size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} /> : <CheckCircle2 size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />}
                              {settling === transaction._id ? "Saving…" : transaction.settlementStatus === "pending" ? "Mark processing" : "Mark settled"}
                            </ActionButton>
                          )}
                          {["pending", "completed"].includes(transaction.status) && (
                            <ActionButton tone="danger" onClick={() => { setRefundTarget(transaction); setRemarks(""); }}>
                              <RefreshCcw size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                              Refund
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTable label="No transactions match the selected filters." />
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </section>
      </div>
      <TransactionDetailModal transaction={viewing} onClose={() => setViewing(null)} />
      <ConfirmModal
        open={Boolean(refundTarget)}
        title="Refund this transaction?"
        message="This marks the payment as refunded on the platform ledger. Process the actual gateway refund separately."
        confirmText="Confirm refund"
        danger
        loading={submitting}
        onCancel={() => !submitting && setRefundTarget(null)}
        onConfirm={runRefund}
      >
        <textarea
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Reason for refund (required)"
          rows={3}
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 9, padding: 10, fontFamily: "inherit", fontSize: 12, resize: "vertical", outline: "none" }}
        />
      </ConfirmModal>
    </main>
  );
};

export default Transactions;