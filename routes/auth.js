const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

// POST login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple hardcoded user for demo
    if (username === 'admin' && password === 'admin123') {
        req.session.loggedIn = true;
        return res.redirect('/dashboard');
    }
    res.render('login', { error: 'Invalid username or password.' });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
