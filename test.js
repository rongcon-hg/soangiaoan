const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf8');
const scripts = content.match(/<script>([\s\S]*?)<\/script>/g);
if (scripts) {
    scripts.forEach((s, i) => {
        let code = s.replace(/<script>/, '').replace(/<\/script>/, '');
        code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
        fs.writeFileSync(`script${i}.js`, code);
    });
}
