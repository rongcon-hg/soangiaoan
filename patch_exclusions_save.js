const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const targetAdd = /function addExclusion\(\)\{[\s\S]*?renderExclusions\(\);\s*\}/;
const targetRemove = /function removeExclusion\(idx\)\{[\s\S]*?renderExclusions\(\);\s*\}/;

txt = txt.replace(targetAdd, match => match.replace(/renderExclusions\(\);\s*\}/, "renderExclusions(); if(typeof saveStateToBackend === 'function') saveStateToBackend(); }"));
txt = txt.replace(targetRemove, match => match.replace(/renderExclusions\(\);\s*\}/, "renderExclusions(); if(typeof saveStateToBackend === 'function') saveStateToBackend(); }"));

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched exclusions to save state!");
