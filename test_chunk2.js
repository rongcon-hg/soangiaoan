require('dotenv').config();
const { google } = require('googleapis');
const pool = require('./config/database');
const driveUtil = require('./utils/drive');

pool.query("SELECT settings FROM users WHERE role = 'Admin'").then(async r => {
    const s = r.rows[0].settings;
    try {
        console.log("Starting resumable upload...");
        const uploadUrl = await driveUtil.startResumableUpload(s.drive_email, s.drive_key, s.drive_folder, "test2.txt", "text/plain", "qtv");
        console.log("Upload URL:", uploadUrl);
        
        const chunk = Buffer.from("Hello world chunked");
        console.log("Sending chunk...");
        const gRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Range': `bytes 0-${chunk.length - 1}/${chunk.length}`,
                'Content-Length': chunk.length
            },
            body: chunk
        });
        
        console.log("Status:", gRes.status);
        if (gRes.ok) {
            const data = await gRes.json();
            console.log("Result file metadata:", data);
        } else {
            console.log("Error:", await gRes.text());
        }
    } catch(e) {
        console.log("Catch Error:", e.message);
    }
    process.exit(0);
});
