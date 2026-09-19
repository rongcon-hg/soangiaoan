const ejs = require('ejs');
const fs = require('fs');

const template = fs.readFileSync('views/app.ejs', 'utf-8');
try {
    ejs.compile(template);
    console.log("EJS compilation successful");
} catch(e) {
    console.log("EJS compilation error: " + e.message);
}
