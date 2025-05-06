const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

// Purchases page (redirect to /sales with purchases tab)
router.get('/', (req, res) => {
    res.redirect('/sales?tab=purchases');
});

module.exports = router;
