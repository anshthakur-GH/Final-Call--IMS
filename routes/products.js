const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// List all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        const categories = [...new Set(products.map(p => p.category))];
        res.render('products', { products, categories, user: req.session.user, q: '', cat: '' });
    } catch (err) {
        res.render('products', { products: [], categories: [], user: req.session.user, q: '', cat: '', error: 'Error loading products.' });
    }
});

// Add product form
router.get('/add', (req, res) => {
    res.render('product_form', { product: {}, action: '/products/add', user: req.session.user });
});

// Add product POST
router.post('/add', async (req, res) => {
    const { name, category, price, stock, low_stock_threshold } = req.body;
    try {
        await db.query('INSERT INTO products (name, category, price, stock, low_stock_threshold) VALUES (?, ?, ?, ?, ?)', [name, category, price, stock, low_stock_threshold]);
        res.redirect('/products');
    } catch (err) {
        res.render('product_form', { product: req.body, action: '/products/add', user: req.session.user, error: 'Error adding product.' });
    }
});

// Edit product form
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const [[product]] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.render('product_form', { product, action: `/products/edit/${id}`, user: req.session.user });
});

// Edit product POST
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, price, stock, low_stock_threshold } = req.body;
    try {
        await db.query('UPDATE products SET name=?, category=?, price=?, stock=?, low_stock_threshold=? WHERE id=?', [name, category, price, stock, low_stock_threshold, id]);
        res.redirect('/products');
    } catch (err) {
        res.render('product_form', { product: req.body, action: `/products/edit/${id}`, user: req.session.user, error: 'Error updating product.' });
    }
});

// Delete product
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/products');
});

// Search/filter
router.get('/search', async (req, res) => {
    const { q, cat } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (q) {
        sql += ' AND name LIKE ?';
        params.push(`%${q}%`);
    }
    if (cat) {
        sql += ' AND category = ?';
        params.push(cat);
    }
    const [products] = await db.query(sql, params);
    const [all] = await db.query('SELECT DISTINCT category FROM products');
    const categories = all.map(r => r.category);
    res.render('products', { products, categories, user: req.session.user, q, cat });
});

module.exports = router;
