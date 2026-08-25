const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

exports.register = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
        
        const result = await pool.query(query, [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') { // UNIQUE constraint violation code in pg
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, gemini_api_key: user.gemini_api_key } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApiKey = async (req, res) => {
    const { apiKey } = req.body;
    const userId = req.user.id;

    try {
        const query = `UPDATE users SET gemini_api_key = $1 WHERE id = $2`;
        await pool.query(query, [apiKey, userId]);
        res.json({ message: 'API key updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const query = `SELECT id, username, role, gemini_api_key FROM users WHERE id = $1`;
        const result = await pool.query(query, [req.user.id]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
