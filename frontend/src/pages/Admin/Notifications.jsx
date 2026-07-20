import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Megaphone, Search, Send, Trash2, X } from "lucide-react";
import api from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { ActionButton, EmptyTable, FilterButton, ManagementHeader, Pagination, surface } from "@/components/admin/ManagementPrimitives";

const TYPES = ["booking", "payment", "review", "service", "vendor", "system"];

const TYPE_COLORS = {
  booking: T.blue,
  payment: T.green,
  review: T.bronze,
  service: T.amber,
  vendor: T.slate,
  system: T.slateGray,
};

const TypeTag = ({ type }) => {
  const color = TYPE_COLORS[type] || T.slateGray;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: 999, background: `${color}1a`, color, textTransform: "capitalize", fontSize: 10, fontWeight: 750 }}>
      {type}
    </span>
  );
};

const ReadTag = ({ isRead }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 8px", borderRadius: 999, color: isRead ? T.slateGray : T.bronze, background: isRead ? T.surfaceLow : "rgba(168,138,100,.14)", fontSize: 10, fontWeight: 750 }}>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: isRead ? T.slateGray : T.bronze }} />
    {isRead ? "Read" : "Unread"}
  </span>
);

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
};

const truncate = (text = "", length = 90) => (text.length > length ? `${text.slice(0, length).trim()}…` : text || "—");

const emptyForm = { audience: "customers", title: "", message: "", type: "system", recipient: null };

const ComposeModal = ({ onClose, onSent }) => {
  const [form, setForm] = useState(emptyForm);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipientResults, setRecipientResults] = useState([]);
  const [searchingRecipients, setSearchingRecipients] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (form.audience !== "specific" || !recipientQuery.trim()) { setRecipientResults([]); return; }
    const timeout = setTimeout(async () => {
      try {
        setSearchingRecipients(true);
        const response = await api.get("/admin/notifications/recipients", { params: { search: recipientQuery } });
        setRecipientResults(response.data.data || []);
      } catch {
        setRecipientResults([]);
      } finally {
        setSearchingRecipients(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [recipientQuery, form.audience]);

  const send = async (event) => {
    event.preventDefault();
    if (form.audience === "specific" && !form.recipient) {
      setError("Search and select a recipient first.");
      return;
    }
    try {
      setSending(true);
      setError("");
      const payload = {
        audience: form.audience,
        title: form.title,
        message: form.message,
        type: form.type,
        userIds: form.audience === "specific" ? [form.recipient._id] : [],
      };
      const response = await api.post("/admin/notifications/broadcast", payload);
      onSent(response.data.message);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The notification could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 11px", outline: "none", color: T.slate, fontSize: 12, fontFamily: "inherit" };

  return (
    <div style={{ position: "fixed", zIndex: 100, inset: 0, display: "grid", placeItems: "center", padding: 16, background: "rgba(9,20,38,.55)", backdropFilter: "blur(5px)" }}>
      <form onSubmit={send} style={{ width: 560, maxWidth: "100%", maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: T.white, borderRadius: 18, boxShadow: "0 28px 65px rgba(9,20,38,.25)" }}>
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
          <div>
            <h2 style={{ color: T.slate, margin: 0, fontSize: 17, fontWeight: 750 }}>Compose notification</h2>
            <p style={{ color: T.slateGray, margin: "4px 0 0", fontSize: 11 }}>Broadcast an announcement or alert a specific person.</p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 0, cursor: "pointer", background: "transparent", color: T.slateGray }}><X size={20} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div style={{ color: T.red, background: T.redDim, borderRadius: 8, padding: "9px 10px", fontSize: 11 }}>{error}</div>}
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Audience
            <select value={form.audience} onChange={(event) => { change("audience", event.target.value); change("recipient", null); setRecipientQuery(""); }} style={{ ...inputStyle, marginTop: 6, cursor: "pointer" }}>
              <option value="all">All users</option>
              <option value="customers">All customers</option>
              <option value="vendors">All vendors</option>
              <option value="specific">Specific recipient</option>
            </select>
          </label>
          {form.audience === "specific" && (
            <label style={{ color: T.slate, fontSize: 11, fontWeight: 700, position: "relative" }}>
              Recipient
              <div style={{ position: "relative", marginTop: 6 }}>
                <Search size={14} color={T.slateGray} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={form.recipient ? `${form.recipient.fullName} (${form.recipient.email})` : recipientQuery}
                  onChange={(event) => { change("recipient", null); setRecipientQuery(event.target.value); }}
                  placeholder="Search by name, email, or mobile"
                  style={{ ...inputStyle, paddingLeft: 32 }}
                />
              </div>
              {!form.recipient && recipientQuery.trim() && (
                <div style={{ marginTop: 6, border: `1px solid ${T.border}`, borderRadius: 9, maxHeight: 160, overflowY: "auto" }}>
                  {searchingRecipients ? (
                    <div style={{ padding: 10, color: T.slateGray, fontSize: 11 }}>Searching…</div>
                  ) : recipientResults.length ? (
                    recipientResults.map((user) => (
                      <button
                        type="button"
                        key={user._id}
                        onClick={() => { change("recipient", user); setRecipientQuery(""); }}
                        style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", padding: "9px 11px", cursor: "pointer", borderBottom: `1px solid ${T.border}`, fontWeight: 500 }}
                      >
                        <div style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{user.fullName}</div>
                        <div style={{ color: T.slateGray, fontSize: 10 }}>{user.email} · {user.role}</div>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: 10, color: T.slateGray, fontSize: 11 }}>No matching users.</div>
                  )}
                </div>
              )}
            </label>
          )}
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Notification type
            <select value={form.type} onChange={(event) => change("type", event.target.value)} style={{ ...inputStyle, marginTop: 6, cursor: "pointer" }}>
              {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Title
            <input required value={form.title} onChange={(event) => change("title", event.target.value)} placeholder="e.g. Diwali offer live now" style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <label style={{ color: T.slate, fontSize: 11, fontWeight: 700 }}>
            Message
            <textarea required value={form.message} onChange={(event) => change("message", event.target.value)} placeholder="Write the notification body…" rows={4} style={{ ...inputStyle, marginTop: 6, resize: "vertical" }} />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, padding: "15px 20px", borderTop: `1px solid ${T.border}` }}>
          <button type="button" onClick={onClose} disabled={sending} style={{ border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 13px", background: T.white, color: T.slate, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Cancel</button>
          <button type="submit" disabled={sending} style={{ border: 0, borderRadius: 9, padding: "9px 13px", background: T.slate, color: T.white, cursor: sending ? "wait" : "pointer", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Send size={13} />{sending ? "Sending…" : "Send notification"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Notifications = () => {
  const { isMobile } = useBreakpoint();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [read, setRead] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [composing, setComposing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/notifications", {
        params: { page, limit: 10, type, read, role, search },
      });
      setNotifications(response.data.data || []);
      setPagination(response.data.pagination || null);
      setSummary(response.data.summary || null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, [page, search, type, read, role]);

  useEffect(() => {
    const timeout = setTimeout(loadNotifications, 250);
    return () => clearTimeout(timeout);
  }, [loadNotifications]);

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timeout);
  }, [success]);

  const runDelete = async () => {
    if (!deleting) return;
    try {
      setSubmitting(true);
      setError("");
      await api.delete(`/admin/notifications/${deleting._id}`);
      setDeleting(null);
      loadNotifications();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The notification could not be removed.");
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = useMemo(() => ["all", "customer", "vendor", "admin"], []);

  return (
    <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <ManagementHeader
          eyebrow="Communication"
          title="Notifications"
          description="Send announcements and audit every notification delivered on the platform."
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchPlaceholder="Search title, message, or recipient"
          refreshing={loading}
          onRefresh={loadNotifications}
        >
          {["all", "unread", "read"].map((item) => (
            <FilterButton key={item} active={read === item} onClick={() => { setRead(item); setPage(1); }}>
              {item}
            </FilterButton>
          ))}
          <select value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            <option value="all">All types</option>
            {TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }} style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {roleOptions.map((item) => <option key={item} value={item}>{item === "all" ? "All recipients" : `${item}s`}</option>)}
          </select>
          <button type="button" onClick={() => setComposing(true)} style={{ border: 0, borderRadius: 9, padding: "8px 11px", background: T.slate, color: T.white, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 750 }}>
            <Megaphone size={14} />
            Compose
          </button>
        </ManagementHeader>
        {error && <div style={{ border: "1px solid rgba(239,68,68,.25)", background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>{error}</div>}
        {success && <div style={{ border: "1px solid rgba(34,197,94,.25)", background: T.greenDim, borderRadius: 10, padding: "11px 13px", color: T.green, fontSize: 12 }}>{success}</div>}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Total notifications</div>
            <div style={{ marginTop: 7, color: T.slate, fontSize: 22, fontWeight: 750 }}>{pagination?.total || 0}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Unread</div>
            <div style={{ marginTop: 7, color: T.bronze, fontSize: 22, fontWeight: 750 }}>{summary?.unreadCount || 0}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Read</div>
            <div style={{ marginTop: 7, color: T.green, fontSize: 22, fontWeight: 750 }}>{summary?.readCount || 0}</div>
          </div>
        </section>
        <section style={{ ...surface, overflow: "hidden" }}>
          <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}>
              <Bell size={16} color={T.bronze} />
              Notification log
            </div>
            <span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} entries</span>
          </div>
          {loading ? (
            <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading notifications…</div>
          ) : notifications.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 980 }}>
                <thead>
                  <tr>
                    {["Notification", "Recipient", "Type", "Status", "Sent", "Actions"].map((heading) => (
                      <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification._id}>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, maxWidth: 300 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {notification.isRead ? <Bell size={14} color={T.slateGray} /> : <BellRing size={14} color={T.bronze} />}
                          <div>
                            <div style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{notification.title}</div>
                            <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10.5 }} title={notification.message}>{truncate(notification.message, 70)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11 }}>
                        {notification.recipient?.fullName || "—"}
                        <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10, textTransform: "capitalize" }}>{notification.recipient?.role || ""}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <TypeTag type={notification.type} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <ReadTag isRead={notification.isRead} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {formatDateTime(notification.createdAt)}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <ActionButton tone="danger" onClick={() => setDeleting(notification)}>
                          <Trash2 size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />
                          Remove
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTable label="No notifications match the selected filters." />
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </section>
      </div>
      {composing && (
        <ComposeModal
          onClose={() => setComposing(false)}
          onSent={(message) => { setComposing(false); setSuccess(message); loadNotifications(); }}
        />
      )}
      <ConfirmModal
        open={Boolean(deleting)}
        title="Remove this notification?"
        message="This removes the notification from the recipient's inbox permanently."
        confirmText="Remove notification"
        danger
        loading={submitting}
        onCancel={() => !submitting && setDeleting(null)}
        onConfirm={runDelete}
      />
    </main>
  );
};

export default Notifications;