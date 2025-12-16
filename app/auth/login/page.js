'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error('Email atau password salah.')
      
      const popup = document.createElement('div')
      popup.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #d4edda; color: #155724; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; border: 1px solid #c3e6cb;">
          ✅ Login berhasil! Selamat datang kembali.
        </div>
      `
      document.body.appendChild(popup)
      setTimeout(() => {
        document.body.removeChild(popup)
        if (data.user?.user_metadata?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      }, 2000)
    } catch (error) {
      setError(error.message || 'Terjadi kesalahan saat login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>🔐 Masuk</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Masuk ke akun Anda untuk melanjutkan</p>
        </div>
        
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⏳ Sedang masuk...' : '🚀 Masuk'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
          Belum punya akun? <Link href="/auth/register" style={{ color: '#667eea', fontWeight: '600' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  )
}