const express = require('express');
const router = express.Router();
const { sendMail } = require('../utils/mailer');
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');
const auditLog = require('../middlewares/audit');

const isManager = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

// Gửi duyệt giáo án (Dành cho User)
router.post('/submit', authenticateToken, auditLog('SUBMIT_LESSON', req => ({ targetType: 'lesson', targetId: req.body.project_id, details: { tt: req.body.schedule_tt } })), async (req, res) => {
    try {
        const { project_id, schedule_tt } = req.body;
        
        // Cập nhật trạng thái
        const { pdf_link } = req.body;
        const updateRes = await pool.query(`
            UPDATE lessons 
            SET status = 'PENDING', updated_at = CURRENT_TIMESTAMP, pdf_link = $3
            WHERE project_id = $1 AND schedule_tt = $2
            RETURNING id
        `, [project_id, schedule_tt, pdf_link || null]);
        
        if (updateRes.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy giáo án' });
        
        // Fetch author's department_id
        const userRes = await pool.query('SELECT department_id FROM users WHERE id = $1', [req.user.id]);
        const authorDept = userRes.rows[0]?.department_id;
        
        if (authorDept) {
            // Gửi thông báo cho Manager cùng Khoa
            await pool.query(`
                INSERT INTO notifications (user_id, type, message, link)
                SELECT u.id, 'info', $1, '/approvals'
                FROM users u
                WHERE u.role = 'Manager' AND u.department_id = $2
            `, [`Giáo viên ${req.user.username} vừa gửi giáo án chờ duyệt.`, authorDept]);
            
            // Gửi email cho Manager
            try {
                const managerRes = await pool.query(
                    `SELECT email FROM users WHERE role = 'Manager' AND department_id = $1 AND email IS NOT NULL`, 
                    [authorDept]
                );
                // Nếu Admin duyệt tất cả, có thể admin không nằm trong khoa này, 
                // nhưng thông báo submit chỉ báo cho Manager khoa đó.
                if (managerRes.rows.length > 0) {
                    const emails = managerRes.rows.map(r => r.email).filter(Boolean);
                    const projRes = await pool.query('SELECT name FROM projects WHERE id = $1', [project_id]);
                    const projectName = projRes.rows[0]?.name || 'Không xác định';

                    const templateData = {
                        authorName: req.user.full_name || req.user.username,
                        lessonName: projectName,
                        scheduleTt: schedule_tt,
                        submitTime: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                        systemUrl: req.headers.origin || (req.protocol + '://' + req.get('host'))
                    };

                    for (let email of emails) {
                        sendMail(email, 'Thông báo: Có giáo án mới cần duyệt', 'lesson_submitted', templateData).catch(console.error);
                    }
                }
            } catch (err) {
                console.error('Error sending submit email:', err);
            }
        }
        
        res.json({ message: 'Đã gửi duyệt thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách giáo án chờ duyệt
router.get('/pending', authenticateToken, isManager, async (req, res) => {
    try {
        let query = `
            SELECT l.id as lesson_id, l.project_id, l.schedule_tt, l.status, l.reviewer_comment, l.updated_at, l.pdf_link,
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
router.post('/:id/review', authenticateToken, isManager, auditLog('REVIEW_LESSON', req => ({ targetType: 'lesson', targetId: req.params.id, details: { status: req.body.status } })), async (req, res) => {
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
            'INSERT INTO notifications (user_id, message, type, link) VALUES ($1, $2, $3, $4)',
            [lessonInfo.user_id, msg, status === 'APPROVED' ? 'success' : 'error', `/app?id=${lessonInfo.project_id}&tt=${lessonInfo.schedule_tt}`]
        );
        
        // Gửi email cho User
        try {
            const authorRes = await pool.query('SELECT email, full_name, username FROM users WHERE id = $1', [lessonInfo.user_id]);
            const authorEmail = authorRes.rows[0]?.email;
            
            if (authorEmail) {
                const templateData = {
                    authorName: authorRes.rows[0].full_name || authorRes.rows[0].username,
                    projectName: lessonInfo.project_name,
                    scheduleTt: lessonInfo.schedule_tt,
                    status: status,
                    comment: comment || '',
                    projectId: lessonInfo.project_id,
                    systemUrl: req.headers.origin || (req.protocol + '://' + req.get('host'))
                };
                
                sendMail(authorEmail, 'Thông báo: Trạng thái giáo án của bạn', 'lesson_reviewed', templateData).catch(console.error);
            }
        } catch (err) {
            console.error('Error sending review email:', err);
        }

        res.json({ message: 'Đã xử lý giáo án thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
