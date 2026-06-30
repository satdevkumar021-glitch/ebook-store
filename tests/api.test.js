/**
 * E-Book Store API Test Cases
 * Test suite for all API endpoints
 * 
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../server');

describe('E-Book Store API Tests', () => {
  
  let authToken;
  let userId;
  let testOrderId;

  // ==================== Authentication Tests ====================
  
  describe('POST /api/auth/login', () => {
    test('Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@ebook.com',
          password: 'demo123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('demo@ebook.com');
      
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('Should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@ebook.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('Should fail login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@ebook.com'
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/register', () => {
    test('Should register new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@ebook.com`,
          password: 'test123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('Should fail registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'demo@ebook.com',
          password: 'test123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });

  // ==================== Product Tests ====================
  
  describe('GET /api/products', () => {
    test('Should get all products', async () => {
      const response = await request(app)
        .get('/api/products');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('Should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Fiction');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.category).toBe('Fiction');
      });
    });

    test('Should filter products by brand', async () => {
      const response = await request(app)
        .get('/api/products?brand=Penguin Classics');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.brand).toBe('Penguin Classics');
      });
    });

    test('Should search products by title', async () => {
      const response = await request(app)
        .get('/api/products?search=Gatsby');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    test('Should get product by ID', async () => {
      const response = await request(app)
        .get('/api/products/book1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('price');
    });

    test('Should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/products/:id/related', () => {
    test('Should get related products', async () => {
      const response = await request(app)
        .get('/api/products/book1/related');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/categories', () => {
    test('Should get all categories', async () => {
      const response = await request(app)
        .get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContain('Fiction');
    });
  });

  describe('GET /api/brands', () => {
    test('Should get all brands', async () => {
      const response = await request(app)
        .get('/api/brands');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ==================== Cart Tests ====================
  
  describe('Cart Operations', () => {
    test('GET /api/cart/:userId - Should get user cart', async () => {
      const response = await request(app)
        .get(`/api/cart/${userId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    test('POST /api/cart/:userId/add - Should add item to cart', async () => {
      const response = await request(app)
        .post(`/api/cart/${userId}/add`)
        .send({
          productId: 'book1',
          quantity: 2
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    test('PUT /api/cart/:userId/update - Should update cart item quantity', async () => {
      const response = await request(app)
        .put(`/api/cart/${userId}/update`)
        .send({
          productId: 'book1',
          quantity: 3
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
    });

    test('DELETE /api/cart/:userId/remove/:productId - Should remove item from cart', async () => {
      const response = await request(app)
        .delete(`/api/cart/${userId}/remove/book1`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
    });
  });

  // ==================== Order Tests ====================
  
  describe('Order Operations', () => {
    beforeAll(async () => {
      // Add item to cart for order test
      await request(app)
        .post(`/api/cart/${userId}/add`)
        .send({
          productId: 'book2',
          quantity: 1
        });
    });

    test('POST /api/orders - Should create new order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          userId: userId,
          items: [
            { productId: 'book2', quantity: 1, price: 14.99 }
          ],
          totalAmount: 14.99,
          deliveryAddress: {
            id: 'addr1',
            type: 'Home',
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA'
          },
          paymentMethod: 'credit-card',
          giftPointsUsed: 0
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('pending');
      
      testOrderId = response.body.id;
    });

    test('GET /api/orders/:userId - Should get user orders', async () => {
      const response = await request(app)
        .get(`/api/orders/${userId}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('DELETE /api/orders/:orderId - Should cancel order within 48 hours', async () => {
      const response = await request(app)
        .delete(`/api/orders/${testOrderId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('DELETE /api/orders/:orderId - Should fail to cancel non-existent order', async () => {
      const response = await request(app)
        .delete('/api/orders/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });

  // ==================== User Tests ====================
  
  describe('User Operations', () => {
    test('GET /api/users/:userId/addresses - Should get user addresses', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}/addresses`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/users/:userId/addresses - Should add new address', async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/addresses`)
        .send({
          type: 'Work',
          street: '456 Work Ave',
          city: 'Work City',
          state: 'WC',
          zipCode: '54321',
          country: 'USA'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('Work');
    });

    test('GET /api/users/:userId/gift-points - Should get gift points balance', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}/gift-points`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('giftPoints');
      expect(typeof response.body.giftPoints).toBe('number');
    });
  });

  // ==================== Recommendation Tests ====================
  
  describe('GET /api/recommendations/:userId', () => {
    test('Should get personalized recommendations', async () => {
      const response = await request(app)
        .get(`/api/recommendations/${userId}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ==================== Health Check Tests ====================
  
  describe('GET /api/health', () => {
    test('Should return API health status', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
    });
  });

  // ==================== Error Handling Tests ====================
  
  describe('Error Handling', () => {
    test('Should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
    });

    test('Should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });

  // ==================== Integration Tests ====================
  
  describe('Complete User Journey', () => {
    test('Should complete full shopping flow', async () => {
      // 1. Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@ebook.com',
          password: 'demo123'
        });
      expect(loginResponse.status).toBe(200);
      const testUserId = loginResponse.body.user.id;

      // 2. Browse products
      const productsResponse = await request(app)
        .get('/api/products');
      expect(productsResponse.status).toBe(200);
      expect(productsResponse.body.length).toBeGreaterThan(0);

      // 3. Add to cart
      const addToCartResponse = await request(app)
        .post(`/api/cart/${testUserId}/add`)
        .send({
          productId: productsResponse.body[0].id,
          quantity: 1
        });
      expect(addToCartResponse.status).toBe(200);

      // 4. Get cart
      const cartResponse = await request(app)
        .get(`/api/cart/${testUserId}`);
      expect(cartResponse.status).toBe(200);
      expect(cartResponse.body.items.length).toBeGreaterThan(0);

      // 5. Place order
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          userId: testUserId,
          items: cartResponse.body.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 12.99
          })),
          totalAmount: 12.99,
          deliveryAddress: {
            type: 'Home',
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA'
          },
          paymentMethod: 'credit-card',
          giftPointsUsed: 0
        });
      expect(orderResponse.status).toBe(201);

      // 6. Get order history
      const ordersResponse = await request(app)
        .get(`/api/orders/${testUserId}`);
      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.length).toBeGreaterThan(0);
    });
  });
});

// Test Statistics
afterAll(() => {
  console.log('\n=================================');
  console.log('Test Suite Completed');
  console.log('=================================\n');
});

// Made with Bob
