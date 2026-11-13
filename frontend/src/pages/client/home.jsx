import FinalCTA from "@/components/client/CTA";
import FeaturedExperts from "@/components/client/FeaturedExperts";
import HeroSection from "@/components/client/hero";
import HowItWorks from "@/components/client/HowItWorks";
import PopularServices from "@/components/client/PopularServices";
import Testimonials from "@/components/client/Testimonials";
import WhyChooseKaamSetu from "@/components/client/WhyChooseUs";
import HomeIntro from "@/components/client/HomeIntro";

const Home = () => {
  return (
    <HomeIntro>
      <HeroSection />
      <PopularServices />
      <WhyChooseKaamSetu />
      <FeaturedExperts />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </HomeIntro>
  );
};

export default Home;
