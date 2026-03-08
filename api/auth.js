const { Pool } = require('pg');

// We intentionally connect outside the handler so the connection can be cached across warm invocations
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action } = req.query;
    const { fullName, email, password } = req.body;

    try {
        if (action === 'register') {
            if (!fullName || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if user exists
            const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: 'An account with this email already exists' });
            }

            // Note: In a production app, the password MUST be hashed with bcrypt. 
            // For this implementation, we store it plainly for simplicity and speed.
            const result = await pool.query(
                'INSERT INTO users (fullName, email, password) VALUES ($1, $2, $3) RETURNING id, fullName, email',
                [fullName, email, password]
            );

            const user = result.rows[0];
            return res.status(201).json({ message: 'User registered successfully', user });

        } else if (action === 'login') {
            if (!email || !password) {
                return res.status(400).json({ error: 'Missing email or password' });
            }

            // Find user and compare plain text password
            const result = await pool.query('SELECT id, fullName, email, password FROM users WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Remove password before sending to client
            delete user.password;
            return res.status(200).json({ message: 'Login successful', user });

        } else {
            return res.status(400).json({ error: 'Invalid auth action' });
        }

    } catch (err) {
        console.error('Auth API Error:', err);
        return res.status(500).json({ error: 'Internal Server Error processing authentication' });
    }
};
