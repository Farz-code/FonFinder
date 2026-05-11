import { Link } from 'react-router-dom'
import { ShoppingBag, Zap, Shield, Headphones, Smartphone, Battery, Cable } from 'lucide-react'
import { useAuth } from '../context/AuthContext'


const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 New Arrivals Every Week</div>
          <h1 className="hero-title">
            Find Your Perfect
            <span className="gradient-text"> Mobile Gear</span>
          </h1>
          <p className="hero-subtitle">
            Premium phones, accessories & gadgets at unbeatable prices.
            Your one-stop shop for everything mobile.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="hero-btn-primary">
              <ShoppingBag size={20} />
              Shop Now
            </Link>
            {!user && (
              <Link to="/register" className="hero-btn-secondary">
                Join FonFinder
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-phone">
            <div className="phone-screen">
              <Smartphone size={80} className="phone-icon" />
            </div>
            <div className="orbit orbit-1">
              <div className="orbit-item"><Zap size={20} /></div>
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-item"><Headphones size={20} /></div>
            </div>
            <div className="orbit orbit-3">
              <div className="orbit-item"><Battery size={20} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Everything you need for your mobile life</p>
        </div>
        <div className="categories-grid">
          {[
            { icon: <Smartphone size={32} />, name: 'Phones', slug: 'phones', color: '#00d4ff' },
            { icon: <Shield size={32} />, name: 'Cases', slug: 'cases', color: '#ff6b35' },
            { icon: <Zap size={32} />, name: 'Chargers', slug: 'chargers', color: '#ffd700' },
            { icon: <Headphones size={32} />, name: 'Earphones', slug: 'earphones', color: '#00c853' },
            { icon: <Cable size={32} />, name: 'Cables', slug: 'cables', color: '#9c27b0' },
            { icon: <Battery size={32} />, name: 'Power Banks', slug: 'powerbanks', color: '#ff4444' },
          ].map((cat) => (
            <Link
              to={`/shop?category=${cat.slug}`}
              key={cat.slug}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <div className="category-icon">{cat.icon}</div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Get your orders delivered within 2-3 business days' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% secure transactions with encrypted checkout' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy on all products' },
            { icon: '🎧', title: '24/7 Support', desc: 'Round the clock customer support for all queries' },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home