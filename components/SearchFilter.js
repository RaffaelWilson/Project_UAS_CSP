'use client'
import { useState } from 'react'

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    maxKm: '',
    sortBy: ''
  })

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      maxKm: '',
      sortBy: ''
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  return (
    <div className="card" style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>Search & Filter</h3>
      
      <div className="grid grid-2">
        <div className="form-group">
          <input
            type="text"
            name="search"
            placeholder="Search by brand or model..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="">Sort by...</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="year_new">Year: Newest First</option>
            <option value="year_old">Year: Oldest First</option>
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="minYear"
            placeholder="Min Year"
            value={filters.minYear}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="maxYear"
            placeholder="Max Year"
            value={filters.maxYear}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="maxKm"
            placeholder="Max KM"
            value={filters.maxKm}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <button onClick={resetFilters} className="btn btn-secondary">
        Reset Filters
      </button>
    </div>
  )
}