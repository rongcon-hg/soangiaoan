require('dotenv').config();
const pool = require('./config/database');

pool.query("SELECT username, role, settings FROM users WHERE role = 'Admin'")
    .then(r => {
        console.log(r.rows);
        process.exit(0);
    }).catch(e => {
        console.error(e);
        process.exit(1);
    });
