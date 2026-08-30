const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middlewares/auth');

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `SELECT id, username, role, full_name, email, is_verified FROM users ORDER BY id DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { username, password, email, role, full_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, password, email, role, full_name, is_verified) VALUES ($1, $2, $3, $4, $5, true) RETURNING id`;
        await pool.query(query, [username, hashedPassword, email, role, full_name || null]);
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { email, password, role, full_name } = req.body;
    try {
        let query, params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE users SET email = $1, role = $2, full_name = $3, password = $4 WHERE id = $5`;
            params = [email, role, full_name || null, hashedPassword, req.params.id];
        } else {
            query = `UPDATE users SET email = $1, role = $2, full_name = $3 WHERE id = $4`;
            params = [email, role, full_name || null, req.params.id];
        }
        await pool.query(query, params);
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
