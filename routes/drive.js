const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/database');
const authenticateToken = require('../middlewares/auth');
// Lazy load driveUtil inside routes to save CPU

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

async function getAdminDriveSettings() {
    const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
    const adminRes = await pool.query(adminQuery);
    if (adminRes.rows.length > 0 && adminRes.rows[0].settings) {
        const adminSettings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings;
        return {
            email: adminSettings.drive_email,
            key: adminSettings.drive_key,
            folder: adminSettings.drive_folder
        };
    }
    return null;
}

// Old method for small files
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const admin = await getAdminDriveSettings();
        if (!admin || !admin.email || !admin.key || !admin.folder) {
            return res.status(400).json({ message: 'Admin chưa cấu hình Google Drive' });
        }
        const driveUrl = await require('../utils/drive').uploadToDrive(admin.email, admin.key, admin.folder, req.file.buffer, req.file.originalname, req.file.mimetype, req.user.username);
        res.json({ message: 'Uploaded successfully', url: driveUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New methods for chunked upload (bypass Vercel 4.5MB limit)
router.post('/start-upload', authenticateToken, express.json(), async (req, res) => {
    try {
        const admin = await getAdminDriveSettings();
        if (!admin || !admin.email || !admin.key || !admin.folder) return res.status(400).json({ message: 'Admin chưa cấu hình Google Drive' });
        
        const { fileName, mimeType } = req.body;
        const uploadUrl = await require('../utils/drive').startResumableUpload(admin.email, admin.key, admin.folder, fileName, mimeType, req.user.username);
        res.json({ uploadUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/upload-chunk', authenticateToken, express.raw({ type: () => true, limit: '4mb' }), async (req, res) => {
    try {
        const uploadUrl = req.headers['x-upload-url'];
        const contentRange = req.headers['content-range'];
        
        const gRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Range': contentRange,
                'Content-Length': (req.body ? req.body.length : 0)
            },
            body: req.body || Buffer.alloc(0)
        });
        
        if (gRes.status === 308) {
            return res.status(308).json({ message: 'Chunk uploaded' });
        }
        if (gRes.ok) {
            const data = await gRes.json();
            return res.json({ fileId: data.id });
        }
        res.status(gRes.status).json({ error: await gRes.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/finish-upload', authenticateToken, express.json(), async (req, res) => {
    try {
        const admin = await getAdminDriveSettings();
        const { fileId } = req.body;
        const url = await require('../utils/drive').setPublicPermission(admin.email, admin.key, fileId);
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
