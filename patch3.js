const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(/localStorage\.getItem\(&quot;giaoan_gemini_key&quot;\)/g, '(window.parent.GEMINI_KEY || "")');
txt = txt.replace(/localStorage\.getItem\(&quot;giaoan_gemini_model&quot;\)/g, '(window.parent.GEMINI_MODEL || "gemini-1.5-flash")');

txt = txt.replace('checkAuth();', 'checkAuth().then(u => { if(u) { window.GEMINI_KEY = u.gemini_key; window.GEMINI_MODEL = u.gemini_model; } });');

fs.writeFileSync('views/app.ejs', txt);
console.log('Fixed Gemini key access');
