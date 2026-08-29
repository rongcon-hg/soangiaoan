const fs = require('fs');
const code = fs.readFileSync('views/app.ejs', 'utf8');
const idx = code.indexOf('function sendSessionToPlanner(index){');
console.log(code.substring(idx, idx + 2500));
