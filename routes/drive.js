const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');
const driveUtil = require('../utils/drive');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
        const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
        const adminRes = await pool.query(adminQuery);
        let driveEmail, driveKey, driveFolder;
        if (adminRes.rows.length > 0 && adminRes.rows[0].settings) {
            const adminSettings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings;
            driveEmail = adminSettings.drive_email;
            driveKey = adminSettings.drive_key;
            driveFolder = adminSettings.drive_folder;
        }

        if (!driveEmail || !driveKey || !driveFolder) {
            return res.status(400).json({ message: 'Admin chưa cấu hình Google Drive' });
        }

        const driveUrl = await driveUtil.uploadToDrive(
            driveEmail,
            driveKey,
            driveFolder,
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({ message: 'Uploaded successfully', url: driveUrl });
    } catch (error) {
        console.error('Drive Upload Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
