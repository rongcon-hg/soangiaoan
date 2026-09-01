const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const pool = require('../config/database');
const { google } = require('googleapis');
const driveUtil = require('./drive');

const execAsync = util.promisify(exec);

// Helper function to get Drive Auth directly (bypassing the date-based folder creation if we just want a specific folder)
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

// Ensure the Backup folder exists
async function ensureBackupFolder(drive, parentFolderId) {
    const folderName = 'Database_Backups';
    const searchRes = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true
    });

    if (searchRes.data.files.length === 0) {
        const folder = await drive.files.create({
            resource: { name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentFolderId] },
            fields: 'id',
            supportsAllDrives: true
        });
        return folder.data.id;
    }
    return searchRes.data.files[0].id;
}

// 1. Thực hiện dump và upload
exports.runBackup = async (adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key || !adminSettings.drive_folder) {
        throw new Error("Chưa cấu hình Google Drive cho tài khoản Admin.");
    }

    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) throw new Error("Không tìm thấy biến môi trường DATABASE_URL.");

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup_${timestamp}.sql`;
    const filePath = path.join(__dirname, '..', fileName);

    try {
        // 1. Tạo file dump (Sử dụng pg_dump)
        await execAsync(`pg_dump "${dbUrl}" -F c -f "${filePath}"`);

        // 2. Upload lên Drive
        const drive = await getDriveClient(adminSettings.drive_email, adminSettings.drive_key);
        const backupFolderId = await ensureBackupFolder(drive, adminSettings.drive_folder);

        const fileSize = fs.statSync(filePath).size;
        const res = await drive.files.create({
            resource: { name: fileName, parents: [backupFolderId] },
            media: { mimeType: 'application/octet-stream', body: fs.createReadStream(filePath) },
            fields: 'id, name, createdTime, size',
            supportsAllDrives: true
        });

        // 3. Xoá file local
        fs.unlinkSync(filePath);

        // 4. Xoá các file cũ nếu vượt quá số lượng lưu giữ (retain)
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
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new Error('Backup failed: ' + error.message);
    }
};

// 2. Lấy danh sách backup
exports.listBackups = async (adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key || !adminSettings.drive_folder) {
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

// 3. Restore từ file ID
exports.restoreBackup = async (fileId, adminSettings) => {
    if (!adminSettings.drive_email || !adminSettings.drive_key || !adminSettings.drive_folder) {
        throw new Error("Chưa cấu hình Google Drive.");
    }
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) throw new Error("Không tìm thấy biến môi trường DATABASE_URL.");

    const drive = await getDriveClient(adminSettings.drive_email, adminSettings.drive_key);
    
    const filePath = path.join(__dirname, '..', `restore_${Date.now()}.sql`);
    
    try {
        // Tải file từ Drive
        const dest = fs.createWriteStream(filePath);
        const res = await drive.files.get({ fileId, alt: 'media', supportsAllDrives: true }, { responseType: 'stream' });
        
        await new Promise((resolve, reject) => {
            res.data.on('end', () => resolve());
            res.data.on('error', err => reject(err));
            res.data.pipe(dest);
        });

        // Đảm bảo đóng kết nối để pg_restore có thể drop DB (hoặc dùng cờ clean)
        // Lưu ý: pg_restore với cờ -c (clean) sẽ xoá object trước khi tạo lại.
        // -O (no owner), -x (no privileges).
        await execAsync(`pg_restore --clean --if-exists -O -x -d "${dbUrl}" "${filePath}"`);
        
        fs.unlinkSync(filePath);
        return { success: true };
    } catch(err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new Error("Restore failed: " + err.message);
    }
};
