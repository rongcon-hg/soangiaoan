const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');
const start = txt.indexOf('programFile');
console.log(txt.substring(start - 50, start + 100));
