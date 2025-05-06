const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/connection');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'ims_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/products', require('./routes/products'));
app.use('/stock', require('./routes/stock'));
app.use('/orders', require('./routes/orders'));
app.use('/sales', require('./routes/sales'));
app.use('/purchases', require('./routes/purchases'));
app.use('/reports', require('./routes/reports'));

// 404
app.use((req, res) => {
    res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`IMS app running at http://localhost:${PORT}`);
});
