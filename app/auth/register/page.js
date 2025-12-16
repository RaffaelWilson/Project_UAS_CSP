'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name,
            phone,
          }
        }
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        const popup = document.createElement('div')
        popup.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #fff3cd; color: #856404; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; border: 1px solid #ffeaa7;">
            📧 Silakan cek email untuk konfirmasi akun, lalu login.
          </div>
        `
        document.body.appendChild(popup)
        setTimeout(() => {
          document.body.removeChild(popup)
          router.push('/auth/login')
        }, 3000)
      } else if (data.user) {
        try {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
          
          const isFirstUser = count === 0
          
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name,
            phone,
            role: isFirstUser ? 'admin' : 'user'
          })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
            setTimeout(async () => {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                name,
                phone,
                role: isFirstUser ? 'admin' : 'user'
              })
            }, 1000)
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
        }
        const popup = document.createElement('div')
        popup.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #d4edda; color: #155724; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; border: 1px solid #c3e6cb;">
            ✅ Pendaftaran berhasil! Silakan login dengan akun Anda.
          </div>
        `
        document.body.appendChild(popup)
        setTimeout(() => {
          document.body.removeChild(popup)
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>📝 Daftar</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Buat akun baru untuk mulai jual beli mobil</p>
        </div>
        
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>👤 Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email aktif"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📱 No. Handphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⏳ Sedang mendaftar...' : '🚀 Daftar Sekarang'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
          Sudah punya akun? <Link href="/auth/login" style={{ color: '#667eea', fontWeight: '600' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  )
}