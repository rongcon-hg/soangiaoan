const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');
const srcdocMatch = content.match(/srcdoc="([^"]*)"/g);
if (srcdocMatch) {
    srcdocMatch.forEach((srcdoc, i) => {
        console.log(`srcdoc ${i} length: ${srcdoc.length}`);
    });
}
