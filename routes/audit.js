const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

// Lấy danh sách audit logs có phân trang, tìm kiếm, lọc
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const search = req.query.search || '';
        const actionFilter = req.query.action || '';
        
        let queryStr = `
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;
        
        if (search) {
            queryStr += ` AND (u.username ILIKE $${paramCount} OR u.full_name ILIKE $${paramCount} OR a.details::text ILIKE $${paramCount} OR a.target_type ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }
        
        if (actionFilter) {
            queryStr += ` AND a.action = $${paramCount}`;
            params.push(actionFilter);
            paramCount++;
        }
        
        // Count total
        const countResult = await pool.query(`SELECT COUNT(*) ${queryStr}`, params);
        const total = parseInt(countResult.rows[0].count);
        
        // Get data
        const dataResult = await pool.query(`
            SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.ip_address, a.created_at, 
                   u.username, u.full_name
            ${queryStr}
            ORDER BY a.created_at DESC
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `, [...params, limit, offset]);
        
        res.json({
            data: dataResult.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xoá lịch sử (xoá theo số ngày cũ, hoặc xoá tất cả ngoại trừ N ngày gần nhất)
router.delete('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { keepDays } = req.body; // Giữ lại bao nhiêu ngày
        
        if (keepDays === undefined) {
            // Xoá hết
            await pool.query('TRUNCATE TABLE audit_logs');
            return res.json({ message: 'Đã xoá toàn bộ lịch sử hoạt động' });
        } else {
            const days = parseInt(keepDays);
            if (isNaN(days) || days < 0) return res.status(400).json({ error: 'Số ngày không hợp lệ' });
            
            const result = await pool.query(`
                DELETE FROM audit_logs 
                WHERE created_at < NOW() - INTERVAL '${days} days'
            `);
            return res.json({ message: `Đã xoá ${result.rowCount} bản ghi cũ hơn ${days} ngày` });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
