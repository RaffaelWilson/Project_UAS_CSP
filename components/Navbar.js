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
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setIsAdmin(data?.role === 'admin')
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link href="/" className="navbar-brand">
            Used Car Sales
          </Link>
          <div className="navbar-nav">
            <Link href="/">Home</Link>
            {user ? (
              <>
                <Link href="/favorites">Favorites</Link>
                {isAdmin && <Link href="/admin">Admin</Link>}
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">Login</Link>
                <Link href="/auth/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}