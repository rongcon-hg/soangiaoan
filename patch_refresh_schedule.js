const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldFunc = `function refreshScheduleAfterCalendarChange(){
  updateWeeklyCheck();
  if(currentSessions.length) generateSchedule();
}`;

const newFunc = `function refreshScheduleAfterCalendarChange(){
  updateWeeklyCheck();
  if(currentSessions.length) generateSchedule();
  if(typeof saveStateToBackend === 'function') saveStateToBackend();
}`;

if (txt.includes(oldFunc)) {
    txt = txt.replace(oldFunc, newFunc);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched refreshScheduleAfterCalendarChange!");
} else {
    // maybe formatted differently
    const regex = /(function refreshScheduleAfterCalendarChange\(\)\s*\{[\s\S]*?)(^\})/m;
    const match = txt.match(regex);
    if(match) {
        txt = txt.replace(regex, `$1  if(typeof saveStateToBackend === 'function') saveStateToBackend();\n$2`);
        fs.writeFileSync('views/app.ejs', txt);
        console.log("Patched via regex!");
    } else {
        console.log("Failed to match!");
    }
}
