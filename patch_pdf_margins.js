const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// For exportPdfAsBlob
content = content.replace(
    /\.paper\s*\{\s*width:\s*210mm\s*!important;\s*max-width:\s*210mm\s*!important;\s*padding:\s*20mm\s*15mm\s*20mm\s*20mm\s*!important;\s*margin:\s*0\s*!important;\s*border:\s*none\s*!important;\s*box-shadow:\s*none\s*!important;\s*\}/g,
    '.paper { width: 175mm !important; max-width: 175mm !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }'
);
content = content.replace(
    /const opt = \{\s*margin:\s*0,/g,
    'const opt = {\n    margin: [15, 15, 15, 20],' // This will apply to both exportPdfAsBlob and exportPdf
);

// For exportPdf CSS
content = content.replace(
    /\.paper\s*\{\s*width:\s*210mm\s*!important;\s*max-width:\s*210mm\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*20mm\s*15mm\s*20mm\s*20mm\s*!important;\s*border:\s*0\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#ffffff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\}/g,
    `.paper {
      width: 175mm !important;
      max-width: 175mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
    }`
);

fs.writeFileSync('views/app.ejs', content);
console.log("Patched PDF margins");
