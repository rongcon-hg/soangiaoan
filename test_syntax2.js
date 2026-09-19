const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');

const match = content.match(/<iframe id="scheduleFrame" srcdoc="([\s\S]*?)"/);
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
                new Function(code);
                console.log(`Schedule Script ${index} is OK`);
            } catch (e) {
                console.log(`Schedule Script ${index} error: ${e.message}`);
                // Print the line with error
                const lines = code.split('\n');
                console.log(lines.slice(0, 10).join('\n'));
            }
        });
    }
}
