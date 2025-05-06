const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// Root route - redirect to dashboard
router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('LOGIN ATTEMPT:', { username, password });
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        console.log('DB QUERY RESULT:', rows);
        if (rows.length > 0) {
            req.session.user = { id: rows[0].id, username: rows[0].username };
            return res.redirect('/dashboard');
        }
        res.render('login', { error: 'Invalid username or password.' });
    } catch (err) {
        console.error('LOGIN DATABASE ERROR:', err);
        res.render('login', { error: 'Database error: ' + err.message });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
