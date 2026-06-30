import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderConfirmation({ user }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${user.id}`);
      const orders = await response.json();
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
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
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Order not found</h2>
          <Link to="/orders">
            <button className="btn-primary">View All Orders</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '32px', color: '#28a745', marginBottom: '10px' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Thank you for your purchase, {user.name}!
        </p>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Order ID: <strong>{order.id}</strong>
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Order Details</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <strong>Order Date:</strong>
              <p style={{ color: '#666', marginTop: '5px' }}>
                {formatDate(order.orderDate)}
              </p>
            </div>
            <div>
              <strong>Status:</strong>
              <p style={{ marginTop: '5px' }}>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>Delivery Address:</strong>
            <p style={{ color: '#666', marginTop: '5px' }}>
              {order.deliveryAddress.street}<br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}<br />
              {order.deliveryAddress.country}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>Payment Method:</strong>
            <p style={{ color: '#666', marginTop: '5px', textTransform: 'capitalize' }}>
              {order.paymentMethod.replace('-', ' ')}
            </p>
          </div>
        </div>

        <div style={{ 
          borderTop: '2px solid #e9ecef', 
          paddingTop: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Items Ordered</h3>
          {order.items.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                  Product ID: {item.productId}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Quantity: {item.quantity} × ${item.price}
                </div>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {order.giftPointsUsed > 0 && (
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px'
          }}>
            <strong>🎁 Gift Points Applied:</strong>
            <p style={{ marginTop: '5px' }}>
              {order.giftPointsUsed} points redeemed 
              (${(order.giftPointsUsed * 0.01).toFixed(2)} discount)
            </p>
          </div>
        )}

        <div style={{ 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <strong style={{ fontSize: '24px' }}>Total Amount:</strong>
          <strong style={{ fontSize: '28px', color: '#007bff' }}>
            ${order.totalAmount.toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="alert alert-info">
        <strong>📧 Confirmation Email Sent</strong>
        <p style={{ marginTop: '5px', marginBottom: '0' }}>
          We've sent a confirmation email to {user.email} with your order details.
        </p>
      </div>

      <div className="alert alert-success">
        <strong>🎁 Earn More Points!</strong>
        <p style={{ marginTop: '5px', marginBottom: '0' }}>
          You'll earn gift points on this purchase that can be used for future orders.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        <Link to="/orders">
          <button className="btn-primary">View All Orders</button>
        </Link>
        <Link to="/catalogue">
          <button className="btn-secondary">Continue Shopping</button>
        </Link>
        <Link to="/">
          <button className="btn-secondary">Go to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;

// Made with Bob
