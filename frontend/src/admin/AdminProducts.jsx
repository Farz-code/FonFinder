import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Trash2, Plus, X } from 'lucide-react'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    category: 'phones', stock: ''
  })
  const [image, setImage] = useState(null)
  const [adding, setAdding] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://fonfinder-backend.onrender.com/api/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('stock', formData.stock)
      if (image) data.append('image', image)

      await axios.post('https://fonfinder-backend.onrender.com/api/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setFormData({
        name: '', description: '', price: '',
        category: 'phones', stock: ''
      })
      setImage(null)
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
    setAdding(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`https://fonfinder-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Products</h1>
          <p>Add or remove products from your store</p>
        </div>
        <button
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="add-product-form">
          <h2>Add New Product</h2>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {['phones', 'cases', 'chargers', 'earphones', 'cables', 'powerbanks', 'others'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter product description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="file-input"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={adding}>
              {adding ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="table-image">
                      {product.image
                        ? <img src={`https://fonfinder-backend.onrender.com${product.image}`} alt={product.name} />
                        : <span>📱</span>
                      }
                    </div>
                  </td>
                  <td className="product-name-cell">{product.name}</td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="price-cell">₹{product.price}</td>
                  <td>
                    <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProducts