const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex = /function loadAISettings\(\)\{[\s\S]*?const key=\(window\.parent\.GEMINI_KEY \|\| ""\)\|\|"";[\s\S]*?let model=\(window\.parent\.GEMINI_MODEL \|\| "gemini-1\.5-flash"\)\|\|"gemini-3\.7-flash";/;

const newLoad = `function loadAISettings(){
  const key=window.parent.GEMINI_KEY || localStorage.getItem("giaoan_gemini_key") || "";
  let model=window.parent.GEMINI_MODEL || localStorage.getItem("giaoan_gemini_model") || "gemini-3.7-flash";`;

if (regex.test(txt)) {
    txt = txt.replace(regex, newLoad);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched loadAISettings successfully!");
} else {
    console.log("Failed to match loadAISettings");
}
