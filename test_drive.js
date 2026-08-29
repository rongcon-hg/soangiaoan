require('dotenv').config();
const pool = require('./config/database');
const driveUtil = require('./utils/drive');

pool.query("SELECT settings FROM users WHERE role = 'Admin'").then(async r => {
    const s = r.rows[0].settings;
    try {
        console.log("Testing drive connection...");
        const result = await driveUtil.testConnection(s.drive_email, s.drive_key, s.drive_folder);
        console.log("Success:", result);
    } catch(e) {
        console.log("Error:", e.message);
    }
    process.exit(0);
});
