const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');
const match = content.match(/srcdoc="([^"]*)"/g);
if (match) {
    match.forEach((srcdoc, i) => {
        console.log(`srcdoc ${i} length: ${srcdoc.length}`);
    });
} else {
    console.log("No srcdoc matched. The file might be corrupted!");
}
