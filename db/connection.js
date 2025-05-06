const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'ims_user', // Changed for new user
    password: 'ims_password', // Changed for new user
    database: 'ims_new_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
