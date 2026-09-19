const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');

const iframeMatch = content.match(/<iframe id="plannerFrame" srcdoc="/);
if (!iframeMatch) {
    console.log("iframe not found");
    process.exit(1);
}

let startIndex = iframeMatch.index + iframeMatch[0].length;
let endIndex = -1;
for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '"') {
        endIndex = i;
        break;
    }
}

if (endIndex !== -1) {
    console.log("First unescaped quote at offset:", endIndex);
    const snippetContext = content.substring(endIndex - 50, endIndex + 50);
    console.log("Context:\n", snippetContext);
} else {
    console.log("No unescaped quote found.");
}
