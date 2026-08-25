const pool = require('../config/database');

exports.getAllProjects = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`;
        const result = await pool.query(query, [userId]);
        
        const projects = result.rows.map(row => {
            if (row.program_data) {
                try { row.program_data = JSON.parse(row.program_data); } 
                catch(e) { row.program_data = null; }
            }
            return row;
        });
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    
    try {
        const query = `SELECT * FROM projects WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(query, [projectId, userId]);
        const project = result.rows[0];

        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.program_data) {
            try { project.program_data = JSON.parse(project.program_data); } 
            catch(e) { project.program_data = null; }
        }
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    const userId = req.user.id;
    const { name, course_code, total_hours, program_data } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Project name is required' });
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    
    try {
        const query = `INSERT INTO projects (user_id, name, course_code, total_hours, program_data) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const result = await pool.query(query, [userId, name, course_code, total_hours, programDataStr]);
        res.status(201).json({ message: 'Project created successfully', projectId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, course_code, total_hours, program_data } = req.body;
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    
    try {
        const query = `UPDATE projects SET name = $1, course_code = $2, total_hours = $3, program_data = $4 WHERE id = $5 AND user_id = $6`;
        const result = await pool.query(query, [name, course_code, total_hours, programDataStr, projectId, userId]);
        
        if (result.rowCount === 0) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    
    try {
        const query = `DELETE FROM projects WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(query, [projectId, userId]);
        
        if (result.rowCount === 0) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
