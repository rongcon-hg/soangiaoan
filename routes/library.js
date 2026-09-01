const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');

// Lấy danh sách giáo án cộng đồng
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT l.id as lesson_id, l.project_id, l.schedule_tt, l.updated_at, l.pdf_link,
                   p.name as project_name, p.system_type,
                   u.full_name as author_name, u.username, d.name as department_name
            FROM lessons l
            JOIN projects p ON l.project_id = p.id
            JOIN users u ON p.user_id = u.id
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE l.is_public = true
            ORDER BY l.updated_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bật/tắt chế độ chia sẻ
router.post('/toggle', authenticateToken, async (req, res) => {
    try {
        const { project_id, schedule_tt, is_public } = req.body;
        
        // Kiểm tra quyền (chỉ tác giả mới được chia sẻ)
        const projRes = await pool.query('SELECT user_id FROM projects WHERE id = $1', [project_id]);
        if (projRes.rows.length === 0 || projRes.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
        }

        // Fetch current status if is_public is not explicitly provided
        let targetPublic = is_public;
        if (targetPublic === undefined) {
            const currentRes = await pool.query('SELECT is_public FROM lessons WHERE project_id = $1 AND schedule_tt = $2', [project_id, schedule_tt]);
            if (currentRes.rows.length === 0) return res.status(404).json({ message: 'Chưa có dữ liệu giáo án để chia sẻ' });
            targetPublic = !currentRes.rows[0].is_public;
        }

        let updateQuery = 'UPDATE lessons SET is_public = $1 WHERE project_id = $2 AND schedule_tt = $3 RETURNING *';
        let queryParams = [targetPublic, project_id, schedule_tt];
        
        if (req.body.pdf_link) {
            updateQuery = 'UPDATE lessons SET is_public = $1, pdf_link = $4 WHERE project_id = $2 AND schedule_tt = $3 RETURNING *';
            queryParams.push(req.body.pdf_link);
        }

        const result = await pool.query(updateQuery, queryParams);
        
        const newStatus = result.rows[0].is_public;
        res.json({ 
            is_public: newStatus,
            message: newStatus ? 'Đã chia sẻ lên Thư viện' : 'Đã gỡ khỏi Thư viện' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Nhân bản giáo án
router.post('/clone/:lesson_id', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Lấy thông tin bài học gốc
        const lRes = await client.query('SELECT * FROM lessons WHERE id = $1 AND is_public = true', [req.params.lesson_id]);
        if (lRes.rows.length === 0) throw new Error('Không tìm thấy giáo án hoặc giáo án không được chia sẻ');
        const lesson = lRes.rows[0];

        // 2. Lấy thông tin môn học gốc
        const pRes = await client.query('SELECT * FROM projects WHERE id = $1', [lesson.project_id]);
        const project = pRes.rows[0];

        // 3. Lấy thông tin khung chương trình gốc (để nhân bản đúng bài đó)
        const sRes = await client.query('SELECT * FROM schedules WHERE project_id = $1', [project.id]);
        let originalSchedule = [];
        if (sRes.rows.length > 0 && sRes.rows[0].schedule_data) {
            try {
                originalSchedule = JSON.parse(sRes.rows[0].schedule_data);
            } catch(e) {}
        }
        const originalRow = originalSchedule.find(s => parseInt(s.tt) === lesson.schedule_tt);

        // 4. Tạo Project mới cho người dùng hiện tại
        const newProjRes = await client.query(
            'INSERT INTO projects (user_id, name, course_code, total_hours, system_type, class_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [req.user.id, `(Bản sao) ${project.name}`, project.course_code, project.total_hours, project.system_type, project.class_name]
        );
        const newProjId = newProjRes.rows[0].id;

        // 5. Tạo Schedule mới (chỉ chứa 1 bài đó)
        let newScheduleData = '[]';
        if (originalRow) {
            originalRow.tt = 1; // Reset số thứ tự về 1
            newScheduleData = JSON.stringify([originalRow]);
        }
        await client.query(
            'INSERT INTO schedules (project_id, schedule_data) VALUES ($1, $2)',
            [newProjId, newScheduleData]
        );

        // 6. Copy bài giáo án sang Project mới
        await client.query(
            'INSERT INTO lessons (project_id, schedule_tt, lesson_data, status, is_public) VALUES ($1, $2, $3, $4, false)',
            [newProjId, 1, lesson.lesson_data, 'DRAFT']
        );

        await client.query('COMMIT');
        res.json({ message: 'Đã lưu bản sao vào môn học mới!', new_project_id: newProjId });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
