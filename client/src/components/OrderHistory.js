import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await fetch(`/api/orders/${user.id}`);
      const data = await response.json();
      
      // Sort orders by date (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCancelOrder = (orderDate) => {
    const orderTime = new Date(orderDate);
    const now = new Date();
    const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage('Order cancelled successfully');
      setTimeout(() => setMessage(''), 3000);
      loadOrders();
    } catch (error) {
      setMessage(error.message || 'Error cancelling order');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const buyAgain = async (items) => {
    try {
      for (const item of items) {
        await fetch(`/api/cart/${user.id}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity
          }),
        });
      }
      setMessage('Items added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      setMessage('Error adding items to cart');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Order History</h1>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/catalogue">
            <button className="btn-primary">Browse Books</button>
          </Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>
                    Order #{order.id}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Delivery Address:</strong>
                <p style={{ color: '#666', marginTop: '5px' }}>
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, 
                  {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Payment Method:</strong>
                <p style={{ color: '#666', marginTop: '5px', textTransform: 'capitalize' }}>
                  {order.paymentMethod.replace('-', ' ')}
                </p>
              </div>

              <div className="order-items">
                <strong>Items:</strong>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div>
                      <div style={{ fontWeight: '500' }}>Product ID: {item.productId}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {order.giftPointsUsed > 0 && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#fff3cd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}>
                  🎁 Gift Points Used: {order.giftPointsUsed} points 
                  (${(order.giftPointsUsed * 0.01).toFixed(2)} discount)
                </div>
              )}

              <div style={{ 
                marginTop: '15px', 
                paddingTop: '15px', 
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => buyAgain(order.items)}
                    className="btn-primary"
                  >
                    🔄 Buy Again
                  </button>
                  {canCancelOrder(order.orderDate) && order.status === 'pending' && (
                    <button 
                      onClick={() => cancelOrder(order.id)}
                      className="btn-danger"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {canCancelOrder(order.orderDate) && order.status === 'pending' && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  ⏰ You can cancel this order within 48 hours of placement
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;

// Made with Bob
