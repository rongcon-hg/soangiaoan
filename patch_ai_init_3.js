const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex = /function loadAISettings\(\)\{[\s\S]*?const key=\(window\.parent\.GEMINI_KEY \|\| ""\)\|\|&quot;&quot;;[\s\S]*?let model=\(window\.parent\.GEMINI_MODEL \|\| "gemini-1\.5-flash"\)\|\|&quot;gemini-3\.7-flash&quot;;/;

const newLoad = `function loadAISettings(){
  const key=window.parent.GEMINI_KEY || localStorage.getItem(&quot;giaoan_gemini_key&quot;) || &quot;&quot;;
  let model=window.parent.GEMINI_MODEL || localStorage.getItem(&quot;giaoan_gemini_model&quot;) || &quot;gemini-3.7-flash&quot;;`;

if (regex.test(txt)) {
    txt = txt.replace(regex, newLoad);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched loadAISettings successfully with &quot;!");
} else {
    console.log("Still failed to match loadAISettings");
}
