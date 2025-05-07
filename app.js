const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/connection');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'ims_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Auth routes
app.use(require('./routes/auth'));

// Authentication middleware
app.use((req, res, next) => {
    if (
        req.session.loggedIn ||
        req.path === '/login' ||
        req.path === '/logout'
    ) {
        return next();
    }
    res.redirect('/login');
});

// Redirect root to login or dashboard
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});
app.use('/dashboard', require('./routes/dashboard'));
app.use('/products', require('./routes/products'));
app.use('/stock', require('./routes/stock'));
app.use('/orders', require('./routes/orders'));
app.use('/reports', require('./routes/reports'));

// 404
app.use((req, res) => {
    res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`IMS app running at http://localhost:${PORT}`);
});
