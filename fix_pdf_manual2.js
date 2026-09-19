const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Use a regex that is flexible about quotes and whitespace
const badRegex = /\.paper\s*\{\s*width:\s*210mm[\s\S]*?font-size:\s*12pt\s*!important;/;
const goodString = `.paper {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 20mm 15mm 20mm 20mm !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-family: 'Times New Roman', Times, serif !important;
    }
    .paper-inner { font-size: 12pt !important;`; // wait, I don't need .paper-inner, I just need to keep font-size on .paper if it had it.

// Let's just find the index of `.paper { width: 210mm !important; max-width: 210mm !important; min-height: auto` and delete the redundant lines.
content = content.replace(
    /\.paper\s*\{\s*width:\s*210mm\s*!important;\s*max-width:\s*210mm\s*!important;\s*min-height:\s*auto\s*!important;\s*margin:\s*0\s*!important;\s*padding:\s*20mm\s*15mm\s*20mm\s*20mm\s*!important;\s*border:\s*0\s*!important;\s*box-shadow:\s*none\s*!important;\s*background:\s*#ffffff\s*!important;\s*font-family:\s*'Times New Roman',\s*Times,\s*serif\s*!important;\s*\}([\s\S]*?)font-size:\s*12pt\s*!important;/,
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
      font-size: 12pt !important;`
);

fs.writeFileSync('views/app.ejs', content);
console.log("Replaced bad lines");
