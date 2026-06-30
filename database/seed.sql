-- E-Book Store Sample Data
-- Seed data for testing and demonstration

-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Fiction', 'Literary fiction and novels'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Science Fiction', 'Science fiction and futuristic novels'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Romance', 'Romantic novels and love stories'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Fantasy', 'Fantasy and magical realism');

-- Insert Brands
INSERT INTO brands (id, name, description) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Penguin Classics', 'Classic literature publisher'),
    ('660e8400-e29b-41d4-a716-446655440002', 'HarperCollins', 'Major publishing house'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Penguin Books', 'General fiction publisher'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Vintage Classics', 'Classic and contemporary fiction'),
    ('660e8400-e29b-41d4-a716-446655440005', 'Mariner Books', 'Literary fiction and non-fiction'),
    ('660e8400-e29b-41d4-a716-446655440006', 'Harper Perennial', 'Contemporary literature');

-- Insert Products
INSERT INTO products (id, title, author, category_id, brand_id, price, description, cover_image_url, delivery_days, rating, review_count) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'The Great Gatsby', 'F. Scott Fitzgerald', 
     '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
     12.99, 'A classic American novel set in the Jazz Age', 
     'https://via.placeholder.com/200x300?text=Great+Gatsby', 3, 4.5, 1250),
    
    ('770e8400-e29b-41d4-a716-446655440002', 'To Kill a Mockingbird', 'Harper Lee',
     '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002',
     14.99, 'A gripping tale of racial injustice and childhood innocence',
     'https://via.placeholder.com/200x300?text=Mockingbird', 2, 4.8, 2100),
    
    ('770e8400-e29b-41d4-a716-446655440003', '1984', 'George Orwell',
     '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003',
     13.99, 'A dystopian social science fiction novel',
     'https://via.placeholder.com/200x300?text=1984', 4, 4.7, 1800),
    
    ('770e8400-e29b-41d4-a716-446655440004', 'Pride and Prejudice', 'Jane Austen',
     '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004',
     11.99, 'A romantic novel of manners',
     'https://via.placeholder.com/200x300?text=Pride+Prejudice', 3, 4.6, 1500),
    
    ('770e8400-e29b-41d4-a716-446655440005', 'The Hobbit', 'J.R.R. Tolkien',
     '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005',
     15.99, 'A fantasy adventure novel',
     'https://via.placeholder.com/200x300?text=The+Hobbit', 5, 4.9, 3200),
    
    ('770e8400-e29b-41d4-a716-446655440006', 'Brave New World', 'Aldous Huxley',
     '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006',
     13.49, 'A dystopian novel exploring technological advancement',
     'https://via.placeholder.com/200x300?text=Brave+New+World', 3, 4.4, 1100),
    
    ('770e8400-e29b-41d4-a716-446655440007', 'Jane Eyre', 'Charlotte Brontë',
     '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001',
     12.49, 'A classic romance novel',
     'https://via.placeholder.com/200x300?text=Jane+Eyre', 4, 4.5, 1400),
    
    ('770e8400-e29b-41d4-a716-446655440008', 'The Lord of the Rings', 'J.R.R. Tolkien',
     '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005',
     25.99, 'Epic high fantasy trilogy',
     'https://via.placeholder.com/200x300?text=LOTR', 6, 5.0, 5000);

-- Insert Related Products
INSERT INTO related_products (product_id, related_product_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003'),
    ('770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004'),
    ('770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440005'),
    ('770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440006'),
    ('770e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440007'),
    ('770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440006'),
    ('770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440008'),
    ('770e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003'),
    ('770e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440005'),
    ('770e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004'),
    ('770e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440005'),
    ('770e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003');

-- Insert Demo User (password: demo123, hashed with bcrypt)
INSERT INTO users (id, email, password_hash, name, gift_points) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'demo@ebook.com', 
     '$2a$10$8K1p/a0dL3LzZvZqZqZqZeX8K1p/a0dL3LzZvZqZqZqZe', 
     'Demo User', 500);

-- Insert Demo User Address
INSERT INTO addresses (id, user_id, type, street, city, state, zip_code, country, is_default) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001',
     'Home', '123 Main St', 'New York', 'NY', '10001', 'USA', TRUE);

-- Insert Demo Cart
INSERT INTO carts (id, user_id) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001');

-- Insert Demo Order
INSERT INTO orders (id, user_id, total_amount, status, payment_method, payment_status, gift_points_used, delivery_address_id, order_date) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001',
     12.99, 'delivered', 'credit-card', 'completed', 0, '990e8400-e29b-41d4-a716-446655440001',
     CURRENT_TIMESTAMP - INTERVAL '30 days');

-- Insert Demo Order Item
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 1, 12.99);

-- Insert Sample Reviews
INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 
     5, 'Absolutely loved this classic! A must-read for everyone.');

-- Insert Gift Points Transaction
INSERT INTO gift_points_transactions (user_id, order_id, points, transaction_type, description) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', NULL, 500, 'bonus', 'Welcome bonus points');

-- Made with Bob
