const fs = require('fs');
let code = fs.readFileSync('views/app.ejs', 'utf8');

const target = 'if(e.data?.type==="OPEN_LESSON_PLAN_FROM_SCHEDULE"){';
const replacement = target + '\n    if(typeof switchTab === "function") switchTab(2);\n';
code = code.replace(target, replacement);

fs.writeFileSync('views/app.ejs', code, 'utf8');
console.log("Patched again.");
