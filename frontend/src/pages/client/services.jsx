
import PopularServices from '@/components/client/PopularServices'
import ServiceFilters from '@/components/client/services/ServiceFilters'
import ServiceGrid from '@/components/client/services/ServiceGrid'
import ServiceHero from '@/components/client/services/serviceHero'
import React from 'react'

const Services = () => {
  return (
    <>
    <ServiceHero />
    <ServiceFilters />
    <PopularServices />
    <ServiceGrid />
    
      
    </>
  )
}

export default Services
