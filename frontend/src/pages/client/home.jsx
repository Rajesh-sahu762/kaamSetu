import { useEffect, useState } from "react";

import HeroSection from "@/components/client/hero";
import PopularServices from "@/components/client/PopularServices";
import WhyChooseKaamSetu from "@/components/client/WhyChooseUs";
import FeaturedExperts from "@/components/client/FeaturedExperts";
import HowItWorks from "@/components/client/HowItWorks";
import Testimonials from "@/components/client/Testimonials";
import FinalCTA from "@/components/client/CTA";

import { getHomeData } from "@/services/customerService";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchHomeData = async () => {
      try {
        const response = await getHomeData();

        if (!ignore && response.success) {
          setHomeData(response.data);
        }
      } catch (error) {
        console.error("Failed to load home page:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchHomeData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <HeroSection
        hero={homeData?.hero}
        loading={loading}
      />

      <PopularServices
        categories={homeData?.categories || []}
        loading={loading}
      />

      <WhyChooseKaamSetu
        stats={homeData?.stats}
        loading={loading}
      />

      <FeaturedExperts
        experts={homeData?.featuredExperts || []}
        loading={loading}
      />

      <HowItWorks />

      <Testimonials
        testimonials={homeData?.testimonials || []}
        stats={homeData?.stats}
        loading={loading}
      />

      <FinalCTA
        stats={homeData?.stats}
        loading={loading}
      />
    </>
  );
};

export default Home;