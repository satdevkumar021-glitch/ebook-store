import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import ProductCatalogue from './components/ProductCatalogue';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      loadCart(JSON.parse(userData).id);
    }
  }, []);

  const loadCart = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    loadCart(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    setCart({ items: [] });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} cartItemCount={cart.items.length} />
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/" 
            element={user ? <Home user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/catalogue" 
            element={user ? <ProductCatalogue user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/product/:id" 
            element={user ? <ProductDetail user={user} updateCart={updateCart} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={user ? <Cart user={user} cart={cart} updateCart={updateCart} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/checkout" 
            element={user ? <Checkout user={user} cart={cart} updateCart={updateCart} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orders" 
            element={user ? <OrderHistory user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/order-confirmation/:orderId" 
            element={user ? <OrderConfirmation user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Made with Bob
