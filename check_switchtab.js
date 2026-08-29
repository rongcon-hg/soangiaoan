const fs = require('fs');
const code = fs.readFileSync('views/app.ejs', 'utf8');
const idx = code.indexOf('function switchTab');
console.log(code.substring(idx - 100, idx + 100));
