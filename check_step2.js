const fs = require('fs');
const code = fs.readFileSync('views/app.ejs', 'utf8');
const idx = code.indexOf('id="step2"');
console.log(code.substring(idx - 50, idx + 100));
