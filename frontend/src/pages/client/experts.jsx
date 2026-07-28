import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ExpertFilters from "@/components/client/experts/ExpertFilters"
import ExpertGrid from "@/components/client/experts/ExpertGrid"
import ExpertHero from "@/components/client/experts/ExpertHero"
import { getCategories } from "@/services/publicService";

const paramsToFilters = (searchParams) => ({
  category: searchParams.get("category") || "",
  city: searchParams.get("city") || "",
  search: searchParams.get("search") || "",
  minExperience: searchParams.get("minExperience") || "",
  minRating: searchParams.get("minRating") || "",
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
});

const Experts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(() =>
    paramsToFilters(searchParams),
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      if (response.success) setCategories(response.data);
    };

    fetchCategories();
  }, []);

  // Keeps filters in sync with the URL on browser back/forward.
  useEffect(() => {
    setAppliedFilters(paramsToFilters(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleApply = (filters) => {
    setAppliedFilters(filters);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    setAppliedFilters({});
    setSearchParams({});
  };

  return (
    <>
      <ExpertHero />
      <ExpertFilters
        categories={categories}
        filters={appliedFilters}
        onApply={handleApply}
        onReset={handleReset}
      />
      <ExpertGrid filters={appliedFilters} />
    </>
  )
}

export default Experts
