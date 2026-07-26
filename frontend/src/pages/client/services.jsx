import { useCallback, useEffect, useState } from "react";

import PopularServices from "@/components/client/PopularServices";
import ServiceFilters from "@/components/client/services/ServiceFilters";
import ServiceGrid from "@/components/client/services/ServiceGrid";
import ServiceHero from "@/components/client/services/serviceHero";

import { getServices } from "@/services/customerService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
    page: 1,
    limit: 12,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [categories, setCategories] = useState([]);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getServices(filters);

 if (response.success) {
  const newServices = response.data.services || [];

  setServices((prev) =>
    filters.page === 1
      ? newServices
      : [...prev, ...newServices]
  );

  setCategories(response.data.categories || []);
  setPagination(response.pagination || null);
}
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <>
      <ServiceHero />

     <ServiceFilters
    filters={filters}
    setFilters={setFilters}
    categories={categories}
/>

      <PopularServices
        services={services.slice(0, 8)}
        loading={loading}
      />

      <ServiceGrid
        services={services}
        loading={loading}
        error={error}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default Services;