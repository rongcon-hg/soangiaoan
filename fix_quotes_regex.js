const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex = /(let currentSessions = \[\];\n)([\s\S]*?)(function conversionSummary\(\))/;
const match = txt.match(regex);
if (match) {
    const fixedBlock = match[2].replace(/"/g, '&quot;');
    txt = txt.replace(match[0], match[1] + fixedBlock + match[3]);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Fixed quotes using regex!");
} else {
    console.log("Failed to match regex");
}
