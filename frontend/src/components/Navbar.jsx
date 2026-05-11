import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          FON<span className="accent">FINDER</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          {user && (
            <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link" onClick={() => setMenuOpen(false)}>
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>
              <div className="user-info">
                <User size={18} />
                <span>{user.name}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-nav-btn">Sign In</Link>
              <Link to="/register" className="register-nav-btn">Register</Link>
            </>
          )}
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar