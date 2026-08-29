const fs = require('fs');
const code = fs.readFileSync('public/js/layout.js', 'utf8');
const idx1 = code.indexOf('API_URL');
console.log(code.substring(idx1 - 100, idx1 + 100));
