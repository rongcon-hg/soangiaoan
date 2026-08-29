const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// 1. Fix renderWeeklySlots to add IDs wd0, cp0, etc.
const oldRender = `<select class="weekday" onchange="updateWeeklyCheck()">`;
const newRender = `<select class="weekday" id="wd\${i}" onchange="updateWeeklyCheck()">`;
if (txt.includes(oldRender)) {
    txt = txt.replace(new RegExp(oldRender.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newRender);
}

const oldInput = `<input class="periods" type="number" min="1" max="10" value="\${old[i]?.periods||5}" oninput="updateWeeklyCheck()">`;
const newInput = `<input class="periods" id="cp\${i}" type="number" min="1" max="10" value="\${old[i]?.periods||5}" oninput="updateWeeklyCheck()">`;
if (txt.includes(oldInput)) {
    txt = txt.replace(new RegExp(oldInput.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newInput);
} else {
    // try looser
    txt = txt.replace(/<input class="periods" type="number" min="1" max="10" value="\$\{old\[i\]\?\.periods\|\|5\}" oninput="updateWeeklyCheck\(\)">/g, newInput);
}

// 2. Fix saveStateToBackend to use weeklyCount if slotCount is null
const oldSave = `slotCount: document.getElementById("slotCount").value,`;
const newSave = `slotCount: (document.getElementById("weeklyCount")||document.getElementById("slotCount")).value,`;
if (txt.includes(oldSave)) {
    txt = txt.replace(oldSave, newSave);
}

// 3. Fix LOAD_PROJECT_STATE to use weeklyCount
const oldLoadCount = `document.getElementById("slotCount").value = payload.scheduleSettings.slotCount;`;
const newLoadCount = `(document.getElementById("weeklyCount")||document.getElementById("slotCount")).value = payload.scheduleSettings.slotCount;`;
if (txt.includes(oldLoadCount)) {
    txt = txt.replace(oldLoadCount, newLoadCount);
}

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched weekly config sync!");
