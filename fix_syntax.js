const fs = require('fs');

let content = fs.readFileSync('views/app.ejs', 'utf-8');

// The problematic string is `KHÔNG bọc trong markdown hay \`\`\` ` inside the prompt.
// We'll just replace the whole markdown instruction to avoid any backtick issues.
const target1 = "KHÔNG bọc trong markdown hay ```).";
const replacement1 = "KHÔNG bọc trong markdown code block).";

content = content.replace(target1, replacement1);
content = content.replace(target1, replacement1); // Replace for both runRubricAI and runErrorAI

fs.writeFileSync('views/app.ejs', content);
console.log("Syntax error fixed!");
