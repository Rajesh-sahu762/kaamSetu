import FinalCTA from '@/components/client/CTA'
import FeaturedExperts from '@/components/client/FeaturedExperts'
import HeroSection from '@/components/client/hero'
import HowItWorks from '@/components/client/HowItWorks'
import PopularServices from '@/components/client/PopularServices'
import Testimonials from '@/components/client/Testimonials'
import WhyChooseKaamSetu from '@/components/client/WhyChooseUs'
import { getHomeData } from '@/services/customerService'
import { useEffect, useState } from 'react'

const Home = () => {

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getHomeData();
        if (!cancelled) setHomeData(response.data);
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
     <HeroSection
       stats={homeData?.stats}
       categories={homeData?.categories}
       loading={loading}
     />
     <PopularServices
       categories={homeData?.categories || []}
       loading={loading}
     />
     <WhyChooseKaamSetu />
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
     <FinalCTA />

    </>
  )
}

export default Home