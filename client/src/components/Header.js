import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout, cartItemCount }) {
  return (
    <header className="App-header">
      <div className="header-content">
        <Link to="/" className="logo">📚 E-Book Store</Link>
        
        {user && (
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/catalogue">Browse Books</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart" className="cart-icon">
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </nav>
        )}
        
        {user && (
          <div className="user-info">
            <span className="gift-points">🎁 {user.giftPoints} Points</span>
            <span>Hello, {user.name}</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

// Made with Bob
