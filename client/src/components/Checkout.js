import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ user, cart, updateCart }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [giftPointsToUse, setGiftPointsToUse] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [cart]);

  const loadData = async () => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    try {
      const [addressesResponse, ...productResponses] = await Promise.all([
        fetch(`/api/users/${user.id}/addresses`),
        ...cart.items.map(item => fetch(`/api/products/${item.productId}`))
      ]);

      const addressesData = await addressesResponse.json();
      const products = await Promise.all(productResponses.map(r => r.json()));

      const itemsWithDetails = cart.items.map((item, index) => ({
        ...item,
        product: products[index]
      }));

      setAddresses(addressesData);
      if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0].id);
      }
      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error loading checkout data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return giftPointsToUse * 0.01; // 1 point = $0.01
  };

  const calculateTotal = () => {
    return (calculateSubtotal() - calculateDiscount()).toFixed(2);
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const addNewAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user.id}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowAddressForm(false);
      setNewAddress({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      });
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Error adding address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const selectedAddr = addresses.find(a => a.id === selectedAddress);
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: orderItems,
          totalAmount: parseFloat(calculateTotal()),
          deliveryAddress: selectedAddr,
          paymentMethod,
          giftPointsUsed: giftPointsToUse
        }),
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.message || 'Order placement failed');
      }

      // Update user's gift points in local storage
      const updatedUser = {
        ...user,
        giftPoints: user.giftPoints - giftPointsToUse
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Clear cart
      updateCart({ items: [] });

      // Navigate to confirmation page
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Error placing order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="checkout-container">
        <div>
          {/* Delivery Address Section */}
          <div className="card">
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Delivery Address</h2>
            
            {addresses.length > 0 && (
              <div className="address-list">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    className={`address-card ${selectedAddress === address.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {address.type}
                    </div>
                    <div>{address.street}</div>
                    <div>{address.city}, {address.state} {address.zipCode}</div>
                    <div>{address.country}</div>
                  </div>
                ))}
              </div>
            )}

            {!showAddressForm ? (
              <button 
                onClick={() => setShowAddressForm(true)}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                + Add New Address
              </button>
            ) : (
              <form onSubmit={addNewAddress}>
                <div className="form-group">
                  <label>Address Type</label>
                  <select name="type" value={newAddress.type} onChange={handleAddressChange}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-primary">Save Address</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="card">
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Payment Method</h2>
            
            <div className="payment-methods">
              <div
                className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('credit-card')}
              >
                <span style={{ fontSize: '24px' }}>💳</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Credit/Debit Card</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Visa, Mastercard, Amex</div>
                </div>
              </div>

              <div
                className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <span style={{ fontSize: '24px' }}>🅿️</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>PayPal</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Fast and secure</div>
                </div>
              </div>

              <div
                className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <span style={{ fontSize: '24px' }}>📱</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>UPI</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Google Pay, PhonePe, Paytm</div>
                </div>
              </div>

              <div
                className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <span style={{ fontSize: '24px' }}>💵</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pay when you receive</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gift Points Section */}
          <div className="gift-points-section">
            <h3 style={{ marginBottom: '10px' }}>🎁 Use Gift Points</h3>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
              Available: {user.giftPoints} points (${(user.giftPoints * 0.01).toFixed(2)})
            </p>
            <input
              type="number"
              min="0"
              max={Math.min(user.giftPoints, Math.floor(calculateSubtotal() * 100))}
              value={giftPointsToUse}
              onChange={(e) => setGiftPointsToUse(Math.min(Number(e.target.value), user.giftPoints))}
              placeholder="Enter points to redeem"
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              1 point = $0.01 discount
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="cart-summary">
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Order Summary</h2>
            
            {cartItems.map(item => (
              <div key={item.productId} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #e9ecef'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{item.product.title}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>

            {giftPointsToUse > 0 && (
              <div className="summary-row" style={{ color: '#28a745' }}>
                <span>Gift Points Discount</span>
                <span>-${calculateDiscount().toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#28a745' }}>FREE</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="btn-success"
              style={{ width: '100%', marginTop: '20px', padding: '15px' }}
              disabled={processing || !selectedAddress || !paymentMethod}
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

// Made with Bob
