const fs = require('fs');

let current = fs.readFileSync('views/app.ejs', 'utf-8');
let old = fs.readFileSync('app_2100.ejs', 'utf-8');

// We will extract exportPdfAsBlob and exportPdf from app_2100.ejs
function extractFunction(str, funcName) {
    let startStr = `window.${funcName} = async function() {`;
    let startIndex = str.indexOf(startStr);
    if (startIndex === -1) {
        startStr = `async function ${funcName}()`;
        startIndex = str.indexOf(startStr);
    }
    
    // Find the matching closing brace for the function
    let braceCount = 0;
    let foundFirstBrace = false;
    let endIndex = startIndex;
    for (let i = startIndex; i < str.length; i++) {
        if (str[i] === '{') {
            braceCount++;
            foundFirstBrace = true;
        } else if (str[i] === '}') {
            braceCount--;
        }
        if (foundFirstBrace && braceCount === 0) {
            endIndex = i + 1;
            break;
        }
    }
    return str.substring(startIndex, endIndex);
}

let oldBlob = extractFunction(old, 'exportPdfAsBlob');
let oldPdf = extractFunction(old, 'exportPdf');

let curBlob = extractFunction(current, 'exportPdfAsBlob');
let curPdf = extractFunction(current, 'exportPdf');

// Before replacing, I want to keep the "Đã duyệt/Đã soạn" hiding logic!
// In curPdf, there is logic for removing .export-hide.
// Let's just manually patch current's PDF style and opt!

let newContent = current;

// 1. Revert exportPdfAsBlob
newContent = newContent.replace(
    /\.paper\s*\{\s*width:\s*800px[\s\S]*?box-shadow:\s*none\s*!important;\s*background:\s*#fff\s*!important;\s*\}/,
    '.paper { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }'
);
newContent = newContent.replace(
    /const opt = \{\s*margin:\s*\[15,\s*15,\s*15,\s*20\],\s*filename:\s*'giao_an\.pdf',\s*image:\s*\{\s*type:\s*'jpeg',\s*quality:\s*0\.98\s*\},\s*html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false,\s*windowWidth:\s*800,\s*width:\s*800,\s*scrollX:\s*0,\s*scrollY:\s*0\s*\},/g,
    `const opt = {\n    margin: [15, 20, 15, 20],\n    filename: 'giao_an.pdf',\n    image: { type: 'jpeg', quality: 0.98 },\n    html2canvas: { scale: 2, useCORS: true, logging: false },`
);

// 2. Revert exportPdf
newContent = newContent.replace(
    /\.paper\s*\{\s*width:\s*800px\s*!important;\s*max-width:\s*800px\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*0\s*!important;\s*border:\s*none\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#fff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\}/,
    `.paper {
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-size: 12pt !important;
      color: #000000 !important;
    }`
);

newContent = newContent.replace(
    /html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true,\s*logging:\s*false,\s*windowWidth:\s*800,\s*width:\s*800,\s*scrollX:\s*0,\s*scrollY:\s*0\s*\}/,
    `html2canvas: {\n      scale: 2,\n      useCORS: true,\n      logging: false\n    }`
);

// And margin for exportPdf
newContent = newContent.replace(
    /const opt = \{\s*margin:\s*\[15,\s*15,\s*15,\s*20\],\s*filename:\s*filename,\s*image:\s*\{\s*type:\s*"jpeg",\s*quality:\s*0\.98\s*\}/,
    `const opt = {\n    margin: [15, 12, 15, 15],\n    filename: filename,\n    image: { type: "jpeg", quality: 0.98 }`
);

fs.writeFileSync('views/app.ejs', newContent);
console.log("Reverted to 21:00 state");
