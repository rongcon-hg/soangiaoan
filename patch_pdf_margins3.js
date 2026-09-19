const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const strToFind = `    .paper {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 20mm 15mm 20mm 20mm !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
    }`;

const strToReplace = `    .paper {
      width: 175mm !important;
      max-width: 175mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
      box-sizing: border-box !important;
    }`;

content = content.replace(strToFind, strToReplace);
fs.writeFileSync('views/app.ejs', content);
console.log("Done string replace");
