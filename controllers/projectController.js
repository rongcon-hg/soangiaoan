const pool = require('../config/database');

exports.getAllProjects = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`;
        const result = await pool.query(query, [userId]);
        
        const projects = result.rows.map(row => {
            if (row.program_data) {
                try { row.program_data = typeof row.program_data === 'string' ? JSON.parse(row.program_data) : row.program_data; } 
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
            try { project.program_data = typeof project.program_data === 'string' ? JSON.parse(project.program_data) : project.program_data; } 
            catch(e) { project.program_data = null; }
        }
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    const userId = req.user.id;
    const { name, course_code, total_hours, system_type, class_name, program_data } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Project name is required' });
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    const finalSystemType = system_type || 'Trung cấp';
    const finalClassName = class_name || null;
    
    try {
        const query = `INSERT INTO projects (user_id, name, course_code, total_hours, system_type, class_name, program_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
        const result = await pool.query(query, [userId, name, course_code, total_hours, finalSystemType, finalClassName, programDataStr]);
        res.status(201).json({ message: 'Project created successfully', projectId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, course_code, total_hours, system_type, class_name, program_data } = req.body;
    
    const programDataStr = program_data ? JSON.stringify(program_data) : null;
    
    try {
        const query = `UPDATE projects SET name = COALESCE($1, name), course_code = COALESCE($2, course_code), total_hours = COALESCE($3, total_hours), system_type = COALESCE($4, system_type), class_name = COALESCE($5, class_name), program_data = COALESCE($6, program_data) WHERE id = $7 AND user_id = $8`;
        const result = await pool.query(query, [name, course_code, total_hours, system_type, class_name, programDataStr, projectId, userId]);
        
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
