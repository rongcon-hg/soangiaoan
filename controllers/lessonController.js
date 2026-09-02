const pool = require('../config/database');

// --- Sổ đầu bài (Schedules) ---

exports.getScheduleByProjectId = async (req, res) => {
    const projectId = req.params.projectId;
    
    try {
        const query = `SELECT * FROM schedules WHERE project_id = $1`;
        const result = await pool.query(query, [projectId]);
        const row = result.rows[0];

        if (!row) return res.json(null);
        
        try { row.schedule_data = typeof row.schedule_data === 'string' ? JSON.parse(row.schedule_data) : row.schedule_data; } catch(e) { }
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveSchedule = async (req, res) => {
    const projectId = req.params.projectId;
    const { schedule_data } = req.body;
    
    const scheduleStr = JSON.stringify(schedule_data);
    
    try {
        const checkQuery = `SELECT id FROM schedules WHERE project_id = $1`;
        const result = await pool.query(checkQuery, [projectId]);
        const row = result.rows[0];

        if (row) {
            // Update
            const updateQuery = `UPDATE schedules SET schedule_data = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2`;
            await pool.query(updateQuery, [scheduleStr, projectId]);
            res.json({ message: 'Schedule updated successfully' });
        } else {
            // Insert
            const insertQuery = `INSERT INTO schedules (project_id, schedule_data) VALUES ($1, $2)`;
            await pool.query(insertQuery, [projectId, scheduleStr]);
            res.status(201).json({ message: 'Schedule saved successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- Giáo án (Lessons) ---

exports.getLessonByTT = async (req, res) => {
    const projectId = req.params.projectId;
    const scheduleTT = req.params.tt;
    
    try {
        const query = `SELECT * FROM lessons WHERE project_id = $1 AND schedule_tt = $2`;
        const result = await pool.query(query, [projectId, scheduleTT]);
        const row = result.rows[0];

        if (!row) return res.json(null);
        
        // Không JSON.parse nếu lesson_data là chuỗi HTML thuần
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getExportData = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        // Fetch project metadata
        const projRes = await pool.query(`SELECT p.*, u.full_name, u.department FROM projects p JOIN users u ON p.user_id = u.id WHERE p.id = $1`, [projectId]);
        if (projRes.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
        
        // Fetch all lesson_data for this project ordered by schedule_tt
        const lessonsRes = await pool.query(`SELECT schedule_tt, lesson_data FROM lessons WHERE project_id = $1 AND lesson_data IS NOT NULL AND lesson_data != '' ORDER BY schedule_tt ASC`, [projectId]);
        
        // Fetch schedule to determine Book Type
        const schedRes = await pool.query(`SELECT schedule_data FROM schedules WHERE project_id = $1`, [projectId]);
        let bookType = "LÝ THUYẾT"; // Default
        if (schedRes.rows.length > 0 && schedRes.rows[0].schedule_data) {
            try {
                const schedArr = typeof schedRes.rows[0].schedule_data === 'string' ? JSON.parse(schedRes.rows[0].schedule_data) : schedRes.rows[0].schedule_data;
                let totalLt = 0, totalTh = 0, totalKt = 0;
                if (Array.isArray(schedArr)) {
                    for (const session of schedArr) {
                        let lt = 0, th = 0, kt = 0;
                        if (session.overrideCounts) {
                            lt = Number(session.overrideCounts.LT) || Number(session.overrideCounts.lt) || 0;
                            th = Number(session.overrideCounts.TH) || Number(session.overrideCounts.th) || 0;
                            kt = Number(session.overrideCounts.KT) || Number(session.overrideCounts.kt) || 0;
                        } else if (Array.isArray(session.units)) {
                            lt = session.units.filter(u => u.type === 'LT').length;
                            th = session.units.filter(u => u.type === 'TH').length;
                            kt = session.units.filter(u => u.type === 'KT').length;
                        } else {
                            lt = Number(session.lt) || Number(session.LT) || 0;
                            th = Number(session.th) || Number(session.TH) || 0;
                            kt = Number(session.kt) || Number(session.KT) || 0;
                        }
                        totalLt += lt;
                        totalTh += th;
                        totalKt += kt;
                    }
                    if (totalLt > 0 && (totalTh > 0 || totalKt > 0)) bookType = "TÍCH HỢP";
                    else if (totalLt === 0 && (totalTh > 0 || totalKt > 0)) bookType = "THỰC HÀNH";
                    else bookType = "LÝ THUYẾT";
                }
            } catch(e) {}
        }
        
        res.json({
            project: projRes.rows[0],
            lessons: lessonsRes.rows,
            bookType: bookType
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllLessonsByProject = async (req, res) => {
    const projectId = req.params.projectId;
    
    try {
        const query = `SELECT schedule_tt, updated_at, status FROM lessons WHERE project_id = $1 ORDER BY schedule_tt ASC`;
        const result = await pool.query(query, [projectId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveLesson = async (req, res) => {
    const projectId = req.params.projectId;
    const scheduleTT = req.params.tt;
    const { lesson_data } = req.body;
    
    // Lưu trực tiếp string HTML hoặc stringify nếu là object
    const lessonStr = typeof lesson_data === 'string' ? lesson_data : JSON.stringify(lesson_data);
    
    try {
        const checkQuery = `SELECT id FROM lessons WHERE project_id = $1 AND schedule_tt = $2`;
        const result = await pool.query(checkQuery, [projectId, scheduleTT]);
        const row = result.rows[0];

        if (row) {
            const updateQuery = `UPDATE lessons SET lesson_data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
            await pool.query(updateQuery, [lessonStr, row.id]);
            res.json({ message: 'Lesson updated successfully' });
        } else {
            const insertQuery = `INSERT INTO lessons (project_id, schedule_tt, lesson_data) VALUES ($1, $2, $3)`;
            await pool.query(insertQuery, [projectId, scheduleTT, lessonStr]);
            res.status(201).json({ message: 'Lesson saved successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
