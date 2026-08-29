require('dotenv').config();
const { google } = require('googleapis');
const pool = require('./config/database');

pool.query("SELECT settings FROM users WHERE role = 'Admin'").then(async r => {
    const s = r.rows[0].settings;
    let actualKey = s.drive_key;
    if (s.drive_key.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(s.drive_key);
            if (parsed.private_key) actualKey = parsed.private_key;
        } catch(e) {}
    }
    const formattedKey = actualKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: s.drive_email,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    await auth.authorize();
    const drive = google.drive({ version: 'v3', auth });
    
    try {
        console.log("Checking file 11-6at_5Wj-6d2VyoLQ5Ky0J6G_TFiw7t...");
        const file = await drive.files.get({
            fileId: '11-6at_5Wj-6d2VyoLQ5Ky0J6G_TFiw7t',
            fields: 'id, name, mimeType',
            supportsAllDrives: true
        });
        console.log("File found!", file.data);
    } catch(e) {
        console.log("Error:", e.message);
    }
    process.exit(0);
});
