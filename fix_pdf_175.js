const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// I will just substring replace the exact lines in exportPdf
let startIndex = content.indexOf('async function exportPdf');
let endIndex = content.indexOf('const filename', startIndex);
let snippet = content.substring(startIndex, endIndex);

snippet = snippet.replace(/width:\s*175mm/g, 'width: 800px');
snippet = snippet.replace(/max-width:\s*175mm/g, 'max-width: 800px');
// Also ensure background is #fff
snippet = snippet.replace(/background:\s*#ffffff/g, 'background: #fff');

content = content.substring(0, startIndex) + snippet + content.substring(endIndex);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed 175mm in exportPdf");
