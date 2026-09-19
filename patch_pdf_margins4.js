const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Just target .paper { ... } in exportPdf
let startIndex = content.indexOf('async function exportPdf');
let endIndex = content.indexOf('const filename', startIndex);
let snippet = content.substring(startIndex, endIndex);

snippet = snippet.replace(/width:\s*210mm/g, 'width: 175mm');
snippet = snippet.replace(/max-width:\s*210mm/g, 'max-width: 175mm');
snippet = snippet.replace(/padding:\s*20mm\s*15mm\s*20mm\s*20mm/g, 'padding: 0');

content = content.substring(0, startIndex) + snippet + content.substring(endIndex);

fs.writeFileSync('views/app.ejs', content);
console.log("Done substring replace");
