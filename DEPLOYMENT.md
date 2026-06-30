# E-Book Store Deployment Guide

Complete guide for deploying the E-Book Store application to various environments.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [PostgreSQL Database Setup](#postgresql-database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)

---

## Local Development Setup

### Prerequisites
- Node.js v14+ and npm
- PostgreSQL 12+
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd ebook-store
```

### Step 2: Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### Step 3: Setup Database
```bash
# Create PostgreSQL database
createdb ebookstore

# Run schema
psql ebookstore < database/schema.sql

# Seed data
psql ebookstore < database/seed.sql
```

### Step 4: Configure Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

### Step 5: Run Application
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd client
npm start
```

Access application at: http://localhost:3000

---

## PostgreSQL Database Setup

### Installation

#### Windows
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Database Creation
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ebookstore;

# Create user
CREATE USER ebookuser WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ebookstore TO ebookuser;

# Exit
\q
```

### Run Migrations
```bash
# Apply schema
psql -U ebookuser -d ebookstore -f database/schema.sql

# Seed data
psql -U ebookuser -d ebookstore -f database/seed.sql
```

### Verify Setup
```bash
psql -U ebookuser -d ebookstore

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

---

## Environment Configuration

### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ebookstore
DB_USER=ebookuser
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Payment Gateway (Mock for development)
PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
PAYMENT_API_KEY=your_payment_api_key
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Environment
REACT_APP_ENV=development
```

---

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ebookstore
      POSTGRES_USER: ebookuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql
    ports:
      - "5432:5432"
    networks:
      - ebook-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ebookstore
      DB_USER: ebookuser
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    networks:
      - ebook-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - ebook-network

volumes:
  postgres_data:

networks:
  ebook-network:
    driver: bridge
```

### Deploy with Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## Cloud Deployment

### AWS Deployment

#### Prerequisites
- AWS Account
- AWS CLI configured
- Docker installed

#### Deploy to AWS ECS

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name ebook-backend
aws ecr create-repository --repository-name ebook-frontend
```

2. **Build and Push Images**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t ebook-backend .
docker tag ebook-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ebook-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ebook-backend:latest

# Build and push frontend
cd client
docker build -t ebook-frontend .
docker tag ebook-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ebook-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ebook-frontend:latest
```

3. **Create RDS PostgreSQL Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier ebook-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username ebookuser \
  --master-user-password <password> \
  --allocated-storage 20
```

4. **Deploy to ECS**
- Create ECS cluster
- Create task definitions
- Create services
- Configure load balancer

### IBM Cloud (ROKS) Deployment

#### Prerequisites
- IBM Cloud account
- IBM Cloud CLI
- kubectl configured

#### Deploy to ROKS

1. **Create Kubernetes Cluster**
```bash
ibmcloud ks cluster create classic --name ebook-cluster
```

2. **Create Kubernetes Manifests**

**backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ebook-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ebook-backend
  template:
    metadata:
      labels:
        app: ebook-backend
    spec:
      containers:
      - name: backend
        image: <registry>/ebook-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
---
apiVersion: v1
kind: Service
metadata:
  name: ebook-backend-service
spec:
  selector:
    app: ebook-backend
  ports:
  - port: 5000
    targetPort: 5000
  type: LoadBalancer
```

3. **Deploy to Cluster**
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create ebook-store-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run psql $DATABASE_URL < database/schema.sql
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**
```yaml
name: Deploy E-Book Store

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: ebookstore_test
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        npm ci
        cd client && npm ci
    
    - name: Run backend tests
      run: npm test
      env:
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: ebookstore_test
        DB_USER: testuser
        DB_PASSWORD: testpass
    
    - name: Run frontend tests
      run: cd client && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker images
      run: |
        docker build -t ebook-backend .
        docker build -t ebook-frontend ./client
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push ebook-backend
        docker push ebook-frontend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        # Add deployment commands here
        echo "Deploying to production..."
```

---

## Monitoring and Logging

### Application Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start server.js --name ebook-backend

# Monitor
pm2 monit

# View logs
pm2 logs
```

### Database Monitoring
```sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('ebookstore'));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Backup and Recovery

### Database Backup
```bash
# Backup database
pg_dump -U ebookuser ebookstore > backup_$(date +%Y%m%d).sql

# Restore database
psql -U ebookuser ebookstore < backup_20260623.sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U ebookuser ebookstore | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

---

## Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] JWT tokens secured
- [ ] Regular security updates
- [ ] Backup strategy in place

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U ebookuser -d ebookstore -h localhost
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Build Errors**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
npm install
```

---

## Performance Optimization

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || author));

-- Analyze tables
ANALYZE products;
ANALYZE orders;

-- Vacuum database
VACUUM ANALYZE;
```

### Application Optimization
- Enable gzip compression
- Implement caching (Redis)
- Use CDN for static assets
- Optimize images
- Minify CSS/JS
- Enable HTTP/2

---

## Support

For deployment issues:
- Check logs: `pm2 logs` or `docker-compose logs`
- Review environment variables
- Verify database connectivity
- Check firewall rules
- Review application logs

---

**Deployment Checklist Complete! 🚀**