'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase, getImageUrl } from '../lib/supabase'
import { Heart } from 'lucide-react'

export default function CarCard({ car }) {
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        checkFavorite(user.id)
      }
    }
    getUser()
  }, [])

  const checkFavorite = async (userId) => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', car.id)
      .single()
    
    setIsFavorite(!!data)
  }

  const toggleFavorite = async () => {
    if (!user) return

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', car.id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: car.id })
      setIsFavorite(true)
    }
  }

  return (
    <div className="card car-card">
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <img
          src={getImageUrl((car.images && car.images[0]) || car.image_url)}
          alt={`${car.brand} ${car.model}`}
          className="car-image"
        />
        {user && (
          <button
            onClick={toggleFavorite}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              padding: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <Heart
              size={20}
              fill={isFavorite ? '#ff4757' : 'none'}
              color={isFavorite ? '#ff4757' : '#666'}
            />
          </button>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>
        {car.brand} {car.model} ({car.year})
      </h3>
      
      <div className="price-tag" style={{ marginBottom: '16px' }}>
        Rp {car.price?.toLocaleString()}
      </div>
      
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span><i className="bi bi-geo-alt me-1"></i>{car.city}</span>
          <span><i className="bi bi-speedometer2 me-1"></i>{car.km?.toLocaleString()} km</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><i className="bi bi-gear me-1"></i>{car.transmission}</span>
          <span><i className="bi bi-fuel-pump me-1"></i>{car.fuel_type}</span>
        </div>
      </div>
      
      <Link href={`/cars/${car.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
        <i className="bi bi-eye me-2"></i>Lihat Detail
      </Link>
    </div>
  )
}