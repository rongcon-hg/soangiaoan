const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const regex = /\.paper\s*\{\s*width:\s*210mm\s*!important;\s*max-width:\s*210mm\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*20mm\s*15mm\s*20mm\s*20mm\s*!important;\s*border:\s*0\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#ffffff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\}/;

content = content.replace(regex, `.paper { width: 175mm !important; max-width: 175mm !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; border: 0 !important; box-shadow: none !important; background: #ffffff !important; font-family: 'Times New Roman', Times, serif !important; }`);

fs.writeFileSync('views/app.ejs', content);
console.log("Patched exportPdf CSS");
