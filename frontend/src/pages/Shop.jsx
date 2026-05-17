import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const [added, setAdded] = useState({})

  const categories = [
    { label: 'All', value: '' },
    { label: 'Phones', value: 'phones' },
    { label: 'Cases', value: 'cases' },
    { label: 'Chargers', value: 'chargers' },
    { label: 'Earphones', value: 'earphones' },
    { label: 'Cables', value: 'cables' },
    { label: 'Power Banks', value: 'powerbanks' },
    { label: 'Others', value: 'others' },
  ]

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) setSelectedCategory(category)
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = selectedCategory
        ? `https://fonfinder-backend.onrender.com/api/products?category=${selectedCategory}`
        : 'https://fonfinder-backend.onrender.com/api/products'
      const res = await axios.get(url)
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    setAdded({ ...added, [product._id]: true })
    setTimeout(() => {
      setAdded(prev => ({ ...prev, [product._id]: false }))
    }, 1500)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        <h1>Our Products</h1>
        <p>Discover the latest mobile gadgets & accessories</p>
      </div>

      {/* Filters */}
      <div className="shop-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-filters">
          <Filter size={18} />
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="no-products">
          <p>No products found!</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img
                    src={`https://fonfinder-backend.onrender.com${product.image}`}
                    alt={product.name}
                  />
                ) : (
                  <div className="no-image">📱</div>
                )}
                <div className="product-category">{product.category}</div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">₹{product.price}</span>
                  <button
                    className={`add-cart-btn ${added[product._id] ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' :
                      added[product._id] ? '✓ Added!' : (
                        <><ShoppingCart size={16} /> Add</>
                      )}
                  </button>
                </div>
                <div className="product-stock">
                  {product.stock > 0
                    ? <span className="in-stock">● In Stock ({product.stock})</span>
                    : <span className="out-stock">● Out of Stock</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shop