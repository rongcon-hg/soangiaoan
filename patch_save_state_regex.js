const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex = /(updateWeeklyCheck\(\);\s*)(}catch\(e\)\{)/;
if (regex.test(txt)) {
    txt = txt.replace(regex, '$1if(typeof saveStateToBackend === "function") saveStateToBackend();\n $2');
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Added saveStateToBackend to readProgramFile via regex!");
} else {
    console.log("Could not find the target with regex.");
}
