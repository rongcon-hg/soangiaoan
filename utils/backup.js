const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const pool = require('../config/database');
const { google } = require('googleapis');

async function getDriveClient(email, key) {
    let actualKey = key;
    if (key.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(key);
            if (parsed.private_key) actualKey = parsed.private_key;
        } catch(e) {}
    }
    const formattedKey = actualKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: email,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/drive']
    });

    await auth.authorize();
    const drive = google.drive({ version: 'v3', auth });
    return drive;
}

async function ensureBackupFolder(drive, parentFolderId) {
    // Luôn sử dụng folder ID cứng theo yêu cầu
    return '1xqKJeiP2_FqCAye09Kk8vtKeiaLGn22p';
}

// 1. Thực hiện dump và upload bằng JS thuần (tương thích Vercel)
exports.runBackup = async (adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key) {
        throw new Error("Chưa cấu hình Google Drive (Email hoặc Key) cho tài khoản Admin.");
    }

    try {
        // Lấy dữ liệu tất cả các bảng
        const users = await pool.query('SELECT * FROM users');
        const projects = await pool.query('SELECT * FROM projects');
        const schedules = await pool.query('SELECT * FROM schedules');
        const lessons = await pool.query('SELECT * FROM lessons');

        const backupData = {
            timestamp: new Date().toISOString(),
            tables: {
                users: users.rows,
                projects: projects.rows,
                schedules: schedules.rows,
                lessons: lessons.rows
            }
        };

        const jsonString = JSON.stringify(backupData);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup_${timestamp}.json`;

        // Upload lên Drive
        const drive = await getDriveClient(adminSettings.drive_email, adminSettings.drive_key);
        const backupFolderId = await ensureBackupFolder(drive, adminSettings.drive_folder);

        const res = await drive.files.create({
            resource: { name: fileName, parents: [backupFolderId] },
            media: { mimeType: 'application/json', body: Readable.from(jsonString) },
            fields: 'id, name, createdTime, size',
            supportsAllDrives: true
        });

        // Xoá các file cũ nếu vượt quá số lượng lưu giữ (retain)
        const retainCount = parseInt(adminSettings.backup_retain) || 7;
        const listRes = await drive.files.list({
            q: `'${backupFolderId}' in parents and trashed=false`,
            fields: 'files(id, name, createdTime)',
            orderBy: 'createdTime desc',
            spaces: 'drive',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true
        });

        const files = listRes.data.files || [];
        if (files.length > retainCount) {
            const filesToDelete = files.slice(retainCount);
            for (const f of filesToDelete) {
                try {
                    await drive.files.delete({ fileId: f.id, supportsAllDrives: true });
                } catch(err) {
                    console.error("Lỗi xoá file backup cũ:", err.message);
                }
            }
        }

        return res.data;
    } catch (error) {
        throw new Error('Backup failed: ' + error.message);
    }
};

// 2. Lấy danh sách backup
exports.listBackups = async (adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key) {
        return [];
    }
    const drive = await getDriveClient(adminSettings.drive_email, adminSettings.drive_key);
    const backupFolderId = await ensureBackupFolder(drive, adminSettings.drive_folder);

    const listRes = await drive.files.list({
        q: `'${backupFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, createdTime, size, webContentLink)',
        orderBy: 'createdTime desc',
        spaces: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true
    });

    return listRes.data.files || [];
};

async function insertTableData(client, tableName, rows) {
    if (!rows || rows.length === 0) return;
    const columns = Object.keys(rows[0]);
    for (const row of rows) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        
        // Escape column names with double quotes to prevent syntax errors
        const safeColumns = columns.map(c => `"${c}"`).join(', ');
        const query = `INSERT INTO ${tableName} (${safeColumns}) VALUES (${placeholders})`;
        await client.query(query, values);
    }
}

// 3. Restore từ file ID
exports.restoreBackup = async (fileId, adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key) {
        throw new Error("Chưa cấu hình Google Drive.");
    }
    
    const drive = await getDriveClient(adminSettings.drive_email, adminSettings.drive_key);
    
    try {
        // Tải file từ Drive
        const res = await drive.files.get({ fileId, alt: 'media', supportsAllDrives: true });
        let backupData = res.data;
        if (typeof backupData === 'string') {
            backupData = JSON.parse(backupData);
        }

        if (!backupData || !backupData.tables) {
            throw new Error("Dữ liệu backup không hợp lệ.");
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Xóa sạch dữ liệu (CASCADE để xử lý khóa ngoại)
            await client.query('TRUNCATE lessons, schedules, projects, users CASCADE');

            // Insert lại dữ liệu theo thứ tự (users -> projects -> schedules/lessons)
            await insertTableData(client, 'users', backupData.tables.users);
            await insertTableData(client, 'projects', backupData.tables.projects);
            await insertTableData(client, 'schedules', backupData.tables.schedules);
            await insertTableData(client, 'lessons', backupData.tables.lessons);

            // Cập nhật lại các sequence ID để không bị lỗi khi tạo mới
            await client.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), true)`);
            await client.query(`SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1), true)`);
            await client.query(`SELECT setval('schedules_id_seq', COALESCE((SELECT MAX(id) FROM schedules), 1), true)`);
            await client.query(`SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 1), true)`);

            await client.query('COMMIT');
        } catch(e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        return { success: true };
    } catch(err) {
        throw new Error("Restore failed: " + err.message);
    }
};
