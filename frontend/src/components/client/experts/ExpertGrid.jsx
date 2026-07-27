import { useEffect, useState } from "react";
import ExpertCard from "./ExpertCard";
import { getVendors } from "@/services/publicService";

const mapVendorToExpert = ({ vendor, primaryService, rating, totalReviews }) => ({
  id: vendor._id,
  name: vendor.businessName,
  category: primaryService?.categoryId?.name || "Service Provider",
  location: vendor.city,
  experience: `${vendor.experience || 0} Years`,
  rating: rating ? rating.toFixed(1) : "New",
  reviews: totalReviews,
  visitCharge: primaryService?.startingPrice ?? 0,
  verified: true,
  image:
    vendor.userId?.profileImage ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
});

const ExpertGrid = ({ filters = {} }) => {
  const [experts, setExperts] = useState([]);
  const [totalVendors, setTotalVendors] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExperts = async (pageNumber) => {
    try {
      setLoading(true);
      setError("");

      const response = await getVendors({
        ...filters,
        page: pageNumber,
        limit: 9,
      });

      if (response.success) {
        const mapped = response.data.map(mapVendorToExpert);

        setExperts((prev) =>
          pageNumber === 1 ? mapped : [...prev, ...mapped],
        );
        setTotalVendors(response.pagination.totalVendors);
      } else {
        setError(response.message || "Failed to load experts.");
      }
    } catch (err) {
      setError("Failed to load experts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchExperts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchExperts(nextPage);
  };

  const hasMore = experts.length < totalVendors;

  return (
    <section className="py-16 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            md:flex-row

            md:items-center
            md:justify-between

            gap-4

            mb-10
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-semibold
                text-primary
              "
            >
              Available Experts
            </h2>

            <p
              className="
                mt-2
                text-muted
              "
            >
              Browse verified professionals
              and choose the best match.
            </p>
          </div>

          <span
            className="
              px-4
              py-2

              rounded-xl

              bg-card

              border
              border-theme

              text-sm
              text-muted
            "
          >
            {totalVendors} Experts Found
          </span>
        </div>

        {/* Error */}

        {error && (
          <p className="text-center text-red-500 mb-8">{error}</p>
        )}

        {/* Empty State */}

        {!loading && !error && experts.length === 0 && (
          <p className="text-center text-muted mb-8">
            No experts found yet. Check back soon.
          </p>
        )}

        {/* Grid */}

        <div
          className="
            grid

            md:grid-cols-2
            xl:grid-cols-3

            gap-8
          "
        >
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
            />
          ))}
        </div>

        {/* Load More */}

        {hasMore && (
          <div
            className="
              flex
              justify-center

              mt-14
            "
          >
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="
                px-8
                py-4

                rounded-2xl

                border
                border-theme

                text-primary

                hover:bg-card

                transition

                disabled:opacity-60
              "
            >
              {loading ? "Loading..." : "Load More Experts"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpertGrid;