const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');

const isManager = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

// Lấy danh sách giáo án chờ duyệt
router.get('/pending', authenticateToken, isManager, async (req, res) => {
    try {
        let query = `
            SELECT l.id as lesson_id, l.project_id, l.schedule_tt, l.status, l.reviewer_comment, l.updated_at,
                   p.name as project_name, u.full_name as author_name, u.username, d.name as department_name
            FROM lessons l
            JOIN projects p ON l.project_id = p.id
            JOIN users u ON p.user_id = u.id
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE l.status = 'PENDING'
        `;
        const params = [];
        
        // Nếu là Manager, chỉ xem giáo án của khoa mình
        if (req.user.role === 'Manager') {
            const userRes = await pool.query('SELECT department_id FROM users WHERE id = $1', [req.user.id]);
            const deptId = userRes.rows[0]?.department_id;
            if (deptId) {
                query += ` AND u.department_id = $1`;
                params.push(deptId);
            } else {
                // Manager mà chưa có khoa thì ko xem được gì
                query += ` AND 1 = 0`; 
            }
        }
        
        query += ` ORDER BY l.updated_at DESC`;
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Duyệt / Từ chối
router.post('/:id/review', authenticateToken, isManager, async (req, res) => {
    try {
        const { status, comment } = req.body;
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Status không hợp lệ' });
        }

        const lessonId = req.params.id;
        
        // Lấy thông tin bài học để gửi thông báo
        const lessonRes = await pool.query(`
            SELECT l.project_id, l.schedule_tt, p.name as project_name, p.user_id 
            FROM lessons l 
            JOIN projects p ON l.project_id = p.id 
            WHERE l.id = $1
        `, [lessonId]);

        if (lessonRes.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy giáo án' });
        const lessonInfo = lessonRes.rows[0];

        await pool.query(
            'UPDATE lessons SET status = $1, reviewer_comment = $2 WHERE id = $3',
            [status, comment, lessonId]
        );

        // Tạo thông báo cho User
        const msg = status === 'APPROVED' 
            ? `Giáo án bài ${lessonInfo.schedule_tt} môn ${lessonInfo.project_name} đã được PHÊ DUYỆT.` 
            : `Giáo án bài ${lessonInfo.schedule_tt} môn ${lessonInfo.project_name} BỊ TỪ CHỐI với lý do: ${comment}`;
        
        await pool.query(
            'INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)',
            [lessonInfo.user_id, msg, status === 'APPROVED' ? 'success' : 'error']
        );

        res.json({ message: 'Đã xử lý giáo án thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
