const fs = require('fs');
const code = fs.readFileSync('views/app.ejs', 'utf8');
const idx = code.indexOf('function rawSessionItems');
console.log("Index:", idx);
if(idx !== -1) console.log(code.substring(idx, idx + 300));
