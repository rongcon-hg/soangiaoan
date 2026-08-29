const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const targetHeader = "'Content-Range': 'bytes ' + start + '-' + (end - 1) + '/' + file.size";
const replacementHeader = targetHeader + ",\n                             'Content-Type': 'application/octet-stream'";

if (txt.includes(targetHeader) && !txt.includes("'Content-Type': 'application/octet-stream'")) {
    txt = txt.replace(targetHeader, replacementHeader);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched Content-Type in app.ejs chunk fetch");
} else {
    console.log("Target not found or already patched.");
}
