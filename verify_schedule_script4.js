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

        try {
            new Function(script);
            console.log("scheduleFrame VALID SYNTAX!");
        } catch(e) {
            console.log("scheduleFrame SYNTAX ERROR:", e.message);
        }
    } else {
        console.log("No &lt;script&gt; found inside srcdoc");
    }
} else {
    console.log("Could not match iframe");
}

const matches2 = txt.match(/<iframe id="plannerFrame"[^>]*srcdoc="([\s\S]*?)"><\/iframe>/);
if (matches2) {
    let srcdoc = matches2[1];
    let scriptMatch = srcdoc.match(/&lt;script&gt;([\s\S]*?)&lt;\/script&gt;/);
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
            console.log("plannerFrame VALID SYNTAX!");
        } catch(e) {
            console.log("plannerFrame SYNTAX ERROR:", e.message);
        }
    } else {
        console.log("No &lt;script&gt; found inside plannerFrame");
    }
} else {
    console.log("Could not match plannerFrame");
}
