const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');

const idIndex = txt.indexOf('id="scheduleFrame"');
const srcdocIndex = txt.indexOf('srcdoc="', idIndex);
const srcdocEnd = txt.lastIndexOf('"></iframe>', txt.indexOf('id="plannerFrame"'));

const srcdocContent = txt.substring(srcdocIndex + 8, srcdocEnd);

// Find all raw double quotes
let rawQuotes = [];
for (let i = 0; i < srcdocContent.length; i++) {
    if (srcdocContent[i] === '"') {
        rawQuotes.push({
            index: i,
            context: srcdocContent.substring(Math.max(0, i - 30), Math.min(srcdocContent.length, i + 30))
        });
    }
}

console.log("Found", rawQuotes.length, "raw double quotes");
if (rawQuotes.length > 0) {
    console.log("First 10:");
    rawQuotes.slice(0, 10).forEach(q => console.log(q.context));
}
