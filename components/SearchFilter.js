'use client'
import { useState } from 'react'

export default function SearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '',
    yearRange: '',
    priceRange: '',
    city: '',
    kmRange: '',
    sortBy: '',
    transmission: '',
    fuelType: '',
    brand: '',
    color: ''
  })

  const handleChange = async (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    
    if (e.target.name === 'search') {
      clearTimeout(window.searchTimeout)
      window.searchTimeout = setTimeout(async () => {
        await performAjaxSearch(newFilters)
      }, 300)
    } else {
      onFilter(newFilters)
    }
  }

  const performAjaxSearch = async (searchFilters) => {
    try {
      
      const response = await fetch('/api/search-cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchFilters)
      })
      
      if (response.ok) {
        const searchResults = await response.json()
        onFilter(searchFilters, searchResults)
      }
    } catch (error) {
      console.log('Using local filter as fallback')
      onFilter(searchFilters)
    }
  }

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      yearRange: '',
      priceRange: '',
      city: '',
      kmRange: '',
      sortBy: '',
      transmission: '',
      fuelType: '',
      brand: '',
      color: ''
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  return (
    <div className="filter-section">
      <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>🔍 Cari & Filter Mobil</h3>
      
      <div className="grid grid-4">
        <div className="form-group">
          <label>Cari Mobil</label>
          <input
            type="text"
            name="search"
            placeholder="Cari berdasarkan merk atau model..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Urutkan</label>
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="">Pilih urutan...</option>
            <option value="price_low">Harga: Terendah ke Tertinggi</option>
            <option value="price_high">Harga: Tertinggi ke Terendah</option>
            <option value="year_new">Tahun: Terbaru Dulu</option>
            <option value="year_old">Tahun: Terlama Dulu</option>
            <option value="km_low">KM: Terendah Dulu</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Tahun</label>
          <select name="yearRange" value={filters.yearRange} onChange={handleChange}>
            <option value="">Semua Tahun</option>
            <option value="2023-2024">2023 - 2024</option>
            <option value="2020-2022">2020 - 2022</option>
            <option value="2017-2019">2017 - 2019</option>
            <option value="2014-2016">2014 - 2016</option>
            <option value="2010-2013">2010 - 2013</option>
            <option value="2005-2009">2005 - 2009</option>
            <option value="2000-2004">2000 - 2004</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Rentang Harga</label>
          <select name="priceRange" value={filters.priceRange} onChange={handleChange}>
            <option value="">Semua Harga</option>
            <option value="0-100000000">Di bawah 100 Juta</option>
            <option value="100000000-200000000">100 - 200 Juta</option>
            <option value="200000000-300000000">200 - 300 Juta</option>
            <option value="300000000-500000000">300 - 500 Juta</option>
            <option value="500000000-1000000000">500 Juta - 1 Miliar</option>
            <option value="1000000000-999999999999">Di atas 1 Miliar</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Kota</label>
          <select name="city" value={filters.city} onChange={handleChange}>
            <option value="">Semua Kota</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Semarang">Semarang</option>
            <option value="Medan">Medan</option>
            <option value="Malang">Malang</option>
            <option value="Solo">Solo</option>
            <option value="Bali">Bali</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Kilometer</label>
          <select name="kmRange" value={filters.kmRange} onChange={handleChange}>
            <option value="">Semua KM</option>
            <option value="0-10000">0 - 10,000 km</option>
            <option value="10000-25000">10,000 - 25,000 km</option>
            <option value="25000-50000">25,000 - 50,000 km</option>
            <option value="50000-75000">50,000 - 75,000 km</option>
            <option value="75000-100000">75,000 - 100,000 km</option>
            <option value="100000-999999999">Di atas 100,000 km</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Transmisi</label>
          <select name="transmission" value={filters.transmission} onChange={handleChange}>
            <option value="">Semua Transmisi</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Otomatis</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Bahan Bakar</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange}>
            <option value="">Semua Bahan Bakar</option>
            <option value="Gasoline">Bensin</option>
            <option value="Diesel">Solar</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Listrik</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Merk</label>
          <select name="brand" value={filters.brand} onChange={handleChange}>
            <option value="">Semua Merk</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Daihatsu">Daihatsu</option>
            <option value="Mitsubishi">Mitsubishi</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Nissan">Nissan</option>
            <option value="Mazda">Mazda</option>
            <option value="Hyundai">Hyundai</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Warna</label>
          <select name="color" value={filters.color} onChange={handleChange}>
            <option value="">Semua Warna</option>
            <option value="Putih">Putih</option>
            <option value="Hitam">Hitam</option>
            <option value="Silver">Silver</option>
            <option value="Merah">Merah</option>
            <option value="Biru">Biru</option>
            <option value="Abu-abu">Abu-abu</option>
          </select>
        </div>
      </div>
      
      <button onClick={resetFilters} className="btn btn-secondary" style={{ marginTop: '20px' }}>
        🔄 Reset Filter
      </button>
    </div>
  )
}