import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [recsResponse, catsResponse] = await Promise.all([
        fetch(`/api/recommendations/${user.id}`),
        fetch('/api/categories')
      ]);

      const recsData = await recsResponse.json();
      const catsData = await catsResponse.json();

      setRecommendations(recsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Welcome to E-Book Store, {user.name}! 📚</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          Discover your next favorite book from our extensive collection
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/catalogue">
            <button className="btn-primary">Browse All Books</button>
          </Link>
          <Link to="/orders">
            <button className="btn-secondary">View Order History</button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Browse by Category</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Link 
              key={category} 
              to={`/catalogue?category=${category}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="product-category" style={{ 
                padding: '10px 20px', 
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                {category}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Recommended for You</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Based on your order history
          </p>
          <div className="grid">
            {recommendations.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-card">
                  <img 
                    src={product.coverImage} 
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-author">by {product.author}</p>
                    <div className="product-price">${product.price}</div>
                    <span className="product-category">{product.category}</span>
                    <div className="rating">
                      ⭐ {product.rating} ({product.reviews} reviews)
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>🎁 Your Gift Points</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
          {user.giftPoints} Points
        </p>
        <p style={{ color: '#666' }}>
          Use your gift points to get discounts on your next purchase!
        </p>
      </div>
    </div>
  );
}

export default Home;

// Made with Bob
