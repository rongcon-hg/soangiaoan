const fs = require('fs');
let txt = fs.readFileSync('utils/drive.js', 'utf8');

const oldPermissionStr = `        await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: 'reader', type: 'anyone' },
            supportsAllDrives: true
        });

        const file = await drive.files.get({
            fileId, fields: 'webViewLink', supportsAllDrives: true
        });
        return file.data.webViewLink;`;

const newPermissionStr = `        // Thêm cơ chế retry (thử lại tối đa 3 lần) cho Eventual Consistency của Google Drive
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
        return file.data.webViewLink;`;

if (txt.includes(oldPermissionStr)) {
    txt = txt.replace(oldPermissionStr, newPermissionStr);
    fs.writeFileSync('utils/drive.js', txt);
    console.log("Patched setPublicPermission with retry loop.");
} else {
    console.log("Could not find the exact permission string.");
}
