import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ExpertProfileHero from "@/components/client/expertProfile/ExpertProfileHero";
import ServicesOffered from "@/components/client/expertProfile/ServicesOffered";
import ReviewsSection from "@/components/client/expertProfile/ExpertReview";

import { getExpertProfile } from "@/services/customerService";

const ExpertProfile = () => {
  const { id } = useParams();

  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchExpertProfile = async () => {
      try {
        const response = await getExpertProfile(id);

        if (!ignore && response.success) {
          setExpertData(response.data);
        }
      } catch (error) {
        console.error("Failed to load expert profile:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchExpertProfile();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <>
      <ExpertProfileHero
        expert={expertData?.expert}
        stats={expertData?.stats}
        loading={loading}
      />

      <ServicesOffered
        services={expertData?.services || []}
        loading={loading}
      />

      <ReviewsSection
        reviews={expertData?.reviews || []}
        stats={expertData?.stats}
        ratingBreakdown={expertData?.ratingBreakdown}
        loading={loading}
      />
    </>
  );
};

export default ExpertProfile;