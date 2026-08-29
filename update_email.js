require('dotenv').config();
const pool = require('./config/database');
(async () => {
    try {
        await pool.query('UPDATE users SET email = $1 WHERE username = $2', ['rongcon@rongcon.net', 'qtv']);
        console.log('Update successful');
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
})();
