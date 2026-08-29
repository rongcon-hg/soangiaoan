require('dotenv').config();
const pool = require('./config/database');
const driveUtil = require('./utils/drive');

pool.query("SELECT settings FROM users WHERE role = 'Admin'").then(async r => {
    const s = r.rows[0].settings;
    try {
        console.log("Testing drive upload...");
        const result = await driveUtil.uploadToDrive(
            s.drive_email, 
            s.drive_key, 
            s.drive_folder,
            Buffer.from("Hello world"), 
            "test_file.txt", 
            "text/plain", 
            "test_user"
        );
        console.log("Success URL:", result);
    } catch(e) {
        console.log("Error:", e.message);
    }
    process.exit(0);
});
