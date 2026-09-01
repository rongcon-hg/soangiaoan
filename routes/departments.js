const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

// Public route để lấy danh sách khoa/đơn vị lúc đăng ký
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin thêm mới
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên đơn vị không được trống' });
        
        const result = await pool.query(
            'INSERT INTO departments (name) VALUES ($1) RETURNING *',
            [name.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ message: 'Tên đơn vị đã tồn tại' });
        res.status(500).json({ error: err.message });
    }
});

// Admin sửa
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên đơn vị không được trống' });

        const result = await pool.query(
            'UPDATE departments SET name = $1 WHERE id = $2 RETURNING *',
            [name.trim(), req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn vị' });
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ message: 'Tên đơn vị đã tồn tại' });
        res.status(500).json({ error: err.message });
    }
});

// Admin xóa
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn vị' });
        res.json({ message: 'Đã xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
