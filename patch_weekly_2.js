const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(/<select class="weekday" onchange="updateWeeklyCheck\(\)">/g, '<select class="weekday" id="wd${i}" onchange="updateWeeklyCheck()">');
txt = txt.replace(/<input class="periods" type="number" min="1" max="10" value="\$\{old\[i\]\?\.periods\|\|5\}" oninput="updateWeeklyCheck\(\)">/g, '<input class="periods" id="cp${i}" type="number" min="1" max="10" value="${old[i]?.periods||5}" oninput="updateWeeklyCheck()">');

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched DOM attributes!");
