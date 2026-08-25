const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

exports.register = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
        
        const result = await pool.query(query, [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, gemini_api_key: user.gemini_api_key } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApiKey = async (req, res) => {
    const { apiKey } = req.body;
    const userId = req.user.id;

    try {
        const query = `UPDATE users SET gemini_api_key = $1 WHERE id = $2`;
        await pool.query(query, [apiKey, userId]);
        res.json({ message: 'API key updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const query = `SELECT id, username, role, gemini_api_key, full_name, department, phone, email, avatar, settings FROM users WHERE id = $1`;
        const result = await pool.query(query, [req.user.id]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    let { full_name, department, phone, email, avatar } = req.body;
    try {
        // Nếu avatar là chuỗi Base64 mới, ta upload lên Drive
        if (avatar && avatar.startsWith('data:image')) {
            // Lấy config Drive của Admin (hoặc của chính user nếu có)
            const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
            const adminRes = await pool.query(adminQuery);
            const adminSettings = adminRes.rows[0]?.settings || {};
            
            const driveEmail = adminSettings.drive_email;
            const driveKey = adminSettings.drive_key;
            const driveFolder = adminSettings.drive_folder;

            if (driveEmail && driveKey && driveFolder) {
                const driveUtil = require('../utils/drive');
                // Tách header base64 (ví dụ: data:image/png;base64,iVBORw0...)
                const matches = avatar.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const mimeType = matches[1];
                    const base64Data = matches[2];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const ext = mimeType.split('/')[1] || 'png';
                    const fileName = `avatar_${req.user.id}_${Date.now()}.${ext}`;
                    
                    // Upload lên Drive
                    const driveUrl = await driveUtil.uploadToDrive(driveEmail, driveKey, driveFolder, buffer, fileName, mimeType);
                    avatar = driveUrl; // Thay thế base64 bằng link Drive
                }
            }
        }

        const query = `UPDATE users SET full_name = $1, department = $2, phone = $3, email = $4, avatar = $5 WHERE id = $6`;
        await pool.query(query, [full_name, department, phone, email, avatar, req.user.id]);
        res.json({ message: 'Profile updated successfully', avatar_url: avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    const { settings } = req.body;
    try {
        const query = `UPDATE users SET settings = $1 WHERE id = $2`;
        await pool.query(query, [JSON.stringify(settings), req.user.id]);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
