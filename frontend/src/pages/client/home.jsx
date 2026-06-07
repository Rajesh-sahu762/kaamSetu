import FeaturedExperts from '@/components/client/FeaturedExperts'
import HeroSection from '@/components/client/hero'
import HowItWorks from '@/components/client/HowItWorks'
import Navbar from '@/components/client/navbar'
import PopularServices from '@/components/client/PopularServices'
import Testimonials from '@/components/client/Testimonials'
import WhyChooseKaamSetu from '@/components/client/WhyChooseUs'
import React from 'react'

const Home = () => {
  return (
    <>
     <Navbar />
     <HeroSection /> 
     <PopularServices />
     <WhyChooseKaamSetu />
     <FeaturedExperts />
     <HowItWorks />
     <Testimonials />
     
    </>
  )
}

export default Home
