'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
    <div className="card">
      <div style={{ position: 'relative' }}>
        <img
          src={car.image_url || '/placeholder-car.jpg'}
          alt={`${car.brand} ${car.model}`}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
        />
        {user && (
          <button
            onClick={toggleFavorite}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
      
      <h3 style={{ margin: '15px 0 10px 0' }}>
        {car.brand} {car.model} ({car.year})
      </h3>
      
      <div style={{ marginBottom: '15px', color: '#666' }}>
        <p>Price: Rp {car.price?.toLocaleString()}</p>
        <p>KM: {car.km?.toLocaleString()}</p>
        <p>City: {car.city}</p>
      </div>
      
      <Link href={`/cars/${car.id}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
        View Details
      </Link>
    </div>
  )
}