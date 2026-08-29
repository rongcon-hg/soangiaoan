const fs = require('fs');
const code = fs.readFileSync('public/js/api.js', 'utf8');
console.log(code.includes('getHeaders'));
