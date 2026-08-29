const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// 1. In parent app.ejs, after setting window.GEMINI_KEY, tell plannerFrame to reload
const oldAuth = `        window.GEMINI_KEY = u.gemini_key; 
        window.GEMINI_MODEL = u.gemini_model; 

        if(projectId) {`;

const newAuth = `        window.GEMINI_KEY = u.gemini_key; 
        window.GEMINI_MODEL = u.gemini_model; 
        
        const pf = document.getElementById("plannerFrame");
        if(pf && pf.contentWindow && pf.contentWindow.loadAISettings) {
            pf.contentWindow.loadAISettings();
        }

        if(projectId) {`;

if (txt.includes(oldAuth)) {
    txt = txt.replace(oldAuth, newAuth);
    console.log("Patched checkAuth parent");
} else {
    console.log("Could not find oldAuth");
}

// 2. In plannerFrame, loadAISettings should use localStorage fallback
const oldLoad = `function loadAISettings(){
  const key=(window.parent.GEMINI_KEY || "")||"";
  let model=(window.parent.GEMINI_MODEL || "gemini-1.5-flash")||"gemini-3.7-flash";`;

const newLoad = `function loadAISettings(){
  const key=window.parent.GEMINI_KEY || localStorage.getItem("giaoan_gemini_key") || "";
  let model=window.parent.GEMINI_MODEL || localStorage.getItem("giaoan_gemini_model") || "gemini-3.7-flash";`;

if (txt.includes(oldLoad)) {
    txt = txt.replace(oldLoad, newLoad);
    console.log("Patched loadAISettings");
} else {
    // try a looser match
    const altMatch = /function loadAISettings\(\)\{\s*const key=\(window\.parent\.GEMINI_KEY \|\| ""\)\|\|"";\s*let model=\(window\.parent\.GEMINI_MODEL \|\| "gemini-1\.5-flash"\)\|\|"gemini-3\.7-flash";/;
    if (altMatch.test(txt)) {
        txt = txt.replace(altMatch, newLoad);
        console.log("Patched loadAISettings (regex)");
    } else {
        console.log("Could not find loadAISettings");
    }
}

// Ensure btnSaveAI onclick is properly wired up and actually saves to parent if we want?
// Actually, saving to localStorage is fine, but it would be better if "Lưu cài đặt AI" just worked.
// For now, loadAISettings is the main bug.

fs.writeFileSync('views/app.ejs', txt);
