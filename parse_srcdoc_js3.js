const fs = require('fs');
const jsdom = require('jsdom');

const content = fs.readFileSync('views/app.ejs', 'utf-8');
const iframeMatch = content.match(/<iframe id="plannerFrame" srcdoc="([^"]*)">/);
if (!iframeMatch) {
    console.log("Could not extract srcdoc!");
    process.exit(1);
}

let srcdoc = iframeMatch[1];
srcdoc = srcdoc.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

const dom = new jsdom.JSDOM(srcdoc);
const scripts = dom.window.document.querySelectorAll('script');
fs.writeFileSync('script3.js', scripts[3].textContent);
