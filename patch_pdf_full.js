const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// --- Fix exportPdfAsBlob ---
content = content.replace(
    /\.paper\s*\{\s*width:\s*170mm\s*!important;\s*max-width:\s*170mm\s*!important;\s*padding:\s*0\s*!important;/g,
    '.paper { width: 210mm !important; max-width: 210mm !important; padding: 20mm 15mm 20mm 20mm !important;'
);
content = content.replace(
    /margin:\s*\[15,\s*20,\s*15,\s*20\],/g,
    'margin: 0,'
);
// Make sure scrollX, scrollY are set to avoid left-side clipping
content = content.replace(
    /html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false\s*,\s*windowWidth:\s*1024\s*\}/g,
    'html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 1024, scrollX: 0, scrollY: 0 }'
);

// --- Fix exportPdf ---
content = content.replace(
    /\.paper\s*\{\s*width:\s*183mm\s*!important;\s*max-width:\s*183mm\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*0\s*!important;/g,
    '.paper { width: 210mm !important; max-width: 210mm !important; min-height: auto !important; margin: 0 !important; padding: 20mm 15mm 20mm 20mm !important;'
);
content = content.replace(
    /margin:\s*\[15,\s*12,\s*15,\s*15\],/g,
    'margin: 0,'
);
// Make sure scrollX, scrollY are set
content = content.replace(
    /html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false\s*,\s*windowWidth:\s*1200\s*\}/g,
    'html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 1200, scrollX: 0, scrollY: 0 }'
);

fs.writeFileSync('views/app.ejs', content);
console.log("Patched PDF full-width logic");
