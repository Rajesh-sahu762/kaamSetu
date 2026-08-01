import FinalCTA from '@/components/client/CTA'
import FeaturedExperts from '@/components/client/FeaturedExperts'
import Footer from '@/components/client/Footer'
import HeroSection from '@/components/client/Hero'
import HowItWorks from '@/components/client/HowItWorks'
import Navbar from '@/components/client/Navbar'
import PopularServices from '@/components/client/PopularServices'
import Testimonials from '@/components/client/Testimonials'
import WhyChooseKaamSetu from '@/components/client/WhyChooseUs'
import React from 'react'

const Home = () => {
  
  return (
    <>
     <HeroSection /> 
     <PopularServices />
     <WhyChooseKaamSetu />
     <FeaturedExperts />
     <HowItWorks />
     <Testimonials />
     <FinalCTA />
     

    </>
  )
}

export default Home
