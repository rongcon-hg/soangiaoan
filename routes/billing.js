const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

// Middleware xác thực
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'admin' && !req.user.is_admin) {
        return res.status(403).json({ error: 'Forbidden. Admin only.' });
    }
    next();
};

// Lấy cấu hình giá & ngân hàng
router.get('/settings', async (req, res) => {
    try {
        const result = await pool.query("SELECT value FROM system_settings WHERE key = 'billing_config'");
        if (result.rows.length > 0) {
            res.json(result.rows[0].value);
        } else {
            res.json({
                bank_bin: '970436', // VCB default
                bank_account: '',
                bank_name: '',
                packages: [
                    { id: '90d', name: 'Gói 90 Ngày (3 Tháng)', days: 90, price: 49000, desc: 'Thử nghiệm ngắn hạn' },
                    { id: '180d', name: 'Gói 180 Ngày (6 Tháng)', days: 180, price: 99000, desc: 'Gói 1 học kỳ' },
                    { id: '365d', name: 'Gói 365 Ngày (1 Năm)', days: 365, price: 199000, desc: 'Gói trọn vẹn 1 năm học' },
                    { id: 'lifetime', name: 'Gói Vĩnh Viễn (Lifetime)', days: 99999, price: 699000, desc: 'Trọn đời, cập nhật miễn phí' }
                ]
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin lưu cấu hình
router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const config = req.body;
        await pool.query(
            "INSERT INTO system_settings (key, value) VALUES ('billing_config', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [config]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User tạo yêu cầu gia hạn
router.post('/request', authenticateToken, async (req, res) => {
    try {
        const { package_name, package_days, amount } = req.body;
        // Generate random transfer code GH + 6 digits
        const transfer_code = 'GH' + Math.floor(100000 + Math.random() * 900000);
        
        await pool.query(
            "INSERT INTO upgrade_requests (user_id, package_name, package_days, amount, transfer_code) VALUES ($1, $2, $3, $4, $5)",
            [req.user.id, package_name, package_days, amount, transfer_code]
        );
        res.json({ success: true, transfer_code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin lấy danh sách yêu cầu
router.get('/requests', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, u.username, u.full_name, u.email 
            FROM upgrade_requests r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin duyệt / từ chối
router.put('/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status, reason } = req.body; // 'APPROVED' or 'REJECTED'
        
        const reqResult = await pool.query("SELECT * FROM upgrade_requests WHERE id = $1", [requestId]);
        if (reqResult.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
        const request = reqResult.rows[0];
        
        if (request.status !== 'PENDING') {
            return res.status(400).json({ error: 'Request already processed' });
        }
        
        await pool.query("UPDATE upgrade_requests SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3", [status, reason || null, requestId]);
        
        if (status === 'APPROVED') {
            // Cấp ngày sử dụng
            // Lấy user hiện tại
            const userResult = await pool.query("SELECT expires_at FROM users WHERE id = $1", [request.user_id]);
            const user = userResult.rows[0];
            
            let currentExpires = user.expires_at ? new Date(user.expires_at) : new Date();
            if (currentExpires < new Date()) currentExpires = new Date();
            
            if (request.package_days >= 99999) {
                // Lifetime
                await pool.query("UPDATE users SET expires_at = '2099-12-31 23:59:59' WHERE id = $1", [request.user_id]);
            } else {
                currentExpires.setDate(currentExpires.getDate() + request.package_days);
                await pool.query("UPDATE users SET expires_at = $1 WHERE id = $2", [currentExpires, request.user_id]);
            }
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin xoá yêu cầu (nếu cần)
router.delete('/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM upgrade_requests WHERE id = $1", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
