const fs = require('fs');
const content = fs.readFileSync('views/app.ejs', 'utf8');
const scripts = content.match(/&lt;script&gt;([\s\S]*?)&lt;\/script&gt;/g);
if (scripts) {
    scripts.forEach((s, i) => {
        let code = s.replace(/&lt;script&gt;/, '').replace(/&lt;\/script&gt;/, '');
        code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
        // FIX the test parser so it doesn't break on the esc/escapeHtml quotes:
        code = code.replace(/'"':"""/g, '\'"\':"\\""');
        fs.writeFileSync(`script${i}.js`, code);
    });
}
