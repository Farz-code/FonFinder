import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const { token } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://fonfinder-backend.onrender.com/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffd700'
      case 'processing': return '#00d4ff'
      case 'shipped': return '#ff6b35'
      case 'delivered': return '#00c853'
      default: return '#a0a0b0'
    }
  }

  if (loading) return (
    <div className="orders-page">
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div className="orders-page">
      <div className="empty-cart">
        <Package size={80} className="empty-icon" />
        <h2>No orders yet!</h2>
        <p>Start shopping to see your orders here</p>
        <Link to="/shop" className="continue-btn">Browse Products</Link>
      </div>
    </div>
  )

  return (
    <div className="orders-page">
      <h1 className="cart-title">My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div
              className="order-header"
              onClick={() => toggleExpand(order._id)}
            >
              <div className="order-meta">
                <span className="order-id">
                  Order #{order._id.slice(-8).toUpperCase()}
                </span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="order-summary-info">
                <span
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  ● {order.status.toUpperCase()}
                </span>
                <span className="order-total">₹{order.totalAmount}</span>
                {expanded[order._id]
                  ? <ChevronUp size={20} />
                  : <ChevronDown size={20} />
                }
              </div>
            </div>

            {expanded[order._id] && (
              <div className="order-details">
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <div className="order-item-image">
                        {item.image
                          ? <img src={`https://fonfinder-backend.onrender.com${item.image}`} alt={item.name} />
                          : <span>📱</span>
                        }
                      </div>
                      <div className="order-item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="order-item-total">
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-shipping">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders