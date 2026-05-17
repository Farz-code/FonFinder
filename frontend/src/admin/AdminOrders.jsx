import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://fonfinder-backend.onrender.com/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://fonfinder-backend.onrender.com/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(orders.map(o =>
        o._id === id ? { ...o, status } : o
      ))
    } catch (err) {
      console.error(err)
    }
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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>All Orders</h1>
          <p>View and manage customer orders</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-products">No orders yet!</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="order-id-cell">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div className="customer-info">
                      <span>{order.user?.name || 'N/A'}</span>
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>
                  <td>{order.items.length} items</td>
                  <td className="price-cell">₹{order.totalAmount}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      ● {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                    >
                      {['pending', 'processing', 'shipped', 'delivered'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

export default AdminOrders