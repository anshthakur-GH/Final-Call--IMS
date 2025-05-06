const db = require('./connection');

async function testDB() {
  try {
    const [rows] = await db.query('SELECT 1 AS test');
    console.log('Database connection successful:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Database connection FAILED:', err);
    process.exit(1);
  }
}

testDB();
