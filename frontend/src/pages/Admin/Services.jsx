import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, IndianRupee, Package, ShieldCheck, Trash2, Wrench } from "lucide-react";
import api from "@/services/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import { T } from "@/utils/vendorTheme";
import useBreakpoint from "@/utils/useBreakpoint";
import { ActionButton, EmptyTable, FilterButton, ManagementHeader, Pagination, StatusBadge, surface } from "@/components/admin/ManagementPrimitives";

const formatPrice = (service) => {
  const amount = Number(service.startingPrice || 0).toLocaleString("en-IN");
  return service.priceType === "variable" ? `From ₹${amount}` : `₹${amount}`;
};

const Services = () => {
  const { isMobile } = useBreakpoint();
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/services", {
        params: { page, limit: 10, status, category: category === "all" ? "" : category, search },
      });
      setServices(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not load services.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => {
    const timeout = setTimeout(loadServices, 250);
    return () => clearTimeout(timeout);
  }, [loadServices]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/admin/categories", { params: { limit: 100, status: "active" } });
        setCategories(response.data.data || []);
      } catch {
        // Category filter is a convenience; ignore failures silently.
      }
    })();
  }, []);

  const activeCount = useMemo(() => services.filter((service) => service.isActive).length, [services]);

  const toggleStatus = async (service) => {
    try {
      setStatusUpdating(service._id);
      setError("");
      await api.patch(`/admin/services/${service._id}/status`, { isActive: !service.isActive });
      loadServices();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The service status could not be updated.");
    } finally {
      setStatusUpdating("");
    }
  };

  const runDelete = async () => {
    if (!deleting) return;
    try {
      setSubmitting(true);
      setError("");
      await api.delete(`/admin/services/${deleting._id}`);
      setDeleting(null);
      loadServices();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "The service could not be removed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: isMobile ? "18px 14px 36px" : "28px clamp(20px, 3vw, 48px) 48px", minHeight: "100%", background: T.ivory }}>
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <ManagementHeader
          eyebrow="Catalogue management"
          title="Services"
          description="Review and moderate service listings published by vendors."
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchPlaceholder="Search service name or description"
          refreshing={loading}
          onRefresh={loadServices}
        >
          {["all", "active", "inactive"].map((item) => (
            <FilterButton key={item} active={status === item} onClick={() => { setStatus(item); setPage(1); }}>
              {item}
            </FilterButton>
          ))}
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(event) => { setCategory(event.target.value); setPage(1); }}
              style={{ border: `1px solid ${T.border}`, borderRadius: 9, background: T.white, color: T.slate, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          )}
        </ManagementHeader>
        {error && (
          <div style={{ border: "1px solid rgba(239,68,68,.25)", background: T.redDim, borderRadius: 10, padding: "11px 13px", color: T.red, fontSize: 12 }}>
            {error}
          </div>
        )}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Visible results</div>
            <div style={{ marginTop: 7, color: T.slate, fontSize: 22, fontWeight: 750 }}>{services.length}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Active on this page</div>
            <div style={{ marginTop: 7, color: T.green, fontSize: 22, fontWeight: 750 }}>{activeCount}</div>
          </div>
          <div style={{ ...surface, padding: 15 }}>
            <div style={{ color: T.slateGray, fontSize: 10, fontWeight: 750, textTransform: "uppercase", letterSpacing: ".07em" }}>Total listings</div>
            <div style={{ marginTop: 7, color: T.bronze, fontSize: 22, fontWeight: 750 }}>{pagination?.total || 0}</div>
          </div>
        </section>
        <section style={{ ...surface, overflow: "hidden" }}>
          <div style={{ padding: "15px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.slate, fontSize: 13, fontWeight: 750 }}>
              <Wrench size={16} color={T.bronze} />
              Service listings
            </div>
            <span style={{ color: T.slateGray, fontSize: 11 }}>{pagination?.total || 0} services</span>
          </div>
          {loading ? (
            <div style={{ padding: 56, color: T.slateGray, textAlign: "center", fontSize: 12 }}>Loading services…</div>
          ) : services.length ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 960 }}>
                <thead>
                  <tr>
                    {["Service", "Vendor", "Category", "Price", "Duration", "Status", "Actions"].map((heading) => (
                      <th key={heading} style={{ padding: "11px 16px", color: T.slateGray, background: T.surfaceLow, borderBottom: `1px solid ${T.border}`, textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          {service.coverImage ? (
                            <img
                              src={service.coverImage}
                              alt=""
                              style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", background: T.surfaceLow }}
                              onError={(event) => { event.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <span style={{ width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: 8, background: "rgba(168,138,100,.12)", color: T.bronze }}>
                              <Package size={15} />
                            </span>
                          )}
                          <div>
                            <div style={{ color: T.slate, fontSize: 12, fontWeight: 700 }}>{service.serviceName}</div>
                            <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10 }}>{service.totalBookings || 0} bookings · {service.rating || 0}★</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11 }}>
                        {service.vendorId?.businessName || "—"}
                        <div style={{ marginTop: 3, color: T.slateGray, fontSize: 10 }}>{[service.vendorId?.city, service.vendorId?.state].filter(Boolean).join(", ") || ""}</div>
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {service.categoryId?.name || "—"}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slate, fontSize: 11, fontWeight: 700 }}>
                        <IndianRupee size={11} style={{ verticalAlign: "-1px", marginRight: 2 }} />
                        {formatPrice(service)}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, color: T.slateGray, fontSize: 11 }}>
                        {service.duration ? `${service.duration} min` : "—"}
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <StatusBadge value={service.isActive ? "active" : "inactive"} />
                      </td>
                      <td style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <ActionButton
                            tone={service.isActive ? "danger" : "success"}
                            disabled={statusUpdating === service._id}
                            onClick={() => toggleStatus(service)}
                          >
                            {service.isActive ? <Ban size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} /> : <ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />}
                            {statusUpdating === service._id ? "Saving…" : service.isActive ? "Deactivate" : "Activate"}
                          </ActionButton>
                          <ActionButton tone="danger" onClick={() => setDeleting(service)}>
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
            <EmptyTable label="No services match the selected filters." />
          )}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </section>
      </div>
      <ConfirmModal
        open={Boolean(deleting)}
        title="Remove this service?"
        message={`"${deleting?.serviceName || ""}" will be permanently removed from the marketplace. This cannot be undone.`}
        confirmText="Remove service"
        danger
        loading={submitting}
        onCancel={() => !submitting && setDeleting(null)}
        onConfirm={runDelete}
      />
    </main>
  );
};

export default Services;