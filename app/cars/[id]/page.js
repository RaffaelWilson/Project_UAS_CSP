'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Heart, Phone, MessageCircle } from 'lucide-react'
import CarImageSlider from '../../../components/CarImageSlider'

export default function CarDetail() {
  const params = useParams()
  const [car, setCar] = useState(null)
  const router = useRouter()
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
    } finally {
      setLoading(false)
    }
  }

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user && user.user_metadata?.role === 'admin') {
      router.push('/admin/dashboard')
    }
    
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
    const message = `Halo, saya tertarik dengan mobil ${car.brand} ${car.model} tahun ${car.year} yang Anda jual. Apakah masih tersedia?`
    const url = `https://wa.me/${car.seller_phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleBooking = async () => {
    if (!user) return

    await supabase.from('bookings').insert({
      user_id: user.id,
      car_id: params.id,
      status: 'menunggu'
    })
    showNotification('Permintaan booking berhasil dikirim!', 'success')
  }

  const showNotification = (message, type) => {
    const notification = document.createElement('div')
    notification.innerHTML = `<div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#d4edda' : '#f8d7da'}; color: ${type === 'success' ? '#155724' : '#721c24'}; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};">${message}</div>`
    document.body.appendChild(notification)
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  if (loading) return <div className="card" style={{ textAlign: 'center', padding: '50px' }}>Memuat...</div>
  if (!car) return <div className="card" style={{ textAlign: 'center', padding: '50px' }}>Mobil Tidak Ditemukan</div>

  return (
    <div>
      <button onClick={() => window.history.back()} className="btn btn-back">
        ← Kembali
      </button>
      
      <div className="grid grid-2" style={{ gap: '40px' }}>
        <div>
          <CarImageSlider 
            images={car.images || [car.image_url || '/images/car1.jpeg']} 
            carName={`${car.brand} ${car.model}`} 
          />
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', margin: 0 }}>
              {car.brand} {car.model} ({car.year})
            </h1>
            {user && (
              <button
                onClick={toggleFavorite}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
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
          
          <div style={{ marginBottom: '32px' }}>
            <div className="price-tag" style={{ fontSize: '32px', marginBottom: '24px' }}>
              Rp {car.price?.toLocaleString()}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-calendar" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>TAHUN</div>
                  <div style={{ fontWeight: '700' }}>{car.year}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-speedometer2" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>KILOMETER</div>
                  <div style={{ fontWeight: '700' }}>{car.km?.toLocaleString()} km</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-geo-alt" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>KOTA</div>
                  <div style={{ fontWeight: '700' }}>{car.city}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-gear" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>TRANSMISI</div>
                  <div style={{ fontWeight: '700' }}>{car.transmission}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-fuel-pump" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>BAHAN BAKAR</div>
                  <div style={{ fontWeight: '700' }}>{car.fuel_type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="bi bi-palette" style={{ fontSize: '16px', color: '#8B0000' }}></i>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>WARNA</div>
                  <div style={{ fontWeight: '700' }}>{car.color}</div>
                </div>
              </div>
            </div>
            
            {car.description && (
              <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginBottom: '8px' }}>DESKRIPSI</div>
                <p style={{ lineHeight: '1.6', color: '#4a5568' }}>{car.description}</p>
              </div>
            )}
          </div>
          
          {user && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={handleWhatsApp} className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }}>
                <i className="bi bi-whatsapp me-2"></i>
                Hubungi via WhatsApp
              </button>
              <button onClick={handleBooking} className="btn btn-secondary" style={{ flex: 1, minWidth: '200px' }}>
                <i className="bi bi-calendar-check me-2"></i>
                Booking Sekarang
              </button>
            </div>
          )}
          
          {!user && (
            <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '12px', border: '1px solid #ffeaa7' }}>
              <p style={{ color: '#856404', fontWeight: '600', margin: 0 }}>
                🔒 Silakan masuk terlebih dahulu untuk menghubungi penjual atau melakukan booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}