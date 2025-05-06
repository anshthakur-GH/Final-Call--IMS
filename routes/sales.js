const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// Sales & Purchases page with tabs
router.get('/', async (req, res) => {
    const [sales] = await db.query('SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.date DESC');
    const [purchases] = await db.query('SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.date DESC');
    res.render('sales_purchases', { sales, purchases, user: req.session.user, tab: 'sales', error: null });
});

// Add sale POST
router.post('/add-sale', async (req, res) => {
    const { product_id, quantity, customer } = req.body;
    try {
        const [[product]] = await db.query('SELECT price, stock FROM products WHERE id = ?', [product_id]);
        if (!product || product.stock < quantity) {
            const [sales] = await db.query('SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.date DESC');
            const [purchases] = await db.query('SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.date DESC');
            return res.render('sales_purchases', { sales, purchases, user: req.session.user, tab: 'sales', error: 'Insufficient stock.' });
        }
        const total_amount = product.price * quantity;
        await db.query('INSERT INTO sales (product_id, quantity, customer, total_amount) VALUES (?, ?, ?, ?)', [product_id, quantity, customer, total_amount]);
        await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
        res.redirect('/sales');
    } catch (err) {
        const [sales] = await db.query('SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.date DESC');
        const [purchases] = await db.query('SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.date DESC');
        res.render('sales_purchases', { sales, purchases, user: req.session.user, tab: 'sales', error: 'Error adding sale.' });
    }
});

// Add purchase POST
router.post('/add-purchase', async (req, res) => {
    const { product_id, quantity, supplier } = req.body;
    try {
        const [[product]] = await db.query('SELECT price FROM products WHERE id = ?', [product_id]);
        if (!product) throw new Error('Product not found');
        const total_amount = product.price * quantity;
        await db.query('INSERT INTO purchases (product_id, quantity, supplier, total_amount) VALUES (?, ?, ?, ?)', [product_id, quantity, supplier, total_amount]);
        await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, product_id]);
        res.redirect('/sales?tab=purchases');
    } catch (err) {
        const [sales] = await db.query('SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.date DESC');
        const [purchases] = await db.query('SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.date DESC');
        res.render('sales_purchases', { sales, purchases, user: req.session.user, tab: 'purchases', error: 'Error adding purchase.' });
    }
});

module.exports = router;
