# E-Book Store - Complete Step-by-Step Setup Guide

Follow these steps exactly to set up and run your e-book store application.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Windows 11 (you have this ✓)
- [ ] Node.js installed (v14 or higher)
- [ ] PostgreSQL installed (v12 or higher)
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] A web browser (Chrome/Edge recommended)

---

## STEP 1: Install Node.js (if not installed)

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

### If not installed:
1. Go to https://nodejs.org/
2. Download "LTS" version (recommended)
3. Run installer
4. Click "Next" through all steps
5. Restart your computer
6. Verify installation:
```powershell
node --version
npm --version
```

---

## STEP 2: Install PostgreSQL (if not installed)

### Check if PostgreSQL is installed:
```powershell
psql --version
```

### If not installed:
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer
3. Run installer
4. **IMPORTANT**: Remember the password you set for 'postgres' user
5. Keep default port: 5432
6. Install all components
7. Add PostgreSQL to PATH (installer should do this)
8. Restart your computer

### Verify PostgreSQL is running:
```powershell
# Open Services (Win + R, type: services.msc)
# Look for "postgresql-x64-14" (or similar)
# Status should be "Running"
```

---

## STEP 3: Navigate to Your Project

```powershell
# Open PowerShell
# Navigate to your project
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store"

# Verify you're in the right place
dir
# You should see: package.json, server.js, client folder, database folder
```

---

## STEP 4: Install Backend Dependencies

```powershell
# Make sure you're in ebook-store directory
npm install
```

**Expected output**: Installing packages... (this may take 2-3 minutes)

**If you see errors**:
- Try: `npm cache clean --force`
- Then: `npm install` again

---

## STEP 5: Install Frontend Dependencies

```powershell
# Navigate to client folder
cd client

# Install dependencies
npm install
```

**Expected output**: Installing packages... (this may take 3-5 minutes)

**If you see errors**:
- Try: `npm cache clean --force`
- Then: `npm install` again

```powershell
# Go back to main directory
cd ..
```

---

## STEP 6: Setup PostgreSQL Database

### Option A: Using pgAdmin (GUI - Easier)

1. **Open pgAdmin** (search in Windows Start menu)
2. **Enter master password** (the one you set during installation)
3. **Connect to PostgreSQL**:
   - Expand "Servers" → "PostgreSQL 14" (or your version)
   - Enter password if prompted

4. **Create Database**:
   - Right-click "Databases"
   - Select "Create" → "Database"
   - Name: `ebookstore`
   - Owner: `postgres`
   - Click "Save"

5. **Run Schema**:
   - Click on `ebookstore` database
   - Click "Tools" → "Query Tool"
   - Click "Open File" icon
   - Navigate to: `C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store\database\schema.sql`
   - Click "Execute" (▶ button)
   - **Expected**: "Query returned successfully"

6. **Run Seed Data**:
   - In same Query Tool
   - Click "Open File" icon
   - Navigate to: `C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store\database\seed.sql`
   - Click "Execute" (▶ button)
   - **Expected**: "Query returned successfully"

7. **Verify Data**:
   - In Query Tool, run:
   ```sql
   SELECT COUNT(*) FROM products;
   SELECT COUNT(*) FROM users;
   ```
   - **Expected**: 8 products,  1 user

### Option B: Using Command Line (psql)

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE ebookstore;"

# Run schema
psql -U postgres -d ebookstore -f database\schema.sql

# Run seed data
psql -U postgres -d ebookstore -f database\seed.sql

# Verify
psql -U postgres -d ebookstore -c "SELECT COUNT(*) FROM products;"
psql -U postgres -d ebookstore -c "SELECT COUNT(*) FROM users;"
```

**If you get "psql is not recognized"**:
- Add PostgreSQL to PATH:
  - Search "Environment Variables" in Windows
  - Edit "Path" variable
  - Add: `C:\Program Files\PostgreSQL\14\bin` (adjust version number)
  - Restart PowerShell

---

## STEP 7: Configure Environment Variables (Optional for now)

The application will work with default settings, but for production:

```powershell
# Create .env file in ebook-store directory
notepad .env
```

Add this content:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ebookstore
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

Save and close.

---

## STEP 8: Start the Backend Server

```powershell
# Make sure you're in ebook-store directory
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store"

# Start backend
npm start
```

**Expected output**:
```
Server is running on port 5000
API available at http://localhost:5000/api
```

**Keep this terminal window open!**

**If you see "Port 5000 is already in use"**:
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Try starting again
npm start
```

---

## STEP 9: Start the Frontend (New Terminal)

**Open a NEW PowerShell window** (don't close the backend one!)

```powershell
# Navigate to project
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store\client"

# Start frontend
npm start
```

**Expected output**:
```
Compiled successfully!
You can now view ebook-store-client in the browser.
Local: http://localhost:3000
```

**Your browser should automatically open to http://localhost:3000**

**If browser doesn't open automatically**:
- Manually open browser
- Go to: http://localhost:3000

---

## STEP 10: Test the Application

### 10.1 Login
1. You should see a **Login page**
2. Use these credentials:
   - **Email**: `demo@ebook.com`
   - **Password**: `demo123`
3. Click **Login**
4. You should see the **Home page** with "Welcome to E-Book Store, Demo User!"

### 10.2 Browse Products
1. Click **"Browse Books"** or **"Browse All Books"**
2. You should see **8 books** displayed
3. Try filtering:
   - Select **Category**: Fiction
   - Select **Brand**: Penguin Classics
   - Try **Search**: Type "Gatsby"

### 10.3 View Product Details
1. Click on any book (e.g., "The Great Gatsby")
2. You should see:
   - Book details
   - Price
   - Delivery date
   - Related products
   - "Add to Cart" button

### 10.4 Add to Cart
1. On product page, select **Quantity**: 2
2. Click **"Add to Cart"**
3. You should see: "Added to cart successfully!"
4. Look at header - cart icon should show **(1)** or **(2)**

### 10.5 View Cart
1. Click **cart icon (🛒)** in header
2. You should see your items
3. Try:
   - Click **+** to increase quantity
   - Click **-** to decrease quantity
   - Click **Remove** to remove item
4. Add item back if you removed it

### 10.6 Checkout
1. In cart, click **"Proceed to Checkout"**
2. You should see:
   - Delivery address (123 Main St, New York)
   - Payment methods (4 options)
   - Gift points section
   - Order summary

3. **Select payment method**: Click on "Credit/Debit Card"
4. **Optional**: Enter gift points (you have 500)
5. Click **"Place Order"**

### 10.7 Order Confirmation
1. You should see: ✅ "Order Placed Successfully!"
2. Note your **Order ID**
3. See order details

### 10.8 Order History
1. Click **"My Orders"** in header
2. You should see your order
3. Try **"Buy Again"** button
4. Try **"Cancel Order"** button (only works within 48 hours)

### 10.9 Logout
1. Click **"Logout"** button in header
2. You should return to login page

---

## STEP 11: Verify Everything Works

### Checklist:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with demo@ebook.com / demo123
- [ ] Can see 8 books in catalog
- [ ] Can filter by category and brand
- [ ] Can search for books
- [ ] Can view product details
- [ ] Can add items to cart
- [ ] Can update cart quantities
- [ ] Can proceed to checkout
- [ ] Can select payment method
- [ ] Can place order
- [ ] Can view order history
- [ ] Can use "Buy Again" feature
- [ ] Can logout

---

## STEP 12: Stop the Application

When you're done testing:

### Stop Frontend:
1. Go to frontend terminal
2. Press **Ctrl + C**
3. Type **Y** and press Enter

### Stop Backend:
1. Go to backend terminal
2. Press **Ctrl + C**
3. Type **Y** and press Enter

---

## STEP 13: Restart Application (Later)

When you want to run it again:

### Terminal 1 - Backend:
```powershell
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store"
npm start
```

### Terminal 2 - Frontend:
```powershell
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store\client"
npm start
```

---

## STEP 14: Create GitHub Repository

### 14.1 Initialize Git (if not already done)
```powershell
cd "C:\Users\SatdevKumar\Desktop\IBM BOB PROJECTS\ebook-store"
git init
git add .
git commit -m "Initial commit: E-book Store application"
```

### 14.2 Create GitHub Repository
1. Go to https://github.com
2. Click **"New repository"** (green button)
3. Repository name: `ebook-store`
4. Description: "Full-stack e-commerce platform for books"
5. Choose **Public** or **Private**
6. **Don't** initialize with README (we already have one)
7. Click **"Create repository"**

### 14.3 Push to GitHub
```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ebook-store.git

# Push code
git branch -M main
git push -u origin main
```

### 14.4 Share with Manager
1. Go to your repository on GitHub
2. Click **"Settings"** → **"Collaborators"**
3. Click **"Add people"**
4. Enter your manager's GitHub username
5. Send them the repository link

---

## STEP 15: Record Video Demonstration

Follow the **VIDEO_GUIDE.md** file for detailed instructions on recording your demo video.

### Quick Video Recording Steps:

1. **Prepare**:
   - Start backend and frontend
   - Open browser to http://localhost:3000
   - Open VS Code with project
   - Close unnecessary applications
   - Increase font size for visibility

2. **Record** (use OBS Studio, Loom, or Windows Game Bar):
   - **Win + G** to open Game Bar
   - Click record button
   - Follow VIDEO_GUIDE.md sections

3. **Show**:
   - Project structure in VS Code
   - Database schema
   - Backend API code
   - Frontend components
   - Complete user journey (login → browse → cart → checkout → order)
   - Test cases
   - Documentation

4. **Duration**: 10-15 minutes

5. **Upload**:
   - YouTube (unlisted)
   - Google Drive
   - Share link with manager

---

## STEP 16: Submit to Manager

### Submission Checklist:
- [ ] GitHub repository created
- [ ] Manager added as collaborator
- [ ] Repository link shared
- [ ] Video recorded and uploaded
- [ ] Video link shared
- [ ] Email sent with:
  - GitHub repository link
  - Video demonstration link
  - Brief description of project
  - Login credentials (demo@ebook.com / demo123)
  - Any deployment links (if deployed)

### Email Template:
```
Subject: E-Book Store Application - Project Submission

Dear [Manager Name],

I have completed the E-Book Store application project. Here are the details:

GitHub Repository: [Your GitHub Link]
Video Demonstration: [Your Video Link]

Project Highlights:
- Full-stack application (React + Node.js + PostgreSQL)
- 12 use cases fully implemented
- Complete test suite (API + React components)
- OpenAPI specification
- Deployment ready with Docker
- Comprehensive documentation

Demo Credentials:
Email: demo@ebook.com
Password: demo123

Technologies Used:
- Frontend: React 18, React Router
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Testing: Jest
- Documentation: OpenAPI 3.0

All requirements have been met including:
✓ PostgreSQL database with complete schema
✓ OpenAPI specification
✓ Test cases for API and React components
✓ Deployment configuration
✓ Video documentation

Please let me know if you need any clarification or additional information.

Best regards,
[Your Name]
```

---

## 🆘 Troubleshooting

### Problem: "npm is not recognized"
**Solution**: 
- Reinstall Node.js
- Make sure to check "Add to PATH" during installation
- Restart computer

### Problem: "psql is not recognized"
**Solution**:
- Add PostgreSQL to PATH
- Path should be: `C:\Program Files\PostgreSQL\14\bin`
- Restart PowerShell

### Problem: "Port 5000 already in use"
**Solution**:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to database"
**Solution**:
- Check PostgreSQL service is running
- Verify database name: `ebookstore`
- Check username/password
- Try: `psql -U postgres -d ebookstore`

### Problem: "Module not found"
**Solution**:
```powershell
# Delete node_modules
rm -r node_modules
# Reinstall
npm install
```

### Problem: Frontend won't start
**Solution**:
```powershell
cd client
rm -r node_modules
npm install
npm start
```

### Problem: Can't login
**Solution**:
- Verify database has seed data
- Check: `psql -U postgres -d ebookstore -c "SELECT * FROM users;"`
- If no users, run seed.sql again

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the error message** carefully
2. **Google the error** - most errors have solutions online
3. **Check documentation**:
   - README.md
   - DEPLOYMENT.md
   - ARCHITECTURE.md
4. **Verify all steps** were followed correctly
5. **Restart everything**:
   - Close all terminals
   - Restart PostgreSQL service
   - Start fresh from STEP 8

---

## ✅ Success Criteria

You've successfully completed the project when:

- [x] Application runs without errors
- [x] All 12 use cases work correctly
- [x] Database is properly set up
- [x] Tests can be run
- [x] Code is on GitHub
- [x] Video is recorded
- [x] Manager has access
- [x] Submission email sent

---

## 🎉 Congratulations!

You've successfully set up and deployed a complete e-commerce application!

**Next Steps**:
- Deploy to cloud (AWS/IBM Cloud) - see DEPLOYMENT.md
- Add more features
- Improve UI/UX
- Add real payment integration
- Scale the application

---

**Good luck with your presentation! 🚀**