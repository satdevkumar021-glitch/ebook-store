const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (replace with database in production)
let users = [
  {
    id: '1',
    email: 'demo@ebook.com',
    password: '$2a$10$8K1p/a0dL3LzZvZqZqZqZeX8K1p/a0dL3LzZvZqZqZqZe', // password: demo123
    name: 'Demo User',
    giftPoints: 500,
    addresses: [
      {
        id: 'addr1',
        type: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    ]
  }
];

let products = [
  {
    id: 'book1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    brand: 'Penguin Classics',
    price: 12.99,
    description: 'A classic American novel set in the Jazz Age',
    coverImage: 'https://via.placeholder.com/200x300?text=Great+Gatsby',
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book2', 'book3'],
    rating: 4.5,
    reviews: 1250
  },
  {
    id: 'book2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    brand: 'HarperCollins',
    price: 14.99,
    description: 'A gripping tale of racial injustice and childhood innocence',
    coverImage: 'https://via.placeholder.com/200x300?text=Mockingbird',
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book1', 'book4'],
    rating: 4.8,
    reviews: 2100
  },
  {
    id: 'book3',
    title: '1984',
    author: 'George Orwell',
    category: 'Science Fiction',
    brand: 'Penguin Books',
    price: 13.99,
    description: 'A dystopian social science fiction novel',
    coverImage: 'https://via.placeholder.com/200x300?text=1984',
    deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book5', 'book6'],
    rating: 4.7,
    reviews: 1800
  },
  {
    id: 'book4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    brand: 'Vintage Classics',
    price: 11.99,
    description: 'A romantic novel of manners',
    coverImage: 'https://via.placeholder.com/200x300?text=Pride+Prejudice',
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book2', 'book7'],
    rating: 4.6,
    reviews: 1500
  },
  {
    id: 'book5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    brand: 'Mariner Books',
    price: 15.99,
    description: 'A fantasy adventure novel',
    coverImage: 'https://via.placeholder.com/200x300?text=The+Hobbit',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book6', 'book8'],
    rating: 4.9,
    reviews: 3200
  },
  {
    id: 'book6',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    category: 'Science Fiction',
    brand: 'Harper Perennial',
    price: 13.49,
    description: 'A dystopian novel exploring technological advancement',
    coverImage: 'https://via.placeholder.com/200x300?text=Brave+New+World',
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book3', 'book5'],
    rating: 4.4,
    reviews: 1100
  },
  {
    id: 'book7',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    category: 'Romance',
    brand: 'Penguin Classics',
    price: 12.49,
    description: 'A classic romance novel',
    coverImage: 'https://via.placeholder.com/200x300?text=Jane+Eyre',
    deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book4', 'book2'],
    rating: 4.5,
    reviews: 1400
  },
  {
    id: 'book8',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    brand: 'Mariner Books',
    price: 25.99,
    description: 'Epic high fantasy trilogy',
    coverImage: 'https://via.placeholder.com/200x300?text=LOTR',
    deliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    relatedProducts: ['book5', 'book3'],
    rating: 5.0,
    reviews: 5000
  }
];

let orders = [
  {
    id: 'order1',
    userId: '1',
    items: [
      { productId: 'book1', quantity: 1, price: 12.99 }
    ],
    totalAmount: 12.99,
    status: 'delivered',
    orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: users[0].addresses[0]
  }
];

let carts = {};

// Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  
  if (!user || password !== 'demo123') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = 'mock-jwt-token-' + user.id;
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      giftPoints: user.giftPoints
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    email,
    password: '$2a$10$' + password,
    name,
    giftPoints: 100,
    addresses: []
  };
  
  users.push(newUser);
  const token = 'mock-jwt-token-' + newUser.id;
  
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      giftPoints: newUser.giftPoints
    }
  });
});

// Products
app.get('/api/products', (req, res) => {
  const { category, brand, search } = req.query;
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand === brand);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/products/:id/related', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const relatedProducts = products.filter(p => 
    product.relatedProducts.includes(p.id)
  );
  
  res.json(relatedProducts);
});

// Categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Brands
app.get('/api/brands', (req, res) => {
  const brands = [...new Set(products.map(p => p.brand))];
  res.json(brands);
});

// Cart
app.get('/api/cart/:userId', (req, res) => {
  const cart = carts[req.params.userId] || { items: [] };
  res.json(cart);
});

app.post('/api/cart/:userId/add', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.params.userId;
  
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }
  
  const existingItem = carts[userId].items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({ productId, quantity });
  }
  
  res.json(carts[userId]);
});

app.delete('/api/cart/:userId/remove/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  if (carts[userId]) {
    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
  }
  
  res.json(carts[userId] || { items: [] });
});

app.put('/api/cart/:userId/update', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.params.userId;
  
  if (carts[userId]) {
    const item = carts[userId].items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
  
  res.json(carts[userId] || { items: [] });
});

// Orders
app.get('/api/orders/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
  const { userId, items, totalAmount, deliveryAddress, paymentMethod, giftPointsUsed } = req.body;
  
  const newOrder = {
    id: 'order' + (orders.length + 1),
    userId,
    items,
    totalAmount,
    status: 'pending',
    orderDate: new Date().toISOString(),
    deliveryAddress,
    paymentMethod,
    giftPointsUsed: giftPointsUsed || 0
  };
  
  orders.push(newOrder);
  
  // Clear cart
  if (carts[userId]) {
    carts[userId].items = [];
  }
  
  // Update gift points
  const user = users.find(u => u.id === userId);
  if (user && giftPointsUsed) {
    user.giftPoints -= giftPointsUsed;
  }
  
  res.status(201).json(newOrder);
});

app.delete('/api/orders/:orderId', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  const order = orders[orderIndex];
  const orderDate = new Date(order.orderDate);
  const now = new Date();
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
  
  if (hoursDiff > 48) {
    return res.status(400).json({ message: 'Cannot cancel order after 48 hours' });
  }
  
  orders.splice(orderIndex, 1);
  res.json({ message: 'Order cancelled successfully' });
});

// Recommendations
app.get('/api/recommendations/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  
  if (userOrders.length === 0) {
    return res.json(products.slice(0, 4));
  }
  
  const purchasedProductIds = userOrders.flatMap(o => o.items.map(i => i.productId));
  const purchasedProducts = products.filter(p => purchasedProductIds.includes(p.id));
  
  const categories = [...new Set(purchasedProducts.map(p => p.category))];
  const recommendations = products.filter(p => 
    categories.includes(p.category) && !purchasedProductIds.includes(p.id)
  ).slice(0, 4);
  
  res.json(recommendations);
});

// User addresses
app.get('/api/users/:userId/addresses', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user.addresses);
});

app.post('/api/users/:userId/addresses', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const newAddress = {
    id: 'addr' + (user.addresses.length + 1),
    ...req.body
  };
  
  user.addresses.push(newAddress);
  res.status(201).json(newAddress);
});

// Gift points
app.get('/api/users/:userId/gift-points', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ giftPoints: user.giftPoints });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-book Store API is running' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Only start listening when run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;

// Made with Bob
