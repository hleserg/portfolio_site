const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// API endpoint to get Telegram bot API key
app.get('/api/get-telegram-key', (req, res) => {
  const query = 'SELECT VALUE FROM env WHERE NAME = ?';
  db.query(query, ['TELEGRAM_BOT_API'], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    const apiKey = results[0].VALUE;
    console.log('Telegram API key retrieved successfully');
    res.json({ apiKey });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
