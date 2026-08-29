const fs = require('fs');
const vm = require('vm');

const txt = fs.readFileSync('views/app.ejs', 'utf8');
const srcdocMatch = txt.match(/srcdoc="([\s\S]*?)"/);
if (srcdocMatch) {
    let unescaped = srcdocMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    const scriptMatch = unescaped.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
        try {
            new vm.Script(scriptMatch[1]);
            console.log("Syntax OK");
        } catch (e) {
            console.error("Syntax Error in Iframe Script:");
            console.error(e);
        }
    } else {
        console.log("No script tag found in srcdoc");
    }
} else {
    console.log("No srcdoc found");
}
