const { google } = require('googleapis');
const stream = require('stream');

/**
 * Uploads a base64 or buffer file to Google Drive.
 * @param {string} email - Service account email
 * @param {string} key - Private key
 * @param {string} folderId - Destination folder ID
 * @param {Buffer} fileBuffer - The file content
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - The Google Drive file WebContentLink or WebViewLink
 */
exports.uploadToDrive = async (email, key, folderId, fileBuffer, fileName, mimeType, subFolderName) => {
    try {
        let actualKey = key;
        // Kiểm tra xem user có paste nguyên cục JSON không
        if (key.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(key);
                if (parsed.private_key) actualKey = parsed.private_key;
            } catch(e) {}
        }

        // Format the private key correctly
        const formattedKey = actualKey.replace(/\\n/g, '\n');

        const auth = new google.auth.JWT({
            email: email,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        await auth.authorize();

        const drive = google.drive({ version: 'v3', auth });

        // 1. Lấy tên thư mục theo năm-tháng hiện tại (VD: 2026-08)
        const date = new Date();
        const folderName = subFolderName || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        // 2. Tìm xem thư mục này đã tồn tại trong folder gốc chưa
        const searchRes = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${folderId}' in parents and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true
        });

        let targetFolderId = null;

        // 3. Nếu chưa có thì tạo mới
        if (searchRes.data.files.length === 0) {
            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [folderId]
            };
            const folder = await drive.files.create({
                resource: folderMetadata,
                fields: 'id',
                supportsAllDrives: true
            });
            targetFolderId = folder.data.id;
        } else {
            targetFolderId = searchRes.data.files[0].id;
        }

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        const fileMetadata = {
            name: fileName,
            parents: [targetFolderId]
        };

        const media = {
            mimeType: mimeType,
            body: bufferStream
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
            supportsAllDrives: true
        });
        
        // Share the file publicly so it can be viewed as an avatar/resource
        await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            },
            supportsAllDrives: true
        });

        return file.data.webViewLink; // or webContentLink for direct download
    } catch (error) {
        console.error('Google Drive Upload Error:', error);
        throw new Error('Google Drive upload failed: ' + error.message);
    }
};

/**
 * Test the Google Drive Connection.
 */
exports.testConnection = async (email, key, folderId) => {
    try {
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

        // Test connection by fetching the folder details
        const folder = await drive.files.get({
            fileId: folderId,
            fields: 'id, name',
            supportsAllDrives: true
        });

        return folder.data;
    } catch (error) {
        throw new Error(error.message);
    }
};
