const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'ims_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Define routes
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Export the serverless function
module.exports.handler = serverless(app);
