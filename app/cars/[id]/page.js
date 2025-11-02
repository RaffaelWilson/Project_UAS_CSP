'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Heart, Phone, MessageCircle } from 'lucide-react'

export default function CarDetail() {
  const params = useParams()
  const [car, setCar] = useState(null)
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCar()
      getUser()
    }
  }, [params.id])

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setCar(data)
    } catch (error) {
      console.error('Error fetching car:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      checkFavorite(user.id)
    }
  }

  const checkFavorite = async (userId) => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', params.id)
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
        .eq('car_id', params.id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: params.id })
      setIsFavorite(true)
    }
  }

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your ${car.brand} ${car.model} (${car.year})`
    const url = `https://wa.me/${car.seller_phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleBooking = async () => {
    if (!user) return

    try {
      await supabase.from('bookings').insert({
        user_id: user.id,
        car_id: params.id,
        status: 'pending'
      })
      alert('Booking request sent!')
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!car) return <div>Car not found</div>

  return (
    <div className="grid grid-2" style={{ gap: '40px', marginTop: '20px' }}>
      <div>
        <img
          src={car.image_url || '/placeholder-car.jpg'}
          alt={`${car.brand} ${car.model}`}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h1>{car.brand} {car.model} ({car.year})</h1>
          {user && (
            <button
              onClick={toggleFavorite}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <Heart
                size={24}
                fill={isFavorite ? '#ff4757' : 'none'}
                color={isFavorite ? '#ff4757' : '#666'}
              />
            </button>
          )}
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#007bff', marginBottom: '10px' }}>
            Rp {car.price?.toLocaleString()}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <strong>Year:</strong> {car.year}
            </div>
            <div>
              <strong>KM:</strong> {car.km?.toLocaleString()}
            </div>
            <div>
              <strong>City:</strong> {car.city}
            </div>
            <div>
              <strong>Transmission:</strong> {car.transmission}
            </div>
            <div>
              <strong>Fuel Type:</strong> {car.fuel_type}
            </div>
            <div>
              <strong>Color:</strong> {car.color}
            </div>
          </div>
          
          {car.description && (
            <div style={{ marginBottom: '20px' }}>
              <strong>Description:</strong>
              <p style={{ marginTop: '5px', lineHeight: '1.5' }}>{car.description}</p>
            </div>
          )}
        </div>
        
        {user && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleWhatsApp} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <button onClick={handleBooking} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} />
              Book Now
            </button>
          </div>
        )}
        
        {!user && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Please login to contact seller or make a booking.
          </p>
        )}
      </div>
    </div>
  )
}