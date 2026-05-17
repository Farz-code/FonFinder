import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('https://fonfinder-backend.onrender.com/api/products'),
        axios.get('https://fonfinder-backend.onrender.com/api/orders/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      const orders = ordersRes.data
      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length
      })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            {[
              {
                icon: <Package size={28} />,
                label: 'Total Products',
                value: stats.totalProducts,
                color: '#00d4ff'
              },
              {
                icon: <ShoppingBag size={28} />,
                label: 'Total Orders',
                value: stats.totalOrders,
                color: '#ff6b35'
              },
              {
                icon: <TrendingUp size={28} />,
                label: 'Total Revenue',
                value: `₹${stats.totalRevenue}`,
                color: '#00c853'
              },
              {
                icon: <Users size={28} />,
                label: 'Pending Orders',
                value: stats.pendingOrders,
                color: '#ffd700'
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ '--stat-color': stat.color }}
              >
                <div className="stat-card-icon">{stat.icon}</div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{stat.value}</span>
                  <span className="stat-card-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/admin/products" className="action-card">
                <Package size={40} />
                <h3>Manage Products</h3>
                <p>Add, edit or delete products</p>
              </Link>
              <Link to="/admin/orders" className="action-card">
                <ShoppingBag size={40} />
                <h3>View Orders</h3>
                <p>See all customer orders</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard