const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf-8');

const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptMatches) {
    scriptMatches.forEach((scriptTag, index) => {
        // Only test the last one which is the main script
        if(index === scriptMatches.length - 1) {
            const code = scriptTag.replace(/<\/?script>/g, '');
            console.log(`Evaluating main script...`);
            try {
                eval(`(function(){${code}})`);
                console.log("Main script is OK");
            } catch(e) {
                console.log("Error evaluating main script: ", e.message);
                const lines = code.split('\n');
                console.log("First few lines: " + lines.slice(0, 5).join('\n'));
            }
        }
    });
}
