import { useCallback, useEffect, useState } from "react";
import { Ban, Trash2, UserCheck, Users } from "lucide-react";
import api from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { ActionButton, EmptyTable, FilterButton, ManagementHeader, Pagination, StatusBadge, surface } from "@/components/admin/ManagementPrimitives";

const Customers = () => {
  const { isMobile } = useBreakpoint();
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/admin/users", { params: { page, limit: 10, status, search } });
      setCustomers(response.data.data || []); setPagination(response.data.pagination || null);
    } catch (requestError) { setError(requestError?.response?.data?.message || "Could not load customers."); }
    finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { const timeout = setTimeout(loadCustomers, 250); return () => clearTimeout(timeout); }, [loadCustomers]);
  const changeSearch = (value) => { setSearch(value); setPage(1); };
  const changeStatus = (value) => { setStatus(value); setPage(1); };
  const completeAction = async () => {
    if (!action) return;
    try {
      setSubmitting(true);
      if (action.type === "delete") await api.delete(`/admin/users/${action.customer._id}`);
      else await api.patch(`/admin/users/${action.customer._id}/${action.type}`);
      setAction(null); loadCustomers();
    } catch (requestError) { setError(requestError?.response?.data?.message || "The customer action could not be completed."); }
    finally { setSubmitting(false); }
  };

  const actionCopy = action?.type === "delete" ? { title: "Delete customer?", message: "This soft-deletes the account and removes it from customer management.", confirm: "Delete customer", danger: true } : action?.type === "suspend" ? { title: "Suspend customer?", message: "The customer will no longer be able to sign in until an administrator reactivates the account.", confirm: "Suspend", danger: true } : { title: "Reactivate customer?", message: "The customer will be able to sign in again.", confirm: "Reactivate", danger: false };

  return <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
    <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
      <ManagementHeader eyebrow="User management" title="Customers" description="Review customer accounts and manage access." search={search} onSearch={changeSearch} searchPlaceholder="Search name, email, or mobile" refreshing={loading} onRefresh={loadCustomers}>{["all", "active", "suspended"].map((item) => <FilterButton key={item} active={status === item} onClick={() => changeStatus(item)}>{item}</FilterButton>)}</ManagementHeader>
      {error && <div style={{ border: `1px solid rgba(239,68,68,.25)`, background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>{error}</div>}
      <section style={{ ...surface, overflow: "hidden" }}>
        <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}><Users size={16} color={T.bronze} />Customer directory</div><span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} accounts</span></div>
        {loading ? <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading customer accounts…</div> : customers.length ? <div style={{ overflowX: "auto" }}><table style={{ borderCollapse: "collapse", width: "100%", minWidth: 760 }}><thead><tr>{["Customer", "Contact", "Verification", "Status", "Joined", "Actions"].map((heading) => <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>{heading}</th>)}</tr></thead><tbody>{customers.map((customer) => <tr key={customer._id}>{<><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 31, height: 31, display: "grid", placeItems: "center", borderRadius: "50%", background: T.surfaceLow, color: T.slate, fontSize: 10, fontWeight: 800 }}>{customer.fullName?.slice(0, 1)?.toUpperCase() || "C"}</span><span style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{customer.fullName}</span></div></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ color: T.slate, fontSize: 11 }}>{customer.email}</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 10 }}>{customer.mobile || "—"}</div></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><StatusBadge value={customer.isVerified ? "verified" : "pending"} /></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><StatusBadge value={customer.isActive ? "active" : "suspended"} /></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(customer.createdAt))}</td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", gap: 10 }}>{customer.isActive ? <ActionButton tone="warning" onClick={() => setAction({ type: "suspend", customer })}><Ban size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Suspend</ActionButton> : <ActionButton tone="success" onClick={() => setAction({ type: "activate", customer })}><UserCheck size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Activate</ActionButton>}<ActionButton tone="danger" onClick={() => setAction({ type: "delete", customer })}><Trash2 size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Delete</ActionButton></div></td></>}</tr>)}</tbody></table></div> : <EmptyTable label="No customers match the selected filters." />}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
    </div>
    <ConfirmModal open={Boolean(action)} title={actionCopy.title} message={actionCopy.message} confirmText={actionCopy.confirm} danger={actionCopy.danger} loading={submitting} onCancel={() => !submitting && setAction(null)} onConfirm={completeAction} />
  </main>;
};

export default Customers;
