const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS so the frontend can communicate with the backend
app.use(cors());
app.use(express.json());

// Configure Database Connection
const db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,      // Replace with your MySQL username
    password: process.env.DBPASSWORD,  // Replace with your MySQL password
    database: process.env.DBNAME
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// API Endpoint to fetch users (Business Logic & Query)
app.get('/api/users', (req, res) => {
    const sqlQuery = 'SELECT id, name, email FROM users';

    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Application layer running on http://localhost:${PORT}`);
});