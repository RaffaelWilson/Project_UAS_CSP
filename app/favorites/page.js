'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import CarCard from '../../components/CarCard'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    fetchFavorites(user.id)
  }

  const fetchFavorites = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          cars (*)
        `)
        .eq('user_id', userId)

      if (error) throw error
      setFavorites(data || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <button onClick={() => window.history.back()} className="btn btn-back">
        ← Kembali
      </button>
      
      <h1 className="page-title">Mobil Favorit Saya</h1>
      
      {favorites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💔</div>
          <p style={{ fontSize: '18px', color: '#666' }}>Anda belum menambahkan mobil ke daftar favorit.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {favorites.map(favorite => (
            <CarCard key={favorite.id} car={favorite.cars} />
          ))}
        </div>
      )}
    </div>
  )
}