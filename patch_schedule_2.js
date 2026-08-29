const fs = require('fs');
let code = fs.readFileSync('views/app.ejs', 'utf-8');

code = code.replace(/if \(currentSessions && currentSessions\.length > 0\) \{[\s\S]*?\} else \{/, "if (currentSessions && currentSessions.length > 0) {\n            renderScheduleTable();\n        } else {");

fs.writeFileSync('views/app.ejs', code, 'utf-8');
console.log("Success2");
