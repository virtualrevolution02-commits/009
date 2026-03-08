require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname))); // Serve static files correctly from root directory

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// API endpoint to get earrings from PostgreSQL DB
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error fetching products from Neon database' });
    }
});

app.listen(port, () => {
    console.log(`Node Server is running and serving on http://localhost:${port}`);
});
