const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
const fs = require('fs');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// Reports page
router.get('/', (req, res) => {
    res.render('reports', { user: req.session.user, report: null, error: null });
});

// Generate report POST
router.post('/', async (req, res) => {
    const { type, start_date, end_date } = req.body;
    let query = '';
    let params = [];
    try {
        if (type === 'stock') {
            query = 'SELECT * FROM products';
        } else if (type === 'sales') {
            query = 'SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id WHERE s.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        } else if (type === 'purchases') {
            query = 'SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE pu.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        } else {
            return res.render('reports', { user: req.session.user, report: null, error: 'Invalid report type.' });
        }
        const [rows] = await db.query(query, params);
        res.render('reports', { user: req.session.user, report: { type, rows, start_date, end_date }, error: null });
    } catch (err) {
        res.render('reports', { user: req.session.user, report: null, error: 'Error generating report.' });
    }
});

// Export as CSV
router.post('/export/csv', async (req, res) => {
    const { type, start_date, end_date } = req.body;
    let query = '';
    let params = [];
    let filename = `report_${type}_${Date.now()}.csv`;
    try {
        if (type === 'stock') {
            query = 'SELECT * FROM products';
        } else if (type === 'sales') {
            query = 'SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id WHERE s.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        } else if (type === 'purchases') {
            query = 'SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE pu.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        }
        const [rows] = await db.query(query, params);
        const csvWriter = createCsvWriter({
            path: `./public/${filename}`,
            header: Object.keys(rows[0] || {}).map(key => ({id: key, title: key}))
        });
        await csvWriter.writeRecords(rows);
        res.download(`./public/${filename}`);
    } catch (err) {
        res.status(500).send('Error exporting CSV');
    }
});

// Export as PDF
router.post('/export/pdf', async (req, res) => {
    const { type, start_date, end_date } = req.body;
    let query = '';
    let params = [];
    let filename = `report_${type}_${Date.now()}.pdf`;
    try {
        if (type === 'stock') {
            query = 'SELECT * FROM products';
        } else if (type === 'sales') {
            query = 'SELECT s.*, p.name AS product_name FROM sales s JOIN products p ON s.product_id = p.id WHERE s.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        } else if (type === 'purchases') {
            query = 'SELECT pu.*, p.name AS product_name FROM purchases pu JOIN products p ON pu.product_id = p.id WHERE pu.date BETWEEN ? AND ?';
            params = [start_date, end_date];
        }
        const [rows] = await db.query(query, params);
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        doc.pipe(res);
        doc.fontSize(18).text(`${type.toUpperCase()} REPORT`, {align: 'center'});
        doc.moveDown();
        if (rows.length) {
            const keys = Object.keys(rows[0]);
            doc.fontSize(12).text(keys.join(' | '));
            doc.moveDown(0.5);
            rows.forEach(row => {
                doc.text(keys.map(k => row[k]).join(' | '));
            });
        } else {
            doc.text('No data available');
        }
        doc.end();
    } catch (err) {
        res.status(500).send('Error exporting PDF');
    }
});

module.exports = router;
