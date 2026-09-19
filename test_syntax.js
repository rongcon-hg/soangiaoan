const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');

const match = content.match(/<iframe id="plannerFrame" srcdoc="([\s\S]*?)"/);
if (match) {
    let srcdoc = match[1];
    // Decod html entities
    srcdoc = srcdoc.replace(/&quot;/g, '"');
    srcdoc = srcdoc.replace(/&lt;/g, '<');
    srcdoc = srcdoc.replace(/&gt;/g, '>');
    srcdoc = srcdoc.replace(/&amp;/g, '&');
    
    // Extract script tags
    const scriptMatches = srcdoc.match(/<script>([\s\S]*?)<\/script>/g);
    if (scriptMatches) {
        scriptMatches.forEach((scriptTag, index) => {
            const code = scriptTag.replace(/<\/?script>/g, '');
            try {
                // Wrap in async function since it might have top-level await if it was a module, but this is a standard script
                new Function(code);
                console.log(`Script ${index} is OK`);
            } catch (e) {
                console.log(`Script ${index} error: ${e.message}`);
            }
        });
    }
}
