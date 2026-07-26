import PopularServices from '@/components/client/PopularServices'
import ServiceFilters from '@/components/client/services/ServiceFilters'
import ServiceGrid from '@/components/client/services/ServiceGrid'
import ServiceHero from '@/components/client/services/serviceHero'
import KaamSetuLoader from '@/components/Loader/fullLoader'
import { getServices } from '@/services/customerService'
import { getCategories } from '@/services/serviceService'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const EMPTY_FILTERS = { category: '', city: '', minExperience: '', minRating: '', minPrice: '', maxPrice: '' }

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [pagination, setPagination] = useState(null)

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    category: searchParams.get('category') || '',
  })
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Categories power the ServiceFilters dropdown — fetched once.
  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories()
        setCategories(response.data || [])
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    })()
  }, [])

  // Keeps the page in sync when the URL's ?category=/?search= changes without
  // a full remount — e.g. clicking a category chip in PopularServices.
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || ''
    const searchFromUrl = searchParams.get('search') || ''
    setFilters((prev) => (prev.category === categoryFromUrl ? prev : { ...prev, category: categoryFromUrl }))
    setSearch((prev) => (prev === searchFromUrl ? prev : searchFromUrl))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchServices = useCallback(async (page = 1, append = false) => {
    if (page === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const response = await getServices({ ...filters, search, page, limit: 12 })
      setServices((prev) => (append ? [...prev, ...(response.data || [])] : response.data || []))
      setPagination(response.pagination || null)
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setInitialLoading(false)
    }
  }, [filters, search])

  useEffect(() => {
    fetchServices(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search])

  const handleHeroSearch = ({ search: term, city }) => {
    setSearch(term)
    setFilters((prev) => ({ ...prev, city }))
  }

  const handleApplyFilters = (nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }))
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (nextFilters.category) params.set('category', nextFilters.category)
      else params.delete('category')
      return params
    })
  }

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearch('')
    setSearchParams({})
  }

  const handleLoadMore = () => {
    if (!pagination) return
    fetchServices(pagination.page + 1, true)
  }

  // Full branded loader only for the very first paint of the page —
  // subsequent filter changes use the lightweight in-grid skeleton instead.
  if (initialLoading) {
    return <KaamSetuLoader />
  }

  return (
    <>
      <ServiceHero initialSearch={search} initialCity={filters.city} onSearch={handleHeroSearch} />
      <ServiceFilters
        categories={categories}
        filters={{
          category: filters.category,
          city: filters.city,
          minExperience: filters.minExperience,
          minRating: filters.minRating,
          price: filters.minPrice ? `${filters.minPrice}-${filters.maxPrice || ''}` : '',
        }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
      <PopularServices categories={categories} loading={false} />
      <ServiceGrid
        services={services}
        loading={loading}
        pagination={pagination}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
      />
    </>
  )
}

export default Services