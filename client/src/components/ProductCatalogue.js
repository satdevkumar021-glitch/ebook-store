import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function ProductCatalogue({ user }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      search: ''
    });
  };

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      <h1 className="page-title">Browse Books</h1>

      <div className="card">
        <div className="filters">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or author..."
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand</label>
            <select name="brand" value={filters.brand} onChange={handleFilterChange}>
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>&nbsp;</label>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>No books found</h2>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Showing {products.length} book{products.length !== 1 ? 's' : ''}
          </p>
          <div className="grid">
            {products.map(product => (
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
                    <div style={{ marginTop: '10px' }}>
                      <span className="product-category">{product.category}</span>
                      <span className="product-category">{product.brand}</span>
                    </div>
                    <div className="rating">
                      ⭐ {product.rating} ({product.reviews} reviews)
                    </div>
                    <div className="delivery-date">
                      📦 Delivery by {formatDeliveryDate(product.deliveryDate)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductCatalogue;

// Made with Bob
