const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');

const matches = txt.match(/<iframe id="scheduleFrame"[^>]*srcdoc="([\s\S]*?)"><\/iframe>/);
if (matches) {
    let srcdoc = matches[1];
    let scriptMatch = srcdoc.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
        let script = scriptMatch[1];
        script = script.replace(/&quot;/g, '"')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&#x27;/g, "'")
                       .replace(/&#39;/g, "'");

        try {
            new Function(script);
            console.log("VALID SYNTAX!");
        } catch(e) {
            console.log("SYNTAX ERROR:", e.message);
        }
    } else {
        console.log("No script found inside srcdoc");
    }
} else {
    console.log("Could not match iframe");
}
