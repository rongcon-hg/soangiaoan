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
        const result = await pool.query(`
            SELECT l.id as lesson_id, l.project_id, l.schedule_tt, l.status, l.reviewer_comment, l.updated_at,
                   p.name as project_name, u.full_name as author_name, u.username
            FROM lessons l
            JOIN projects p ON l.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE l.status = 'PENDING'
            ORDER BY l.updated_at DESC
        `);
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
