const fs = require('fs');
const code = fs.readFileSync('views/app.ejs', 'utf8');
const idx1 = code.indexOf('renderScheduleTable()');
const idx2 = code.lastIndexOf('renderScheduleTable()');
console.log("First:", idx1);
console.log("Last:", idx2);
console.log(code.substring(idx2 - 100, idx2 + 100));
