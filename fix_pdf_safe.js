const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// For exportPdfAsBlob
content = content.replace(
    /(\.paper\s*\{\s*width:\s*)170mm(\s*!important;\s*max-width:\s*)170mm(\s*!important;\s*padding:\s*)0(\s*!important;\s*margin:\s*)0(\s*!important;\s*border:\s*none\s*!important;\s*box-shadow:\s*none\s*!important;\s*\})/g,
    '$1210mm$2210mm$320mm 15mm 20mm 20mm$40$5'
);
content = content.replace(
    /(margin:\s*\[15,\s*20,\s*15,\s*20\])/g,
    'margin: 0'
);
content = content.replace(
    /(html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false\s*,\s*windowWidth:\s*1024)\s*\}/g,
    '$1, scrollX: 0, scrollY: 0 }'
);

// For exportPdf
content = content.replace(
    /(\.paper\s*\{\s*width:\s*)183mm(\s*!important;\s*max-width:\s*)183mm(\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*)0(\s*!important;\s*padding:\s*)0(\s*!important;\s*border:\s*0\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#ffffff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\})/g,
    '$1210mm$2210mm$30$420mm 15mm 20mm 20mm$5'
);
content = content.replace(
    /(margin:\s*\[15,\s*12,\s*15,\s*15\])/g,
    'margin: 0'
);
content = content.replace(
    /(html2canvas:\s*\{\s*[\s\S]*?logging:\s*false\s*,\s*windowWidth:\s*1200)\s*\}/g,
    '$1, scrollX: 0, scrollY: 0 }'
);

fs.writeFileSync('views/app.ejs', content);
console.log("Safely patched PDF config");
