const { google } = require('googleapis');
const stream = require('stream');

async function getAuthAndFolder(email, key, folderId, subFolderName) {
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

    const date = new Date();
    const folderName = subFolderName || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const searchRes = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${folderId}' in parents and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true
    });

    let targetFolderId = null;
    if (searchRes.data.files.length === 0) {
        const folder = await drive.files.create({
            resource: { name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [folderId] },
            fields: 'id',
            supportsAllDrives: true
        });
        targetFolderId = folder.data.id;
    } else {
        targetFolderId = searchRes.data.files[0].id;
    }

    return { auth, drive, targetFolderId, token: auth.credentials.access_token };
}

exports.startResumableUpload = async (email, key, folderId, fileName, mimeType, subFolderName) => {
    try {
        const { targetFolderId, token } = await getAuthAndFolder(email, key, folderId, subFolderName);
        const metadata = { name: fileName, parents: [targetFolderId] };
        
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Upload-Content-Type': mimeType
            },
            body: JSON.stringify(metadata)
        });
        
        if (!res.ok) throw new Error("Failed to start upload: " + await res.text());
        return res.headers.get('Location');
    } catch (error) {
        throw new Error('Start Resumable Upload Error: ' + error.message);
    }
};

exports.setPublicPermission = async (email, key, fileId) => {
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

        // Thêm cơ chế retry (thử lại tối đa 3 lần) cho Eventual Consistency của Google Drive
        let retries = 3;
        let file = null;
        while (retries > 0) {
            try {
                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: { role: 'reader', type: 'anyone' },
                    supportsAllDrives: true
                });
                file = await drive.files.get({
                    fileId, fields: 'webViewLink', supportsAllDrives: true
                });
                break;
            } catch (err) {
                if (err.message && err.message.includes('File not found') && retries > 1) {
                    retries--;
                    await new Promise(res => setTimeout(res, 2000)); // Đợi 2s rồi thử lại
                } else {
                    throw err;
                }
            }
        }
        return file.data.webViewLink;
    } catch (error) {
        throw new Error('Set Permission Error: ' + error.message);
    }
};

// Keep old method for backward compatibility
exports.uploadToDrive = async (email, key, folderId, fileBuffer, fileName, mimeType, subFolderName) => {
    try {
        const { drive, targetFolderId } = await getAuthAndFolder(email, key, folderId, subFolderName);
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);
        const file = await drive.files.create({
            resource: { name: fileName, parents: [targetFolderId] },
            media: { mimeType: mimeType, body: bufferStream },
            fields: 'id, webViewLink',
            supportsAllDrives: true
        });
        await drive.permissions.create({
            fileId: file.data.id,
            requestBody: { role: 'reader', type: 'anyone' },
            supportsAllDrives: true
        });
        return file.data.webViewLink;
    } catch (error) {
        throw new Error('Google Drive upload failed: ' + error.message);
    }
};

exports.testConnection = async (email, key, folderId) => {
    try {
        const { drive } = await getAuthAndFolder(email, key, folderId, "test");
        const folder = await drive.files.get({ fileId: folderId, fields: 'id, name', supportsAllDrives: true });
        return folder.data;
    } catch (error) {
        throw new Error(error.message);
    }
};
