import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ExpertFilters from "@/components/client/experts/ExpertFilters"
import ExpertGrid from "@/components/client/experts/ExpertGrid"
import ExpertHero from "@/components/client/experts/ExpertHero"
import { getCategories } from "@/services/publicService";

const Experts = () => {
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    category: searchParams.get("category") || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      if (response.success) setCategories(response.data);
    };

    fetchCategories();
  }, []);

  return (
    <>
      <ExpertHero />
      <ExpertFilters
        categories={categories}
        initialCategory={appliedFilters.category}
        onApply={setAppliedFilters}
        onReset={() => setAppliedFilters({})}
      />
      <ExpertGrid filters={appliedFilters} />
    </>
  )
}

export default Experts
