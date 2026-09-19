const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// For exportPdfAsBlob
content = content.replace(
    /\.paper\s*\{\s*width:\s*210mm\s*!important;\s*max-width:\s*210mm\s*!important;\s*padding:\s*20mm\s*15mm\s*20mm\s*20mm\s*!important;\s*margin:\s*0\s*!important;\s*border:\s*none\s*!important;\s*box-shadow:\s*none\s*!important;\s*\}/,
    '.paper { width: 210mm !important; max-width: 210mm !important; padding: 20mm 15mm 20mm 20mm !important; margin: 0 !important; border: none !important; box-shadow: none !important; box-sizing: border-box !important; }'
);

// For exportPdf
const brokenCssRegex = /\.paper\s*\{\s*width:\s*210mm[\s\S]*?font-size:\s*12pt\s*!important;/;
content = content.replace(
    brokenCssRegex,
    `.paper {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 20mm 15mm 20mm 20mm !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-size: 12pt !important;
      box-sizing: border-box !important;`
);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed broken CSS");
