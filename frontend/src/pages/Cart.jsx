import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [ordering, setOrdering] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [address, setAddress] = useState({
    fullName: '', phone: '', address: '', city: '', pincode: ''
  })
  const [success, setSuccess] = useState(false)

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setOrdering(true)
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: totalPrice,
          shippingAddress: address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      clearCart()
      setSuccess(true)
    } catch (err) {
      console.error(err)
    }
    setOrdering(false)
  }

  if (success) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order has been placed and will be delivered soon.</p>
          <div className="success-buttons">
            <Link to="/shop" className="continue-btn">Continue Shopping</Link>
            <Link to="/orders" className="orders-btn">View My Orders</Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={80} className="empty-icon" />
          <h2>Your cart is empty!</h2>
          <p>Add some products to your cart</p>
          <Link to="/shop" className="continue-btn">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                {item.image
                  ? <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                  : <span>📱</span>
                }
              </div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price}</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Items ({cartItems.length})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          {!showCheckout ? (
            <button
              className="checkout-btn"
              onClick={() => user ? setShowCheckout(true) : navigate('/login')}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          ) : (
            <form onSubmit={handleOrder} className="checkout-form">
              <h3>Shipping Address</h3>
              <input
                placeholder="Full Name"
                value={address.fullName}
                onChange={e => setAddress({ ...address, fullName: e.target.value })}
                required
              />
              <input
                placeholder="Phone Number"
                value={address.phone}
                onChange={e => setAddress({ ...address, phone: e.target.value })}
                required
              />
              <input
                placeholder="Address"
                value={address.address}
                onChange={e => setAddress({ ...address, address: e.target.value })}
                required
              />
              <input
                placeholder="City"
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                placeholder="Pincode"
                value={address.pincode}
                onChange={e => setAddress({ ...address, pincode: e.target.value })}
                required
              />
              <button type="submit" className="checkout-btn" disabled={ordering}>
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart