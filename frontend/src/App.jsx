import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import { useAuth } from './context/AuthContext'
import './App.css'

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      </Routes>
    </Router>
  )
}

export default App