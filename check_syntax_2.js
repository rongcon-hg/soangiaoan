const fs = require('fs');
const vm = require('vm');

const txt = fs.readFileSync('views/app.ejs', 'utf8');
const idIndex = txt.indexOf('id="scheduleFrame"');
const srcdocIndex = txt.indexOf('srcdoc="', idIndex);
const srcdocEnd = txt.indexOf('"></iframe>', srcdocIndex);

let unescaped = txt.substring(srcdocIndex + 8, srcdocEnd)
    .replace(/&#34;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'");

const scriptStarts = [...unescaped.matchAll(/<script>/g)].map(m => m.index);
const scriptEnds = [...unescaped.matchAll(/<\/script>/g)].map(m => m.index);

if (scriptStarts.length > 0) {
    const script = unescaped.substring(scriptStarts[0] + 8, scriptEnds[0]);
    try {
        new vm.Script(script);
        console.log("Syntax OK");
    } catch (e) {
        console.error("Syntax Error in Iframe Script:");
        console.error(e);
        
        // Print the lines around the error
        const lines = script.split('\n');
        const line = e.loc ? e.loc.line - 1 : 0;
        console.log("Around line", line + 1);
        console.log(lines.slice(Math.max(0, line - 3), line + 3).join('\n'));
    }
}
