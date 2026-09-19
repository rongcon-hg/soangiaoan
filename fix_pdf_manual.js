const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// I will find the EXACT string and replace it.
const badString = `    .paper { width: 210mm !important; max-width: 210mm !important; min-height: auto !important; margin: 0 !important; padding: 20mm 15mm 20mm 20mm !important; border: 0 !important; box-shadow: none !important; background: #ffffff !important; font-family: 'Times New Roman', Times, serif !important; }
      max-width: 170mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;`;

const goodString = `    .paper {
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

content = content.replace(badString, goodString);

fs.writeFileSync('views/app.ejs', content);
console.log("Manually fixed bad CSS string");
