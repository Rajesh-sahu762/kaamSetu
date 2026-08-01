import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ServiceFilters from "@/components/client/services/ServiceFilters";
import ServiceGrid from "@/components/client/services/ServiceGrid";
import ServiceHero from "@/components/client/services/ServiceHero";
import KaamSetuLoader from "@/components/Loader/FullLoader";
import { getServices, getCategories } from "@/services/publicService";

const EMPTY_FILTERS = {
  category: "",
  city: "",
  minRating: "",
  minPrice: "",
  maxPrice: "",
};

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Categories power the ServiceFilters dropdown — fetched once.
  useEffect(() => {
    (async () => {
      const response = await getCategories();
      if (response.success) setCategories(response.data);
    })();
  }, []);

  // Keeps the page in sync if the URL's ?category= changes without a full
  // remount — e.g. arriving here from a category card on the home page.
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    setFilters((prev) =>
      prev.category === categoryFromUrl ? prev : { ...prev, category: categoryFromUrl },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchServices = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const response = await getServices({ ...filters, search, page, limit: 12 });

        if (response.success) {
          setServices((prev) => (append ? [...prev, ...response.data] : response.data));
          setPagination(response.pagination);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoading(false);
      }
    },
    [filters, search],
  );

  useEffect(() => {
    fetchServices(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search]);

  const syncUrl = (nextFilters, nextSearch) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.city) params.set("city", nextFilters.city);
    setSearchParams(params);
  };

  const handleHeroSearch = ({ search: term, city }) => {
    const nextFilters = { ...filters, city };
    setSearch(term);
    setFilters(nextFilters);
    syncUrl(nextFilters, term);
  };

  const handleApplyFilters = (nextFilters) => {
    const merged = { ...filters, ...nextFilters };
    setFilters(merged);
    syncUrl(merged, search);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setSearchParams({});
  };

  const handleLoadMore = () => {
    if (!pagination) return;
    fetchServices(pagination.currentPage + 1, true);
  };

  // Full branded loader only for the very first paint of the page —
  // subsequent filter changes use the lightweight in-grid skeleton instead.
  if (initialLoading) {
    return <KaamSetuLoader />;
  }

  return (
    <>
      <ServiceHero
        initialSearch={search}
        initialCity={filters.city}
        onSearch={handleHeroSearch}
      />

      <ServiceFilters
        categories={categories}
        filters={{
          category: filters.category,
          city: filters.city,
          minRating: filters.minRating,
          price: filters.minPrice ? `${filters.minPrice}-${filters.maxPrice || ""}` : "",
        }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <ServiceGrid
        services={services}
        loading={loading}
        loadingMore={loadingMore}
        pagination={pagination}
        onLoadMore={handleLoadMore}
      />
    </>
  );
};

export default Services;
