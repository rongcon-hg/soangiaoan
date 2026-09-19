const fs = require('fs');
const jsdom = require('jsdom');
const acorn = require('acorn');

const content = fs.readFileSync('views/app.ejs', 'utf-8');
const iframeMatch = content.match(/<iframe id="plannerFrame" srcdoc="([^"]*)">/);
if (!iframeMatch) {
    console.log("Could not extract srcdoc!");
    process.exit(1);
}

let srcdoc = iframeMatch[1];
// Unescape html entities to get the raw HTML
srcdoc = srcdoc.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

const dom = new jsdom.JSDOM(srcdoc);
const scripts = dom.window.document.querySelectorAll('script');

scripts.forEach((script, idx) => {
    if (script.textContent) {
        try {
            acorn.parse(script.textContent, { ecmaVersion: 2020 });
            console.log(`Script ${idx} is valid.`);
        } catch (e) {
            console.log(`Script ${idx} has error:`, e.message);
            // Print the line where error occurred
            const lines = script.textContent.split('\n');
            const errLine = lines[e.loc.line - 1];
            console.log("Error line:", errLine);
        }
    }
});
