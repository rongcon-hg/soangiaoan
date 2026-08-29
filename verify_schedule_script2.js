const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');

const idIndex = txt.indexOf('scheduleFrame');
const srcdocIndex = txt.indexOf('srcdoc="', idIndex);
const srcdocEnd = txt.lastIndexOf('"></iframe>', txt.indexOf('plannerFrame'));

const srcdocContent = txt.substring(srcdocIndex + 8, srcdocEnd);

// Find the script tag
const scriptStart = srcdocContent.indexOf('<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script><script>');
console.log(scriptStart);
const actualScriptStart = srcdocContent.indexOf('<script>', scriptStart + 10);
const scriptEnd = srcdocContent.lastIndexOf('</script>');

if (actualScriptStart !== -1 && scriptEnd !== -1) {
    let script = srcdocContent.substring(actualScriptStart + 8, scriptEnd);
    
    // Decode HTML entities
    script = script.replace(/&quot;/g, '"');
    script = script.replace(/&lt;/g, '<');
    script = script.replace(/&gt;/g, '>');
    script = script.replace(/&amp;/g, '&');
    script = script.replace(/&#x27;/g, "'");
    script = script.replace(/&#39;/g, "'");

    try {
        new Function(script);
        console.log("scheduleFrame script syntax is VALID!");
    } catch (e) {
        console.error("Syntax ERROR in scheduleFrame:", e.message);
        const lines = script.split('\n');
        // print a few lines around the error if possible
    }
} else {
    console.log("Could not find script tag in scheduleFrame");
}
