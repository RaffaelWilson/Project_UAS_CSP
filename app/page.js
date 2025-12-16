'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import CarCard from '../components/CarCard'
import Link from 'next/link'

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({
    term: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    kmRange: ''
  })
  const [cities, setCities] = useState([])
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetchCars = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user && user.user_metadata?.role === 'admin') {
        router.push('/admin/dashboard')
        return
      }

      fetchDistinctCities()
      fetchCars()
    }

    checkUserAndFetchCars()
  }, [router])

  const fetchDistinctCities = async () => {
    try {
      const { data, error } = await supabase.from('cars').select('city').eq('status', 'tersedia')
      if (error) throw error
      const uniqueCities = [...new Set(data.map(car => car.city).filter(Boolean))].sort()
      setCities(uniqueCities)
    } catch (error) {
      console.error('Error fetching cities:', error.message)
    }
  }

  const fetchCars = async (currentFilters = filters) => {
    setLoading(true)
    try {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'tersedia')

      if (currentFilters.term) {
        query = query.or(`brand.ilike.%${currentFilters.term}%,model.ilike.%${currentFilters.term}%`)
      }
      if (currentFilters.city) {
        query = query.eq('city', currentFilters.city)
      }
      if (currentFilters.minPrice) {
        query = query.gte('price', currentFilters.minPrice)
      }
      if (currentFilters.maxPrice) {
        query = query.lte('price', currentFilters.maxPrice)
      }
      if (currentFilters.kmRange) {
        const [minKm, maxKm] = currentFilters.kmRange.split('-')
        if (minKm) {
          query = query.gte('km', parseInt(minKm))
        }
        if (maxKm) {
          query = query.lte('km', parseInt(maxKm))
        }
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        
      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error.message)
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  if (user && user.user_metadata?.role === 'admin') {
    return <div className="card" style={{ textAlign: 'center', padding: '50px' }}>Mengalihkan ke dashboard admin...</div>
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCars(filters)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    const resetState = {
      term: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      kmRange: ''
    }
    setFilters(resetState)
    fetchCars(resetState)
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
        Memuat mobil terbaru...
      </div>
    )
  }

  return (
    <div>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Temukan Mobil Impian Anda</h1>
          <form onSubmit={handleSearch} className="filter-form-v2 card">
            <div className="form-group">
              <label>🔍 Cari Mobil</label>
              <input name="term" type="text" placeholder="Contoh: Toyota Avanza" value={filters.term} onChange={handleFilterChange} />
            </div>
            <div className="form-group">
              <label>📍 Lokasi</label>
              <select name="city" value={filters.city} onChange={handleFilterChange}>
                <option value="">Semua Kota</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>🛣️ Jarak Tempuh (KM)</label>
              <select name="kmRange" value={filters.kmRange} onChange={handleFilterChange}>
                <option value="">Semua KM</option>
                <option value="0-10000">&lt; 10.000</option>
                <option value="10000-50000">10.000 - 50.000</option>
                <option value="50000-100000">50.000 - 100.000</option>
                <option value="100000-">&gt; 100.000</option>
              </select>
            </div>
            <div className="form-group price-range">
              <label>💰 Rentang Harga</label>
              <input name="minPrice" type="number" placeholder="Harga Min" value={filters.minPrice} onChange={handleFilterChange} />
              <span>-</span>
              <input name="maxPrice" type="number" placeholder="Harga Max" value={filters.maxPrice} onChange={handleFilterChange} />
            </div>
            <div className="filter-actions-v2">
              <button type="submit" className="btn btn-primary">
                Cari Mobil
              </button>
              <button type="button" onClick={resetFilters} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 className="section-title">🚗 Mobil Terbaru</h2>
          <Link href="/cars" className="btn btn-secondary">
            Lihat Semua →
          </Link>
        </div>
        
        {!loading && cars.length > 0 ? (
          <div className="grid grid-3">
            {cars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : !loading && (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <p>Saat ini belum ada mobil yang tersedia.</p>
          </div>
        )}
      </div>
    </div>
  )
}