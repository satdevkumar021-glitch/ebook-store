import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ProductDetail({ user, updateCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProduct();
    loadRelatedProducts();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products/${id}/related`);
      const data = await response.json();
      setRelatedProducts(data);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch(`/api/cart/${user.id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        }),
      });

      const data = await response.json();
      updateCart(data);
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Error adding to cart');
    }
  };

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <Link to="/catalogue">
            <button className="btn-primary">Back to Catalogue</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginBottom: '40px' }}>
        <div>
          <img 
            src={product.coverImage} 
            alt={product.title}
            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          />
        </div>

        <div className="card">
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{product.title}</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            by {product.author}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <span className="product-category">{product.category}</span>
            <span className="product-category">{product.brand}</span>
          </div>

          <div className="rating" style={{ fontSize: '16px', marginBottom: '20px' }}>
            ⭐ {product.rating} ({product.reviews} reviews)
          </div>

          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>
            ${product.price}
          </div>

          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px', color: '#555' }}>
            {product.description}
          </p>

          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <strong style={{ color: '#28a745' }}>📦 Delivery Information</strong>
            <p style={{ marginTop: '5px', color: '#555' }}>
              Expected delivery by <strong>{formatDeliveryDate(product.deliveryDate)}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ fontWeight: '500' }}>Quantity:</label>
            <select 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '80px' }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={addToCart} className="btn-primary" style={{ flex: 1 }}>
              🛒 Add to Cart
            </button>
            <Link to="/cart" style={{ flex: 1 }}>
              <button className="btn-success" style={{ width: '100%' }}>
                Go to Cart
              </button>
            </Link>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Related Products</h2>
          <div className="grid">
            {relatedProducts.map(relatedProduct => (
              <Link 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-card">
                  <img 
                    src={relatedProduct.coverImage} 
                    alt={relatedProduct.title}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-title">{relatedProduct.title}</h3>
                    <p className="product-author">by {relatedProduct.author}</p>
                    <div className="product-price">${relatedProduct.price}</div>
                    <span className="product-category">{relatedProduct.category}</span>
                    <div className="rating">
                      ⭐ {relatedProduct.rating} ({relatedProduct.reviews} reviews)
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;

// Made with Bob
