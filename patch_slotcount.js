const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex1 = /slotCount: document\.getElementById\(&quot;slotCount&quot;\)\.value/g;
const regex1b = /slotCount: document\.getElementById\("slotCount"\)\.value/g;

txt = txt.replace(regex1, 'slotCount: document.getElementById(&quot;weeklyCount&quot;).value');
txt = txt.replace(regex1b, 'slotCount: document.getElementById("weeklyCount").value');

const regex2 = /document\.getElementById\(&quot;slotCount&quot;\)\.value = payload\.scheduleSettings\.slotCount/g;
const regex2b = /document\.getElementById\("slotCount"\)\.value = payload\.scheduleSettings\.slotCount/g;

txt = txt.replace(regex2, 'document.getElementById(&quot;weeklyCount&quot;).value = payload.scheduleSettings.slotCount');
txt = txt.replace(regex2b, 'document.getElementById("weeklyCount").value = payload.scheduleSettings.slotCount');

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched saveStateToBackend to use weeklyCount");
