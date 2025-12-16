'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Check if profile exists, create if not
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (!profile) {
          // Create missing profile
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
          
          const isFirstUser = count === 0
          
          await supabase.from('profiles').upsert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            phone: user.user_metadata?.phone || '',
            role: isFirstUser ? 'admin' : 'user'
          })
          
          setIsAdmin(isFirstUser)
        } else {
          setIsAdmin(profile.role === 'admin')
        }
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      
      // Create profile on sign in if missing
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single()
        
        if (!profile) {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
          
          await supabase.from('profiles').upsert({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            phone: session.user.user_metadata?.phone || '',
            role: count === 0 ? 'admin' : 'user'
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#FFFDD0', borderBottom: '2px solid #8B0000' }}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center" style={{ color: '#8B0000', fontWeight: '800', fontSize: '24px', textDecoration: 'none' }}>
          <i className="bi bi-car-front me-2" style={{ fontSize: '28px' }}></i>
          Jual Mobil Bekas Indonesia
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/homepage" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Home</Link>
            </li>
            {user ? (
              <>
                {!isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link href="/" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Beranda</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/favorites" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Favorit</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link href="/profile" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Profil</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-secondary ms-2">
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Lihat Mobil</Link>
                </li>
                <li className="nav-item">
                  <Link href="/auth/login" className="nav-link" style={{ color: '#8B0000', fontWeight: '600' }}>Masuk</Link>
                </li>
                <li className="nav-item">
                  <Link href="/auth/register" className="btn btn-primary ms-2" style={{ textDecoration: 'none', color: 'white' }}>Daftar</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}