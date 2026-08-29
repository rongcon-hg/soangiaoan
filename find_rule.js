const fs = require('fs');
const txt = fs.readFileSync('views/app.ejs', 'utf8');
const i = txt.indexOf('Quy tắc');
if (i !== -1) {
    console.log(txt.substring(i - 50, i + 100));
} else {
    console.log('Not found');
}
