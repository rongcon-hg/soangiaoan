const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Replace the literal double quotes I injected in exportPdf
content = content.replace('getExportGiaoAnFilename("pdf")', "getExportGiaoAnFilename('pdf')");
content = content.replace("replace(/\\.pdf$/i, '')", "replace(/\\.pdf$/i, '')"); 
// wait, the empty string I injected was `''` which is fine. The issue was `"pdf"`.

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed quotes in exportPdf");
