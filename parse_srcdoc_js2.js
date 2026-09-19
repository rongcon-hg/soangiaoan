const fs = require('fs');
const jsdom = require('jsdom');

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
            // Using Function constructor to check syntax
            new Function(script.textContent);
            console.log(`Script ${idx} is valid.`);
        } catch (e) {
            console.log(`Script ${idx} has error:`, e.message);
            console.log("Error details:", e);
        }
    }
});
