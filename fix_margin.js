const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

content = content.replace(
    /const opt = \{\s*margin:\s*\[15,\s*15,\s*15,\s*20\],\s*filename:\s*filename,\s*image:\s*\{\s*type:\s*&quot;jpeg&quot;,\s*quality:\s*0\.98\s*\}/,
    `const opt = {\n    margin: [15, 12, 15, 15],\n    filename: filename,\n    image: { type: &quot;jpeg&quot;, quality: 0.98 }`
);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed margin");
