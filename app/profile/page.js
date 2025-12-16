'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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
    fetchProfile(user.id)
  }

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // AJAX: Live validation
    if (name === 'phone') {
      await validatePhone(value)
    } else if (name === 'newPassword') {
      validatePassword(value)
    }
  }

  const validatePhone = async (phone) => {
    if (phone.length >= 10) {
      try {
        // AJAX call to validate phone number
        const response = await fetch('/api/validate-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        })
        
        const result = await response.json()
        if (!result.valid) {
          setError('Format nomor telepon tidak valid')
        } else {
          setError('')
        }
      } catch (error) {
        // Fallback validation
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
        if (!phoneRegex.test(phone)) {
          setError('Format nomor telepon tidak valid')
        } else {
          setError('')
        }
      }
    }
  }

  const validatePassword = (password) => {
    if (password && password.length < 6) {
      setError('Password minimal 6 karakter')
    } else {
      setError('')
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Konfirmasi password tidak cocok')
        }

        if (formData.newPassword.length < 6) {
          throw new Error('Password baru minimal 6 karakter')
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        })

        if (passwordError) throw passwordError
      }

      setSuccess('Profil berhasil diperbarui!')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Refresh profile data
      fetchProfile(user.id)
    } catch (error) {
      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="card" style={{ textAlign: 'center', padding: '50px' }}>Memuat...</div>

  return (
    <div>
      <button onClick={() => window.history.back()} className="btn btn-back">
        ← Kembali
      </button>

      <h1 className="page-title">👤 Profil Saya</h1>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>📝 Informasi Profil</h3>
          
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #a7f3d0' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>📧 Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{ background: '#f8fafc', color: '#666' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Email tidak dapat diubah</small>
            </div>

            <div className="form-group">
              <label>👤 Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="form-group">
              <label>📱 No. Handphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                required
              />
            </div>

            <div className="form-group">
              <label>🏷️ Role</label>
              <input
                type="text"
                value={profile?.role === 'admin' ? 'Administrator' : 'Pengguna'}
                disabled
                style={{ background: '#f8fafc', color: '#666' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>🔒 Ubah Password</h3>
          
          <div className="form-group">
            <label>🔐 Password Saat Ini</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Masukkan password saat ini"
            />
          </div>

          <div className="form-group">
            <label>🆕 Password Baru</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="form-group">
            <label>✅ Konfirmasi Password Baru</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password baru"
            />
          </div>

          <div style={{ background: '#fff3cd', padding: '16px', borderRadius: '8px', border: '1px solid #ffeaa7', marginTop: '20px' }}>
            <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
              💡 <strong>Tips:</strong> Kosongkan field password jika tidak ingin mengubah password
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>📊 Statistik Akun</h3>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', marginBottom: '8px' }}>
              {new Date(user?.created_at).toLocaleDateString('id-ID')}
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>Bergabung Sejak</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#764ba2', marginBottom: '8px' }}>
              {profile?.role === 'admin' ? 'Admin' : 'User'}
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>Status Akun</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
              Aktif
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>Status Login</p>
          </div>
        </div>
      </div>
    </div>
  )
}