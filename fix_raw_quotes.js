const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(/typeof saveStateToBackend === "function"/g, "typeof saveStateToBackend === 'function'");

fs.writeFileSync('views/app.ejs', txt);
console.log("Fixed the raw quotes!");
