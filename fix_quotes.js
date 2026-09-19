const fs = require('fs');

let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Find the exportPdf function boundaries
let startIndex = content.indexOf('async function exportPdf()');
let endIndex = content.indexOf('let receivedFullProgram=null;', startIndex);

let snippet = content.substring(startIndex, endIndex);

// Replace all double quotes with single quotes inside this snippet!
snippet = snippet.replace(/"/g, "'");

content = content.substring(0, startIndex) + snippet + content.substring(endIndex);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed double quotes in exportPdf!");
