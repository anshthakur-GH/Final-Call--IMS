const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// Orders page (manual sales entry)
router.get('/', async (req, res) => {
    const [products] = await db.query('SELECT * FROM products');
    res.render('orders', { products, user: req.session.user, error: null });
});

// Place order POST
router.post('/', async (req, res) => {
    const { product_id, quantity, customer } = req.body;
    try {
        // Get product price
        const [[product]] = await db.query('SELECT price, stock FROM products WHERE id = ?', [product_id]);
        if (!product || product.stock < quantity) {
            const [products] = await db.query('SELECT * FROM products');
            return res.render('orders', { products, user: req.session.user, error: 'Insufficient stock.' });
        }
        const total_amount = product.price * quantity;
        // Insert into sales
        await db.query('INSERT INTO sales (product_id, quantity, customer, total_amount) VALUES (?, ?, ?, ?)', [product_id, quantity, customer, total_amount]);
        // Deduct stock
        await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
        res.redirect('/dashboard');
    } catch (err) {
        const [products] = await db.query('SELECT * FROM products');
        res.render('orders', { products, user: req.session.user, error: 'Error placing order.' });
    }
});

module.exports = router;
