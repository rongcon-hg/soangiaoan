const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');

const matches = txt.match(/<iframe id="scheduleFrame"[^>]*srcdoc="([\s\S]*?)"><\/iframe>/);
if (matches) {
    let srcdoc = matches[1];
    let scriptMatch = srcdoc.match(/&lt;script&gt;([\s\S]*?)&lt;\/script&gt;/);
    if (scriptMatch) {
        let script = scriptMatch[1];
        script = script.replace(/&quot;/g, '"')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&#x27;/g, "'")
                       .replace(/&#39;/g, "'");

        fs.writeFileSync('debug_script.js', script);
        console.log("Script dumped to debug_script.js");
    }
}
