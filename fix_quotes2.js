const fs = require('fs');

let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Find runRubricAI boundaries
let startIndex = content.indexOf('async function runRubricAI() {');
let endIndex = content.indexOf('async function runSlideAI() {', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    let snippet = content.substring(startIndex, endIndex);
    
    // Replace all double quotes with single quotes inside this snippet!
    snippet = snippet.replace(/"/g, "'");

    content = content.substring(0, startIndex) + snippet + content.substring(endIndex);

    fs.writeFileSync('views/app.ejs', content);
    console.log("Fixed double quotes in runRubricAI and runErrorAI!");
} else {
    console.log("Could not find boundaries.");
}
