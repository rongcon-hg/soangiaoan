const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const content = fs.readFileSync('views/app.ejs', 'utf-8');
const match = content.match(/<iframe id="plannerFrame" srcdoc="([\s\S]*?)"/);
if (match) {
    let srcdoc = match[1];
    srcdoc = srcdoc.replace(/&quot;/g, '"');
    srcdoc = srcdoc.replace(/&lt;/g, '<');
    srcdoc = srcdoc.replace(/&gt;/g, '>');
    srcdoc = srcdoc.replace(/&amp;/g, '&');
    
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("jsdomError", (error) => {
        console.error("JSDOM Error:", error.message, error.detail);
    });
    virtualConsole.on("error", (error) => {
        console.error("Console Error:", error);
    });

    const dom = new JSDOM(srcdoc, { runScripts: "dangerously", virtualConsole });
    console.log("JSDOM instantiated.");
}
