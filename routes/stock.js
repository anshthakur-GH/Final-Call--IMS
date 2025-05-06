const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// Stock management page
router.get('/', async (req, res) => {
    const [products] = await db.query('SELECT * FROM products');
    res.render('stock', { products, user: req.session.user });
});

// Adjust stock POST
router.post('/adjust/:id', async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    await db.query('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
    res.redirect('/stock');
});

// Set low stock threshold POST
router.post('/threshold/:id', async (req, res) => {
    const { id } = req.params;
    const { low_stock_threshold } = req.body;
    await db.query('UPDATE products SET low_stock_threshold = ? WHERE id = ?', [low_stock_threshold, id]);
    res.redirect('/stock');
});

module.exports = router;
