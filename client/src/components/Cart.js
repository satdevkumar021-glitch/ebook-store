import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cart({ user, cart, updateCart }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, [cart]);

  const loadCartItems = async () => {
    if (!cart.items || cart.items.length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const itemsWithDetails = await Promise.all(
        cart.items.map(async (item) => {
          const response = await fetch(`/api/products/${item.productId}`);
          const product = await response.json();
          return {
            ...item,
            product
          };
        })
      );
      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/cart/${user.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        }),
      });

      const data = await response.json();
      updateCart(data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`/api/cart/${user.id}/remove/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      updateCart(data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some books to get started!</p>
          <Link to="/catalogue">
            <button className="btn-primary">Browse Books</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          {cartItems.map(item => (
            <div key={item.productId} className="cart-item">
              <img 
                src={item.product.coverImage} 
                alt={item.product.title}
                className="cart-item-image"
              />
              
              <div className="cart-item-details">
                <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>
                  {item.product.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  by {item.product.author}
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <span className="product-category">{item.product.category}</span>
                  <span className="product-category">{item.product.brand}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                  ${item.product.price}
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeItem(item.productId)}
                  className="btn-danger"
                  style={{ marginTop: '10px' }}
                >
                  Remove
                </button>

                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="cart-summary">
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Order Summary</h2>
            
            <div className="summary-row">
              <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>${calculateTotal()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#28a745' }}>FREE</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn-success"
              style={{ width: '100%', marginTop: '20px', padding: '15px' }}
            >
              Proceed to Checkout
            </button>

            <Link to="/catalogue">
              <button 
                className="btn-secondary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

// Made with Bob
