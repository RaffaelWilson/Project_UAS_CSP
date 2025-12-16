'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { Edit, Trash2, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    km: '',
    city: '',
    transmission: '',
    fuel_type: '',
    color: '',
    description: '',
    images: ['/images/car1.jpeg'],
    seller_phone: '',
    status: 'tersedia',
    listed_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (data?.role !== 'admin') {
      router.push('/')
      return
    }

    setUser(user)
    fetchCars()
  }

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingCar) {
        const { error } = await supabase
          .from('cars')
          .update(formData)
          .eq('id', editingCar.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cars')
          .insert(formData)
        if (error) throw error
      }
      
      resetForm()
      fetchCars()
    } catch (error) {
      console.error('Error saving car:', error)
    }
  }

  const handleEdit = (car) => {
    setEditingCar(car)
    setFormData(car)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
      try {
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id)
        if (error) throw error
        fetchCars()
      } catch (error) {
        console.error('Error deleting car:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: '',
      price: '',
      km: '',
      city: '',
      transmission: '',
      fuel_type: '',
      color: '',
      description: '',
      images: ['/images/car1.jpeg'],
      seller_phone: '',
      status: 'tersedia',
      listed_date: new Date().toISOString().split('T')[0]
    })
    setEditingCar(null)
    setShowForm(false)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      try {
        const maxImages = 5
        const currentImages = formData.images || []
        const availableSlots = maxImages - currentImages.length
        const filesToProcess = files.slice(0, availableSlots)
        
        const newImages = []
        
        for (const file of filesToProcess) {
          const imageUrl = URL.createObjectURL(file)
          const fileName = `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`
      
          newImages.push(`/images/${fileName}`)
        }
        
        setFormData({ 
          ...formData, 
          images: [...currentImages, ...newImages]
        })
        
        console.log('Images selected:', newImages)
      } catch (error) {
        console.error('Error handling images:', error)
      }
    }
  }

  const removeImage = (indexToRemove) => {
    const updatedImages = formData.images.filter((_, index) => index !== indexToRemove)
    setFormData({ ...formData, images: updatedImages })
  }

  const handleChange = async (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newFormData)
    
    if (editingCar && e.target.name !== 'status') {
      clearTimeout(window.autoSaveTimeout)
      window.autoSaveTimeout = setTimeout(async () => {
        await autoSaveDraft(newFormData)
      }, 2000)
    }
  }

  const autoSaveDraft = async (draftData) => {
    try {
      localStorage.setItem(`car_draft_${editingCar?.id}`, JSON.stringify({
        ...draftData,
        lastSaved: new Date().toISOString()
      }))
      console.log('Draft auto-saved')
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <button onClick={() => window.history.back()} className="btn btn-back">
        ← Kembali
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard Admin</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={18} />
          🚗 Tambah Mobil
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            {editingCar ? '✏️ Edit Mobil' : '➕ Tambah Mobil Baru'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Merk</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tahun</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Harga</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Kilometer</label>
                <input type="number" name="km" value={formData.km} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Kota</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Transmisi</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} required>
                  <option value="">Pilih...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Otomatis</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bahan Bakar</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} required>
                  <option value="">Pilih...</option>
                  <option value="Gasoline">Bensin</option>
                  <option value="Diesel">Solar</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Listrik</option>
                </select>
              </div>
              <div className="form-group">
                <label>Warna</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>No. HP Penjual</label>
                <input type="tel" name="seller_phone" value={formData.seller_phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tanggal Listing</label>
                <input type="date" name="listed_date" value={formData.listed_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="tersedia">Tersedia</option>
                  <option value="terjual">Terjual</option>
                  <option value="dipesan">Dipesan</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Gambar Mobil (Maksimal 5 foto)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload}
                className="form-control"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Pilih hingga 5 gambar mobil</small>
              
              {formData.images && formData.images.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {formData.images.map((img, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={img} 
                        alt={`Preview ${index + 1}`} 
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '2px solid #ddd' }} 
                      />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Deskripsikan kondisi mobil..."></textarea>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingCar ? '💾 Update' : '➕ Tambah'} Mobil
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                ❌ Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>📋 Daftar Mobil</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Merk</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Model</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Tahun</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Harga</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>KM</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Kota</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Tgl Listing</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{car.brand}</td>
                  <td style={{ padding: '12px' }}>{car.model}</td>
                  <td style={{ padding: '12px' }}>{car.year}</td>
                  <td style={{ padding: '12px' }}>Rp {car.price?.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>{car.km?.toLocaleString()} km</td>
                  <td style={{ padding: '12px' }}>{car.city}</td>
                  <td style={{ padding: '12px' }}>{new Date(car.listed_date || car.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      background: car.status === 'tersedia' ? '#d4edda' : car.status === 'terjual' ? '#f8d7da' : '#fff3cd',
                      color: car.status === 'tersedia' ? '#155724' : car.status === 'terjual' ? '#721c24' : '#856404'
                    }}>
                      {car.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(car)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(car.id)} className="btn" style={{ padding: '6px 12px', background: '#dc3545', color: 'white', fontSize: '12px' }}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}