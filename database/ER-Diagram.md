# E-Book Store Database ER Diagram

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ PK id (UUID)    │
│    email        │
│    password_hash│
│    name         │
│    gift_points  │
│    created_at   │
│    updated_at   │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    │                                     │
┌───▼──────────┐                  ┌──────▼────────┐
│  ADDRESSES   │                  │    CARTS      │
├──────────────┤                  ├───────────────┤
│ PK id        │                  │ PK id         │
│ FK user_id   │                  │ FK user_id    │
│    type      │                  │    created_at │
│    street    │                  │    updated_at │
│    city      │                  └───────┬───────┘
│    state     │                          │
│    zip_code  │                          │ 1:N
│    country   │                          │
│    is_default│                  ┌───────▼────────┐
└──────────────┘                  │  CART_ITEMS    │
                                  ├────────────────┤
┌─────────────────┐               │ PK id          │
│   CATEGORIES    │               │ FK cart_id     │
├─────────────────┤               │ FK product_id  │
│ PK id           │               │    quantity    │
│    name         │               │    added_at    │
│    description  │               └────────────────┘
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────────┐
    │             │
┌───▼──────────┐  │
│   BRANDS     │  │
├──────────────┤  │
│ PK id        │  │
│    name      │  │
│    description│ │
└──────┬───────┘  │
       │          │
       │ 1:N      │ 1:N
       │          │
    ┌──▼──────────▼───┐
    │    PRODUCTS     │
    ├─────────────────┤
    │ PK id           │
    │ FK category_id  │
    │ FK brand_id     │
    │    title        │
    │    author       │
    │    price        │
    │    description  │
    │    cover_image  │
    │    delivery_days│
    │    rating       │
    │    review_count │
    │    stock_qty    │
    │    is_active    │
    └────┬────────┬───┘
         │        │
         │ N:N    │ 1:N
         │        │
    ┌────▼────┐  │
    │ RELATED │  │
    │PRODUCTS │  │
    ├─────────┤  │
    │ product │  │
    │ related │  │
    └─────────┘  │
                 │
        ┌────────┴────────────┐
        │                     │
    ┌───▼──────────┐   ┌──────▼────────┐
    │   REVIEWS    │   │ ORDER_ITEMS   │
    ├──────────────┤   ├───────────────┤
    │ PK id        │   │ PK id         │
    │ FK product_id│   │ FK order_id   │
    │ FK user_id   │   │ FK product_id │
    │    rating    │   │    quantity   │
    │    review    │   │    price      │
    │    created_at│   └───────────────┘
    └──────────────┘           │
                               │ N:1
                               │
                       ┌───────▼────────┐
                       │    ORDERS      │
                       ├────────────────┤
                       │ PK id          │
                       │ FK user_id     │
                       │ FK address_id  │
                       │    total_amt   │
                       │    status      │
                       │    payment_mtd │
                       │    payment_sts │
                       │    gift_points │
                       │    order_date  │
                       │    shipped_date│
                       │    delivered   │
                       │    cancelled   │
                       └────────┬───────┘
                                │
                                │ 1:N
                                │
                    ┌───────────▼────────────┐
                    │ GIFT_POINTS_TRANS     │
                    ├───────────────────────┤
                    │ PK id                 │
                    │ FK user_id            │
                    │ FK order_id (nullable)│
                    │    points             │
                    │    transaction_type   │
                    │    description        │
                    │    created_at         │
                    └───────────────────────┘
```

## Relationships

### One-to-Many (1:N)
1. **Users → Addresses**: One user can have multiple addresses
2. **Users → Carts**: One user has one cart
3. **Users → Orders**: One user can place multiple orders
4. **Users → Reviews**: One user can write multiple reviews
5. **Users → Gift Points Transactions**: One user has multiple transactions
6. **Categories → Products**: One category contains multiple products
7. **Brands → Products**: One brand has multiple products
8. **Products → Reviews**: One product can have multiple reviews
9. **Products → Cart Items**: One product can be in multiple carts
10. **Products → Order Items**: One product can be in multiple orders
11. **Carts → Cart Items**: One cart contains multiple items
12. **Orders → Order Items**: One order contains multiple items
13. **Orders → Gift Points Transactions**: One order can have one transaction
14. **Addresses → Orders**: One address can be used for multiple orders

### Many-to-Many (N:N)
1. **Products ↔ Products (Related Products)**: Products can have multiple related products

## Key Constraints

### Primary Keys (PK)
- All tables use UUID as primary key for better distribution and security

### Foreign Keys (FK)
- Enforce referential integrity
- CASCADE delete for dependent records (cart_items, order_items, etc.)
- RESTRICT delete for referenced records (categories, brands)

### Unique Constraints
- users.email: Ensures unique user accounts
- categories.name: Prevents duplicate categories
- brands.name: Prevents duplicate brands
- carts.user_id: One cart per user
- cart_items(cart_id, product_id): One product per cart
- reviews(product_id, user_id): One review per user per product

### Check Constraints
- reviews.rating: Must be between 1 and 5

## Indexes

### Performance Indexes
- users.email: Fast login lookup
- products.title: Fast product search
- products.category_id: Fast category filtering
- products.brand_id: Fast brand filtering
- orders.user_id: Fast user order lookup
- orders.status: Fast status filtering
- orders.order_date: Fast date range queries

## Views

### 1. product_details
Combines products with category and brand names for easy querying

### 2. order_summary
Provides complete order information with user and address details

### 3. cart_summary
Shows cart totals and item counts per user

## Triggers

### Auto-update Timestamps
- Automatically updates `updated_at` column on record modification
- Applied to: users, addresses, products, carts, orders, reviews

## Data Types

- **UUID**: Primary keys and foreign keys
- **VARCHAR**: Text fields with length limits
- **TEXT**: Long text fields (descriptions, reviews)
- **DECIMAL(10,2)**: Monetary values (prices, amounts)
- **INTEGER**: Counts and quantities
- **BOOLEAN**: True/false flags
- **TIMESTAMP**: Date and time values

## Business Rules Enforced

1. **User Management**
   - Unique email addresses
   - Gift points tracking
   - Multiple delivery addresses

2. **Product Catalog**
   - Products must belong to a category and brand
   - Stock quantity tracking
   - Active/inactive status

3. **Shopping Cart**
   - One cart per user
   - Unique products in cart
   - Quantity management

4. **Orders**
   - Order status workflow: pending → processing → shipped → delivered
   - Cancellation tracking
   - Payment status tracking
   - Gift points redemption

5. **Reviews**
   - One review per user per product
   - Rating scale 1-5
   - Timestamp tracking

6. **Gift Points**
   - Transaction history
   - Earned, redeemed, and bonus types
   - Linked to orders when applicable