# E-Book Store - Complete Online Bookstore Application

A full-featured e-commerce platform for browsing, selecting, and purchasing e-books with a comprehensive customer journey from login to order confirmation.

## 🚀 Features

### Customer Journey Implementation

#### 1. **E-store Home**
- User authentication (Login/Register)
- Personalized welcome page
- Category browsing
- Gift points display
- Quick access to order history

#### 2. **Catalogue & Product Selection**
- Browse books by category
- Filter by brand/publisher
- Search functionality
- Product details with:
  - Tentative delivery date
  - Ratings and reviews
  - Related products
  - Category and brand tags

#### 3. **Shopping Experience**
- Add products to basket/cart
- Quantity management
- View related products
- Real-time cart updates
- Cart summary with totals

#### 4. **Order History**
- View all past orders
- "Buy Again" feature for quick reordering
- Order status tracking
- Cancel orders within 48 hours
- Detailed order information

#### 5. **Recommendations**
- Personalized recommendations based on order history
- Category-based suggestions
- Related products on product pages

#### 6. **Payment & Purchase**
- Multiple payment options:
  - Credit/Debit Card
  - PayPal
  - UPI (Google Pay, PhonePe, Paytm)
  - Cash on Delivery
- Address selection/management
- Gift points redemption (1 point = $0.01)
- Order summary before confirmation

#### 7. **Purchase Confirmation**
- Order confirmation page
- Order details display
- Email confirmation notification
- Quick links to continue shopping

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- RESTful API architecture
- In-memory data storage (easily replaceable with database)
- CORS enabled for cross-origin requests

### Frontend
- **React** 18.x
- **React Router** for navigation
- Modern CSS with responsive design
- Component-based architecture

## 📁 Project Structure

```
ebook-store/
├── server.js                 # Backend API server
├── package.json             # Backend dependencies
├── client/                  # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js           # Navigation header
│   │   │   ├── Login.js            # Authentication
│   │   │   ├── Home.js             # Home page
│   │   │   ├── ProductCatalogue.js # Browse products
│   │   │   ├── ProductDetail.js    # Product details
│   │   │   ├── Cart.js             # Shopping cart
│   │   │   ├── Checkout.js         # Checkout process
│   │   │   ├── OrderHistory.js     # Order history
│   │   │   └── OrderConfirmation.js # Order confirmation
│   │   ├── App.js           # Main app component
│   │   ├── App.css          # Application styles
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # Frontend dependencies
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd ebook-store
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

### Running the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend Server:**
```bash
npm start
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm start
```
Frontend runs on: http://localhost:3000

#### Option 2: Production Build

1. Build the frontend:
```bash
cd client
npm run build
cd ..
```

2. Serve the built frontend with the backend:
```bash
npm start
```

## 🔐 Demo Credentials

**Email:** demo@ebook.com  
**Password:** demo123

**Demo User Features:**
- 500 gift points available
- Pre-configured delivery address
- Sample order history

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/related` - Get related products
- `GET /api/categories` - Get all categories
- `GET /api/brands` - Get all brands

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update` - Update cart item quantity
- `DELETE /api/cart/:userId/remove/:productId` - Remove item from cart

### Orders
- `GET /api/orders/:userId` - Get user's orders
- `POST /api/orders` - Create new order
- `DELETE /api/orders/:orderId` - Cancel order (within 48 hours)

### User
- `GET /api/users/:userId/addresses` - Get user addresses
- `POST /api/users/:userId/addresses` - Add new address
- `GET /api/users/:userId/gift-points` - Get gift points balance

### Recommendations
- `GET /api/recommendations/:userId` - Get personalized recommendations

## ✨ Key Features Explained

### 1. User Authentication
- Secure login/registration system
- Session management with JWT tokens
- Protected routes requiring authentication

### 2. Product Catalogue
- Filter by category and brand
- Search by title or author
- Display delivery dates
- Show ratings and reviews

### 3. Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart across sessions

### 4. Order Management
- Complete order history
- "Buy Again" feature for quick reordering
- Order cancellation within 48 hours
- Status tracking (pending, delivered)

### 5. Checkout Process
- Multiple delivery addresses
- Address management (add new addresses)
- Multiple payment options
- Gift points redemption
- Order summary before confirmation

### 6. Gift Points System
- Earn points on purchases
- Redeem points for discounts
- 1 point = $0.01 discount
- Real-time balance updates

### 7. Recommendations
- Based on order history
- Category-based suggestions
- Related products on detail pages

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean and intuitive design
- **Real-time Updates**: Instant feedback on actions
- **Loading States**: Clear loading indicators
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation messages for actions

## 🔄 Customer Journey Flow

```
Login → Home → Browse Catalogue → Product Details → Add to Cart 
→ View Cart → Checkout → Select Address → Choose Payment 
→ Apply Gift Points → Place Order → Order Confirmation 
→ Order History → Buy Again
```

## 📝 Sample Data

The application comes with pre-loaded sample data:
- 8 books across multiple categories (Fiction, Science Fiction, Romance, Fantasy)
- Multiple publishers/brands
- Sample user with order history
- Pre-configured addresses

## 🚀 Deployment

### Backend Deployment
1. Set environment variables:
   - `PORT` - Server port (default: 5000)
   - `NODE_ENV` - Environment (production/development)

2. Deploy to platforms like:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway

### Frontend Deployment
1. Build the production version:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

## 🔧 Configuration

### Backend Configuration
Edit `server.js` to:
- Change port number
- Add database connection
- Modify CORS settings
- Add authentication middleware

### Frontend Configuration
Edit `client/package.json` to:
- Change proxy settings
- Update API endpoints
- Modify build settings

## 📦 Dependencies

### Backend
- express: Web framework
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- uuid: Unique ID generation

### Frontend
- react: UI library
- react-dom: React DOM rendering
- react-router-dom: Routing
- axios: HTTP client (optional)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in server.js or kill the process using the port

2. **CORS errors**
   - Ensure the proxy is set correctly in client/package.json
   - Check CORS configuration in server.js

3. **Module not found**
   - Run `npm install` in both root and client directories

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Add more features
- Improve the UI/UX
- Add database integration
- Implement real payment processing
- Add email notifications
- Enhance security features

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Author

Created as a demonstration of a complete e-commerce application with full customer journey implementation.

## 🎯 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real payment gateway integration
- Email notifications
- Order tracking with shipping updates
- Product reviews and ratings system
- Wishlist feature
- Advanced search with filters
- Admin dashboard
- Inventory management
- Analytics and reporting
- Social media integration
- Multi-language support

## 📞 Support

For issues or questions, please refer to the documentation or create an issue in the project repository.

---

**Happy Shopping! 📚🛒**

## License, contributions and security

Original material is available under the [MIT License](LICENSE). Preserve the copyright and license notice when reusing it. Third-party material retains its own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

### Important demo security limitation

This is an educational prototype. Despite earlier descriptions above, the current server uses mock token strings and demonstration password handling, not verified JWT authentication or real password hashing. User-ID API routes are not protected by verified authentication. Do not use it for real customer data or payments.
