const fs = require('fs');
let txt = fs.readFileSync('controllers/authController.js', 'utf8');

txt = txt.replace(
    'const adminSettings = adminRes.rows[0]?.settings || {};',
    "let adminSettings = {}; if(adminRes.rows.length > 0 && adminRes.rows[0].settings) { adminSettings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings; }"
);

fs.writeFileSync('controllers/authController.js', txt);
console.log('Fixed adminSettings parsed in authController.js');
