const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.ip_address, a.created_at, 
                   u.username, u.full_name
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 100
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
