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
      <h1 style={{ marginBottom: '30px' }}>My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <p>You haven't added any cars to your favorites yet.</p>
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