const fs = require('fs');
const txt = fs.readFileSync('debug_script.js', 'utf8');

const i = txt.indexOf("fetch('/api/drive/upload'");
console.log(txt.substring(Math.max(0, i - 100), Math.min(txt.length, i + 500)));
