const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const badStr = `.paper {
      width: 800px !important;
      max-width: 800px !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #fff !important;
      font-family: 'Times New Roman', Times, serif !important;`;

const goodStr = `.paper {
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: "Times New Roman", Times, serif !important;`;

// Use simple replace with replaceAll on spaces to avoid newline mismatches
let startIndex = content.indexOf('async function exportPdf');
let endIndex = content.indexOf('const filename', startIndex);
let snippet = content.substring(startIndex, endIndex);

snippet = snippet.replace(/width:\s*800px/g, 'width: 100%');
snippet = snippet.replace(/max-width:\s*800px/g, 'max-width: 100%');

content = content.substring(0, startIndex) + snippet + content.substring(endIndex);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed 800px -> 100%");
