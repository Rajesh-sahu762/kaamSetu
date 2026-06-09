import ExpertProfileHero from '@/components/client/expertProfile/ExpertProfileHero'
import ReviewsSection from '@/components/client/expertProfile/ExpertReview'
import ServicesOffered from '@/components/client/expertProfile/ServicesOffered'
import React from 'react'

const ExpertProfile = () => {
  return (
    <>
      <ExpertProfileHero />
      <ServicesOffered />
      <ReviewsSection />
    </>
  )
}

export default ExpertProfile
