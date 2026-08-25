const db = require('../config/database');

exports.getAllProjects = (req, res) => {
    const userId = req.user.id;
    const query = `SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC`;
    
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Parse JSON program_data back to object
        const projects = rows.map(row => {
            if (row.program_data) {
                try { row.program_data = JSON.parse(row.program_data); } 
                catch(e) { row.program_data = null; }
            }
            return row;
        });
        
        res.json(projects);
    });
};

exports.getProjectById = (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    
    const query = `SELECT * FROM projects WHERE id = ? AND user_id = ?`;
    db.get(query, [projectId, userId], (err, project) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.program_data) {
            try { project.program_data = JSON.parse(project.program_data); } 
            catch(e) { project.program_data = null; }
        }
        
        res.json(project);
    });
};

exports.createProject = (req, res) => {
    const userId = req.user.id;
    const { name, course_code, total_hours, program_data } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Project name is required' });
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    
    const query = `INSERT INTO projects (user_id, name, course_code, total_hours, program_data) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [userId, name, course_code, total_hours, programDataStr], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Project created successfully', projectId: this.lastID });
    });
};

exports.updateProject = (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, course_code, total_hours, program_data } = req.body;
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    
    const query = `UPDATE projects SET name = ?, course_code = ?, total_hours = ?, program_data = ? WHERE id = ? AND user_id = ?`;
    db.run(query, [name, course_code, total_hours, programDataStr, projectId, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json({ message: 'Project updated successfully' });
    });
};

exports.deleteProject = (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    
    const query = `DELETE FROM projects WHERE id = ? AND user_id = ?`;
    db.run(query, [projectId, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json({ message: 'Project deleted successfully' });
    });
};
