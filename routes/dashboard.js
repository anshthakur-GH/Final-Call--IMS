const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        // Get total products
        const [[{ total_products }]] = await db.query('SELECT COUNT(*) AS total_products FROM products');
        // Get low stock count
        const [[{ low_stock_count }]] = await db.query('SELECT COUNT(*) AS low_stock_count FROM products WHERE stock <= low_stock_threshold');
        // Recent sales
        const [recent_sales] = await db.query('SELECT s.id, p.name, s.quantity, s.date FROM sales s JOIN products p ON s.product_id = p.id ORDER BY s.date DESC LIMIT 5');
        // Recent purchases
        const [recent_purchases] = await db.query('SELECT pu.id, p.name, pu.quantity, pu.date FROM purchases pu JOIN products p ON pu.product_id = p.id ORDER BY pu.date DESC LIMIT 5');
        // Stock trend data (for Chart.js)
        const [stock_trend] = await db.query('SELECT name, stock FROM products ORDER BY id');
        // Format dates as strings for EJS
        recent_sales.forEach(sale => {
            sale.date = new Date(sale.date).toLocaleString();
        });
        recent_purchases.forEach(pur => {
            pur.date = new Date(pur.date).toLocaleString();
        });
        res.render('dashboard', {
            user: req.session.user,
            total_products,
            low_stock_count,
            recent_sales,
            recent_purchases,
            stock_trend
        });
    } catch (err) {
        res.render('dashboard', { total_products, low_stock_count, recent_sales, recent_purchases, user: null });
    }
});

module.exports = router;
