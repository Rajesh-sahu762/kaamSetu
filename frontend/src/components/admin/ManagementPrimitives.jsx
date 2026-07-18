import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { T } from "@/utils/vendorTheme";

export const surface = { background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: "0 2px 10px rgba(9,20,38,.025)" };

export const StatusBadge = ({ value }) => {
  const status = String(value || "pending").toLowerCase();
  const config = ["active", "approved", "completed", "verified"].includes(status)
    ? { color: T.green, background: T.greenDim }
    : ["suspended", "rejected", "inactive"].includes(status)
      ? { color: T.red, background: T.redDim }
      : { color: T.amber, background: T.amberDim };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 8px", borderRadius: 999, color: config.color, background: config.background, textTransform: "capitalize", fontSize: 10, fontWeight: 750, whiteSpace: "nowrap" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: config.color }} />{status}</span>;
};

export const ManagementHeader = ({ eyebrow, title, description, search, onSearch, searchPlaceholder, children, refreshing, onRefresh }) => <>
  <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
    <div><div style={{ color: T.bronze, fontSize: 10, fontWeight: 800, letterSpacing: ".11em", textTransform: "uppercase" }}>{eyebrow}</div><h1 style={{ color: T.slate, margin: "7px 0 5px", fontSize: 26, lineHeight: 1, letterSpacing: "-.7px" }}>{title}</h1><p style={{ color: T.slateGray, margin: 0, fontSize: 12 }}>{description}</p></div>
    <button type="button" onClick={onRefresh} disabled={refreshing} style={{ border: `1px solid ${T.border}`, background: T.white, color: T.slate, borderRadius: 9, padding: "9px 11px", cursor: refreshing ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700 }}><RefreshCw size={14} style={{ animation: refreshing ? "adminSpin .8s linear infinite" : "none" }} />Refresh</button>
  </header>
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <label style={{ position: "relative", flex: "1 1 230px", maxWidth: 390 }}><Search size={15} color={T.slateGray} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={searchPlaceholder} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, outline: "none", background: T.white, borderRadius: 10, color: T.slate, padding: "10px 12px 10px 36px", fontSize: 12 }} /></label>
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>{children}</div>
  </div>
</>;

export const FilterButton = ({ active, children, ...props }) => <button type="button" {...props} style={{ border: `1px solid ${active ? T.slate : T.border}`, borderRadius: 999, background: active ? T.slate : T.white, color: active ? T.white : T.slateGray, cursor: "pointer", padding: "7px 10px", fontSize: 10, fontWeight: 750 }}>{children}</button>;

export const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;
  return <div style={{ padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, borderTop: `1px solid ${T.border}` }}><span style={{ color: T.slateGray, fontSize: 11 }}>Page {pagination.page} of {pagination.pages} · {pagination.total} total</span><div style={{ display: "flex", gap: 6 }}><button type="button" aria-label="Previous page" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} style={{ width: 29, height: 29, display: "grid", placeItems: "center", border: `1px solid ${T.border}`, borderRadius: 7, color: T.slate, background: T.white, cursor: pagination.page <= 1 ? "not-allowed" : "pointer", opacity: pagination.page <= 1 ? .45 : 1 }}><ChevronLeft size={15} /></button><button type="button" aria-label="Next page" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.pages} style={{ width: 29, height: 29, display: "grid", placeItems: "center", border: `1px solid ${T.border}`, borderRadius: 7, color: T.slate, background: T.white, cursor: pagination.page >= pagination.pages ? "not-allowed" : "pointer", opacity: pagination.page >= pagination.pages ? .45 : 1 }}><ChevronRight size={15} /></button></div></div>;
};

export const EmptyTable = ({ label }) => <div style={{ padding: "52px 20px", color: T.slateGray, fontSize: 12, textAlign: "center" }}>{label}</div>;

export const ActionButton = ({ tone = "neutral", children, ...props }) => {
  const color = tone === "danger" ? T.red : tone === "success" ? T.green : tone === "warning" ? T.amber : T.slate;
  return <button type="button" {...props} style={{ border: 0, background: "transparent", color, cursor: "pointer", fontSize: 10, fontWeight: 750, padding: "5px 3px" }}>{children}</button>;
};
