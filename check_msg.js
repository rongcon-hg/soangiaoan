const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');
const iframeSrc = txt.substring(txt.indexOf('srcdoc="') + 8, txt.indexOf('"></iframe>'));
console.log(iframeSrc.includes('window.addEventListener("message"'));
console.log(iframeSrc.includes("window.addEventListener('message'"));
