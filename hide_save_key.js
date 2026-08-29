const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regexSaveKey = /(&lt;div&gt;\s*&lt;label&gt;Lưu khóa trên máy[\s\S]*?&lt;\/select&gt;\s*&lt;\/div&gt;)/;
txt = txt.replace(regexSaveKey, '&lt;div style=&quot;display:none&quot;&gt;$1&lt;/div&gt;');

fs.writeFileSync('views/app.ejs', txt);
console.log("Hidden Save Key block!");
