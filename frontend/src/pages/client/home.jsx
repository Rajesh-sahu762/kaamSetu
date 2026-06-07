import FeaturedExperts from '@/components/client/FeaturedExperts'
import HeroSection from '@/components/client/hero'
import Navbar from '@/components/client/navbar'
import PopularServices from '@/components/client/PopularServices'
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
    </>
  )
}

export default Home
