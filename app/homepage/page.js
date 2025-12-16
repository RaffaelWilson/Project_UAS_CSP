'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Homepage() {
  const [stats, setStats] = useState({ totalCars: 0, totalUsers: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      
      const response = await fetch('/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      } else {
        
        const { data: cars } = await supabase.from('cars').select('id', { count: 'exact' })
        const { data: users } = await supabase.from('profiles').select('id', { count: 'exact' })
        setStats({ 
          totalCars: cars?.length || 0, 
          totalUsers: users?.length || 0 
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <div className="card text-center" style={{ padding: '60px 40px', marginBottom: '40px', background: '#F5DEB3' }}>
        <div className="d-flex justify-content-center align-items-center mb-3">
          <i className="bi bi-car-front" style={{ fontSize: '4rem', color: '#8B0000', marginRight: '20px' }}></i>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#8B0000', margin: 0 }}>
            Jual Mobil Bekas Indonesia
          </h1>
        </div>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Platform jual beli mobil bekas terpercaya di Indonesia. Temukan mobil impian Anda dengan harga terbaik!
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/auth/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            <i className="bi bi-rocket-takeoff me-2"></i>Mulai Sekarang
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            <i className="bi bi-eye me-2"></i>Lihat Mobil
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-center h-100" style={{ padding: '40px 20px' }}>
            <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: '#8B0000', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Terpercaya</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Platform jual beli mobil bekas dengan sistem keamanan tinggi dan verifikasi seller</p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center h-100" style={{ padding: '40px 20px' }}>
            <i className="bi bi-lightning-charge" style={{ fontSize: '3rem', color: '#8B0000', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Proses Cepat</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Pencarian mudah dengan filter lengkap dan kontak langsung via WhatsApp</p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center h-100" style={{ padding: '40px 20px' }}>
            <i className="bi bi-currency-dollar" style={{ fontSize: '3rem', color: '#8B0000', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Harga Terbaik</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Dapatkan mobil bekas berkualitas dengan harga yang kompetitif</p>
          </div>
        </div>
      </div>
    </div>
  )
}