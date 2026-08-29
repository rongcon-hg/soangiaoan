const fs = require('fs');
let code = fs.readFileSync('views/app.ejs', 'utf8');

code = code.replace(/date:fmt\(s\.date\)/g, 'date:fmt(new Date(s.date))');
code = code.replace(/weekday:weekdayName\(s\.date\)/g, 'weekday:weekdayName(new Date(s.date))');

fs.writeFileSync('views/app.ejs', code, 'utf8');
console.log("Patched s.date inside sendSessionToPlanner");
