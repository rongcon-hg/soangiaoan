const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const target = 'value="2026-07-07"';
const robustReplacement = `value="<%= new Date(Date.now() + 7 * 3600 * 1000).toISOString().split('T')[0] %>"`;

if (content.includes(target)) {
    content = content.replace(target, robustReplacement);
    fs.writeFileSync('views/app.ejs', content);
    console.log("Successfully replaced hardcoded date");
} else {
    console.log("Target not found!");
}
