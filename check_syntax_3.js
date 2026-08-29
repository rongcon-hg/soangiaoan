const fs = require('fs');
const vm = require('vm');

const txt = fs.readFileSync('views/app.ejs', 'utf8');
const idIndex = txt.indexOf('id="scheduleFrame"');
const srcdocIndex = txt.indexOf('srcdoc="', idIndex);
const srcdocEnd = txt.lastIndexOf('"></iframe>', txt.indexOf('id="plannerFrame"'));

let unescaped = txt.substring(srcdocIndex + 8, srcdocEnd)
    .replace(/&#34;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'");

const scriptMatch = unescaped.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const script = scriptMatch[1];
    try {
        new vm.Script(script);
        console.log("Syntax OK");
    } catch (e) {
        console.error("Syntax Error in Iframe Script:");
        console.log(e.message);
        const lines = script.split('\n');
        const loc = e.loc || { line: parseInt((e.stack.match(/<anonymous>:(\d+)/)||[])[1]||'0') };
        const line = loc.line - 1;
        console.log("Around line", line + 1);
        console.log(lines.slice(Math.max(0, line - 3), line + 3).join('\n'));
    }
}
