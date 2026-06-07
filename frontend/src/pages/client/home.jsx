import HeroSection from '@/components/client/hero'
import Navbar from '@/components/client/navbar'
import PopularServices from '@/components/client/PopularServices'
import React from 'react'

const Home = () => {
  return (
    <>
     <Navbar />
     <HeroSection /> 
     <PopularServices />
    </>
  )
}

export default Home
