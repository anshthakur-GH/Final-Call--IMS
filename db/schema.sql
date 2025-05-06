-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    customer VARCHAR(100),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    supplier VARCHAR(100),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin user
INSERT IGNORE INTO users (username, password) VALUES ('admin', '$2b$10$5Yq8bA0n6RrZ9h6FQ8p8QeU4oA1k9lV9iP8lU6nQ9v1k2lO1cR8hK');
-- Password is 'admin123' (bcrypt hash)
