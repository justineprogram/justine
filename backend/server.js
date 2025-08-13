const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database
const db = new sqlite3.Database('./database/customers.db');

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    latitude REAL,
    longitude REAL
  )
`);

// Add customer
app.post('/api/customers', (req, res) => {
  const { name, contact, latitude, longitude } = req.body;
  db.run(`INSERT INTO customers (name, contact, latitude, longitude) VALUES (?, ?, ?, ?)`,
    [name, contact, latitude, longitude],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Get all customers
app.get('/api/customers', (req, res) => {
  db.all(`SELECT * FROM customers`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
