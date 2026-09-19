const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// We will locate the `exportPdfAsBlob` and `exportPdf` functions and rewrite their `pdfStyle.textContent` and `opt`.

// 1. Fix exportPdfAsBlob
content = content.replace(
    /\.paper\s*\{\s*width:\s*175mm[\s\S]*?box-shadow:\s*none\s*!important;\s*\}/,
    '.paper { width: 800px !important; max-width: 800px !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; background: #fff !important; }'
);
content = content.replace(
    /const opt = \{\s*margin:\s*\[15,\s*15,\s*15,\s*20\],\s*filename:\s*'giao_an\.pdf',\s*image:\s*\{\s*type:\s*'jpeg',\s*quality:\s*0\.98\s*\},\s*html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false\s*,\s*windowWidth:\s*1024,\s*scrollX:\s*0,\s*scrollY:\s*0\s*\},/g,
    `const opt = {\n    margin: [15, 15, 15, 20],\n    filename: 'giao_an.pdf',\n    image: { type: 'jpeg', quality: 0.98 },\n    html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800, width: 800, scrollX: 0, scrollY: 0 },`
);


// 2. Fix exportPdf
// Find the exact block in exportPdf to replace
const cssRegex = /\.paper\s*\{\s*width:\s*175mm\s*!important;\s*max-width:\s*175mm\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*0\s*!important;\s*border:\s*0\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#ffffff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\}/;
content = content.replace(
    cssRegex,
    `.paper { width: 800px !important; max-width: 800px !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; border: none !important; box-shadow: none !important; background: #fff !important; font-family: 'Times New Roman', Times, serif !important; }`
);

content = content.replace(
    /html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false\s*,\s*windowWidth:\s*1200,\s*scrollX:\s*0,\s*scrollY:\s*0\s*\}/g,
    `html2canvas: {\n      scale: 2,\n      useCORS: true,\n      logging: false,\n      windowWidth: 800,\n      width: 800,\n      scrollX: 0,\n      scrollY: 0\n    }`
);

fs.writeFileSync('views/app.ejs', content);
console.log("Applied PERFECT pdf logic");
