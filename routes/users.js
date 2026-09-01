const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middlewares/auth');
const mailer = require('../utils/mailer');

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Đảm bảo cột expires_at luôn tồn tại
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;`).catch(() => {});
        
        let result;
        try {
            const query = `SELECT id, username, role, full_name, email, is_verified, expires_at, department, phone, avatar, settings FROM users ORDER BY id ASC`;
            result = await pool.query(query);
        } catch (colErr) {
            const fallbackQuery = `SELECT id, username, role, full_name, email, is_verified FROM users ORDER BY id ASC`;
            result = await pool.query(fallbackQuery);
        }
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { username, password, email, role, full_name, expires_at } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let finalExpires = expires_at;
        if (!finalExpires) {
            finalExpires = role === 'Admin' ? '2099-12-31 23:59:59' : null;
        }

        let query, params;
        if (finalExpires) {
            query = `INSERT INTO users (username, password, email, role, full_name, is_verified, expires_at) VALUES ($1, $2, $3, $4, $5, true, $6) RETURNING id`;
            params = [username, hashedPassword, email, role, full_name || null, finalExpires];
        } else {
            query = `INSERT INTO users (username, password, email, role, full_name, is_verified, expires_at) VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP + INTERVAL '1 month') RETURNING id`;
            params = [username, hashedPassword, email, role, full_name || null];
        }

        await pool.query(query, params);
        res.status(201).json({ message: 'Thêm người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { email, password, role, full_name, expires_at } = req.body;
    try {
        const prevRes = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        const prevUser = prevRes.rows[0];

        let finalExpires = expires_at;
        if (role === 'Admin' && (!finalExpires || new Date(finalExpires) < new Date('2090-01-01'))) {
            finalExpires = '2099-12-31 23:59:59';
        }

        const { department_id } = req.body;
        let query, params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE users SET email = $1, role = $2, full_name = $3, password = $4, expires_at = $5, department_id = $6 WHERE id = $7`;
            params = [email, role, full_name || null, hashedPassword, finalExpires, department_id || null, req.params.id];
        } else {
            query = `UPDATE users SET email = $1, role = $2, full_name = $3, expires_at = $4, department_id = $5 WHERE id = $6`;
            params = [email, role, full_name || null, finalExpires, department_id || null, req.params.id];
        }
        await pool.query(query, params);

        // Nếu gia hạn thêm thời gian sử dụng mới, gửi email thông báo cho giảng viên
        if (prevUser && prevUser.email && finalExpires && role !== 'Admin') {
            const newDate = new Date(finalExpires);
            const prevDate = prevUser.expires_at ? new Date(prevUser.expires_at) : new Date(0);
            if (newDate > prevDate && newDate > new Date()) {
                try {
                    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
                    const host = req.headers['x-forwarded-host'] || req.get('host');
                    const loginUrl = `${protocol}://${host}/login`;
                    const d = newDate;
                    const newExpiryFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    
                    await mailer.sendMail(prevUser.email, '[Hệ thống Giáo án] Tài khoản của bạn đã được gia hạn thành công!', 'renewal-approved-user', {
                        fullName: full_name || prevUser.full_name || prevUser.username,
                        newExpiryFormatted,
                        loginUrl
                    });
                } catch (mailErr) {
                    console.error('Lỗi gửi mail thông báo gia hạn thành công:', mailErr);
                }
            }
        }

        res.json({ message: 'Cập nhật người dùng thành công' });
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


// Lấy danh sách thông báo của user (Phase 1)
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const pool = require('../config/database');
        const notifRes = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
            [req.user.id]
        );
        res.json(notifRes.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Đánh dấu đã đọc thông báo (Phase 1)
router.post('/notifications/read', authenticateToken, async (req, res) => {
    try {
        const pool = require('../config/database');
        await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
