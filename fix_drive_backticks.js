const fs = require('fs');
let txt = fs.readFileSync('routes/drive.js', 'utf8');

txt = txt.replace(/\\`/g, '`');

fs.writeFileSync('routes/drive.js', txt);
console.log("Fixed backticks in routes/drive.js");
