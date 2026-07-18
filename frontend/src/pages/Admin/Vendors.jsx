import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Ban, Building2, FileWarning, ShieldCheck, XCircle } from "lucide-react";
import api from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { ActionButton, EmptyTable, FilterButton, ManagementHeader, Pagination, StatusBadge, surface } from "@/components/admin/ManagementPrimitives";

const Vendors = () => {
  const { isMobile } = useBreakpoint();
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/admin/vendors", { params: { page, limit: 10, status, search } });
      setVendors(response.data.data || []); setPagination(response.data.pagination || null);
    } catch (requestError) { setError(requestError?.response?.data?.message || "Could not load vendors."); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { const timeout = setTimeout(loadVendors, 250); return () => clearTimeout(timeout); }, [loadVendors]);
  const chooseAction = (type, vendor) => { setAction({ type, vendor }); setReason(""); };
  const runAction = async () => {
    if (!action) return;
    if (action.type === "reject" && !reason.trim()) { setError("A rejection reason is required."); return; }
    try {
      setSubmitting(true); setError("");
      const endpoint = `/admin/vendors/${action.vendor._id}/${action.type}`;
      const body = ["reject", "request-reupload"].includes(action.type) ? { reason: reason.trim() } : undefined;
      await api.patch(endpoint, body);
      setAction(null); loadVendors();
    } catch (requestError) { setError(requestError?.response?.data?.message || "The vendor action could not be completed."); }
    finally { setSubmitting(false); }
  };

  const actionInfo = {
    approve: { title: "Approve vendor?", message: "The provider will be marked as approved for the marketplace.", confirm: "Approve", danger: false },
    reject: { title: "Reject vendor?", message: "Provide a reason so the provider understands what needs to be corrected.", confirm: "Reject vendor", danger: true },
    "request-reupload": { title: "Request document re-upload?", message: "The vendor will return to pending review. An optional note can explain the request.", confirm: "Request re-upload", danger: false },
    suspend: { title: "Suspend vendor?", message: "The vendor account will not be able to sign in until reactivated.", confirm: "Suspend", danger: true },
    activate: { title: "Reactivate vendor?", message: "The vendor account will be able to sign in again.", confirm: "Reactivate", danger: false },
  }[action?.type] || {};

  return <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
    <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
      <ManagementHeader eyebrow="Partner management" title="Vendors" description="Verify service providers and manage marketplace access." search={search} onSearch={(value) => { setSearch(value); setPage(1); }} searchPlaceholder="Search business, city, or pincode" refreshing={loading} onRefresh={loadVendors}>{["all", "pending", "approved", "rejected"].map((item) => <FilterButton key={item} active={status === item} onClick={() => { setStatus(item); setPage(1); }}>{item}</FilterButton>)}</ManagementHeader>
      {error && <div style={{ border: `1px solid rgba(239,68,68,.25)`, background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>{error}</div>}
      <section style={{ ...surface, overflow: "hidden" }}>
        <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}><Building2 size={16} color={T.bronze} />Vendor directory</div><span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} providers</span></div>
        {loading ? <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading vendor accounts…</div> : vendors.length ? <div style={{ overflowX: "auto" }}><table style={{ borderCollapse: "collapse", width: "100%", minWidth: 920 }}><thead><tr>{["Business", "Owner contact", "Location", "Verification", "Account", "Actions"].map((heading) => <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>{heading}</th>)}</tr></thead><tbody>{vendors.map((vendor) => { const accountActive = vendor.userId?.isActive !== false; return <tr key={vendor._id}><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 31, height: 31, display: "grid", placeItems: "center", borderRadius: 9, background: "rgba(168,138,100,.12)", color: T.bronze, fontSize: 10, fontWeight: 800 }}>{vendor.businessName?.slice(0, 1)?.toUpperCase() || "V"}</span><div><div style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{vendor.businessName}</div><div style={{ marginTop: 3, color: T.slateGray, fontSize: 10 }}>{vendor.businessType || "Business"} · {vendor.experience || 0} yrs</div></div></div></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ color: T.slate, fontSize: 11 }}>{vendor.userId?.fullName || "—"}</div><div style={{ color: T.slateGray, marginTop: 3, fontSize: 10 }}>{vendor.userId?.email || "No email"}</div></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>{[vendor.city, vendor.state].filter(Boolean).join(", ") || "—"}<div style={{ marginTop: 3, fontSize: 10 }}>{vendor.pincode || ""}</div></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><StatusBadge value={vendor.status} /></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><StatusBadge value={accountActive ? "active" : "suspended"} /></td><td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}><div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>{vendor.status === "pending" && <><ActionButton tone="success" onClick={() => chooseAction("approve", vendor)}><BadgeCheck size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Approve</ActionButton><ActionButton tone="danger" onClick={() => chooseAction("reject", vendor)}><XCircle size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Reject</ActionButton></>}{vendor.status === "rejected" && <ActionButton tone="warning" onClick={() => chooseAction("request-reupload", vendor)}><FileWarning size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Re-upload</ActionButton>}{accountActive ? <ActionButton tone="danger" onClick={() => chooseAction("suspend", vendor)}><Ban size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Suspend</ActionButton> : <ActionButton tone="success" onClick={() => chooseAction("activate", vendor)}><ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />Activate</ActionButton>}</div></td></tr>; })}</tbody></table></div> : <EmptyTable label="No vendors match the selected filters." />}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
    </div>
    <ConfirmModal open={Boolean(action)} title={actionInfo.title} message={actionInfo.message} confirmText={actionInfo.confirm} danger={actionInfo.danger} loading={submitting} onCancel={() => !submitting && setAction(null)} onConfirm={runAction}>{["reject", "request-reupload"].includes(action?.type) && <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder={action?.type === "reject" ? "Rejection reason (required)" : "Note for the vendor (optional)"} rows={3} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 9, padding: 10, fontFamily: "inherit", fontSize: 12, resize: "vertical", outline: "none" }} />}</ConfirmModal>
  </main>;
};

export default Vendors;
