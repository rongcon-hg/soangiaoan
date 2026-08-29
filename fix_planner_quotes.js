const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(/<span style="display:none">Gemini API key/g, "<span style='display:none'>Gemini API key");
txt = txt.replace(/\(window\.parent\.GEMINI_KEY \|\| ""\)/g, "(window.parent.GEMINI_KEY || '')");
txt = txt.replace(/\(window\.parent\.GEMINI_MODEL \|\| "gemini-1\.5-flash"\)/g, "(window.parent.GEMINI_MODEL || 'gemini-1.5-flash')");

fs.writeFileSync('views/app.ejs', txt);
console.log("Fixed quotes in plannerFrame!");
