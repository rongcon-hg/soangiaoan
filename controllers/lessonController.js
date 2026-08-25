const db = require('../config/database');

// --- Sổ đầu bài (Schedules) ---

exports.getScheduleByProjectId = (req, res) => {
    const projectId = req.params.projectId;
    const query = `SELECT * FROM schedules WHERE project_id = ?`;
    
    db.get(query, [projectId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.json(null);
        
        try { row.schedule_data = JSON.parse(row.schedule_data); } catch(e) { }
        res.json(row);
    });
};

exports.saveSchedule = (req, res) => {
    const projectId = req.params.projectId;
    const { schedule_data } = req.body;
    
    const scheduleStr = JSON.stringify(schedule_data);
    
    // Check if exists
    db.get(`SELECT id FROM schedules WHERE project_id = ?`, [projectId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            // Update
            db.run(`UPDATE schedules SET schedule_data = ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?`, 
                [scheduleStr, projectId], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Schedule updated successfully' });
                });
        } else {
            // Insert
            db.run(`INSERT INTO schedules (project_id, schedule_data) VALUES (?, ?)`, 
                [projectId, scheduleStr], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Schedule saved successfully' });
                });
        }
    });
};


// --- Giáo án (Lessons) ---

exports.getLessonByTT = (req, res) => {
    const projectId = req.params.projectId;
    const scheduleTT = req.params.tt;
    
    const query = `SELECT * FROM lessons WHERE project_id = ? AND schedule_tt = ?`;
    db.get(query, [projectId, scheduleTT], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.json(null);
        
        try { row.lesson_data = JSON.parse(row.lesson_data); } catch(e) { }
        res.json(row);
    });
};

exports.getAllLessonsByProject = (req, res) => {
    const projectId = req.params.projectId;
    
    const query = `SELECT schedule_tt, updated_at FROM lessons WHERE project_id = ? ORDER BY schedule_tt ASC`;
    db.all(query, [projectId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.saveLesson = (req, res) => {
    const projectId = req.params.projectId;
    const scheduleTT = req.params.tt;
    const { lesson_data } = req.body;
    
    const lessonStr = JSON.stringify(lesson_data);
    
    db.get(`SELECT id FROM lessons WHERE project_id = ? AND schedule_tt = ?`, [projectId, scheduleTT], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            db.run(`UPDATE lessons SET lesson_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
                [lessonStr, row.id], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Lesson updated successfully' });
                });
        } else {
            db.run(`INSERT INTO lessons (project_id, schedule_tt, lesson_data) VALUES (?, ?, ?)`, 
                [projectId, scheduleTT, lessonStr], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Lesson saved successfully' });
                });
        }
    });
};
