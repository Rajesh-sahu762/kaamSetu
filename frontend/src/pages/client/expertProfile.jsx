import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ExpertProfileHero from "@/components/client/expertProfile/ExpertProfileHero";
import ReviewsSection from "@/components/client/expertProfile/ExpertReview";
import ServicesOffered from "@/components/client/expertProfile/ServicesOffered";
import { getVendorPublicProfile } from "@/services/publicService";

const ExpertProfile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVendorPublicProfile(id);

        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || "Expert not found.");
        }
      } catch (err) {
        setError("Failed to load this expert's profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <section className="pt-32 pb-16 bg-theme">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-center text-muted">Loading expert profile...</p>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="pt-32 pb-16 bg-theme">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-center text-red-500">
            {error || "Expert not found."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <ExpertProfileHero
        vendor={profile.vendor}
        services={profile.services}
        rating={profile.rating}
        totalReviews={profile.totalReviews}
      />
      <ServicesOffered services={profile.services} />
      <ReviewsSection
        reviews={profile.reviews}
        rating={profile.rating}
        totalReviews={profile.totalReviews}
      />
    </>
  );
};

export default ExpertProfile;
