const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');

const match = content.match(/<iframe id="plannerFrame" srcdoc="([\s\S]*?)"/);
if (match) {
    let srcdoc = match[1];
    srcdoc = srcdoc.replace(/&quot;/g, '"');
    srcdoc = srcdoc.replace(/&lt;/g, '<');
    srcdoc = srcdoc.replace(/&gt;/g, '>');
    srcdoc = srcdoc.replace(/&amp;/g, '&');
    
    // Extract script tags
    const scriptMatches = srcdoc.match(/<script>([\s\S]*?)<\/script>/g);
    if (scriptMatches) {
        scriptMatches.forEach((scriptTag, index) => {
            const code = scriptTag.replace(/<\/?script>/g, '');
            console.log(`Evaluating script ${index}...`);
            try {
                // simple eval check
                eval(`(function(){${code}})`);
            } catch(e) {
                console.log("Error evaluating script: ", e.message);
            }
        });
    }
}
