'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CarCard from '../components/CarCard'
import SearchFilter from '../components/SearchFilter'

export default function Home() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data || [])
      setFilteredCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (filters) => {
    let filtered = [...cars]

    if (filters.search) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.minYear))
    }

    if (filters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.maxYear))
    }

    if (filters.minPrice) {
      filtered = filtered.filter(car => car.price >= parseInt(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price <= parseInt(filters.maxPrice))
    }

    if (filters.city) {
      filtered = filtered.filter(car =>
        car.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    if (filters.maxKm) {
      filtered = filtered.filter(car => car.km <= parseInt(filters.maxKm))
    }

    if (filters.sortBy === 'price_low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price_high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'year_new') {
      filtered.sort((a, b) => b.year - a.year)
    } else if (filters.sortBy === 'year_old') {
      filtered.sort((a, b) => a.year - b.year)
    }

    setFilteredCars(filtered)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Find Your Perfect Used Car</h1>
      
      <SearchFilter onFilter={handleFilter} />
      
      <div className="grid grid-3">
        {filteredCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      {filteredCars.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No cars found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}