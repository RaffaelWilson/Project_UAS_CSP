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
    image_url: '',
    seller_phone: '',
    status: 'available'
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
    if (confirm('Are you sure you want to delete this car?')) {
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
      image_url: '',
      seller_phone: '',
      status: 'available'
    })
    setEditingCar(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          Add Car
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>KM</label>
                <input type="number" name="km" value={formData.km} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Seller Phone</label>
                <input type="tel" name="seller_phone" value={formData.seller_phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingCar ? 'Update' : 'Add'} Car
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Cars List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Brand</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Model</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>City</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{car.brand}</td>
                  <td style={{ padding: '10px' }}>{car.model}</td>
                  <td style={{ padding: '10px' }}>{car.year}</td>
                  <td style={{ padding: '10px' }}>Rp {car.price?.toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>{car.city}</td>
                  <td style={{ padding: '10px' }}>{car.status}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleEdit(car)} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(car.id)} className="btn" style={{ padding: '5px 10px', background: '#dc3545', color: 'white' }}>
                        <Trash2 size={16} />
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