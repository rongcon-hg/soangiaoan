const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// Cẩn thận, nếu đã patch rồi thì phải undo hoặc làm sạch.
// Đoạn script tôi đã thêm:
// function saveStateToBackend() ... window.addEventListener("message" ... LOAD_PROJECT_STATE

// Sửa lại LOAD_PROJECT_STATE handler
const oldListener = `        if (currentSessions && currentSessions.length > 0) {
            displaySessionItems(currentSessions);
        } else {
            updateWeeklyCheck();
        }`;
const newListener = `        if (currentSessions && currentSessions.length > 0) {
            // Restore UI for currentSessions by calling buildSchedule
            // But wait, buildSchedule reads the DOM for inputs!
            // The inputs were populated above.
            setTimeout(() => {
                buildSchedule();
            }, 100);
        } else {
            updateWeeklyCheck();
        }`;
txt = txt.replace(oldListener, newListener);

// Cũng có đoạn này bị nhầm:
// displaySessionItems(currentSessions); saveStateToBackend();
// Chắc không có vì replace failed.

// Xóa cái saveStateToBackend ở refreshScheduleAfterCalendarChange
txt = txt.replace(
  'function refreshScheduleAfterCalendarChange(){ saveStateToBackend();',
  'function refreshScheduleAfterCalendarChange(){'
);

// Tìm cuối buildSchedule() để thêm saveStateToBackend
// Trong buildSchedule, khúc cuối là tb.appendChild(tr); }) // end of sessions.forEach
// sau đó là document.getElementById("transferStatus").style.display="none";
const buildScheduleEnd = `  document.getElementById("transferStatus").style.display="none";
}`;
if(txt.includes(buildScheduleEnd)) {
    txt = txt.replace(buildScheduleEnd, `  document.getElementById("transferStatus").style.display="none";\n  saveStateToBackend();\n}`);
} else {
    // try another way
    const bsEnd2 = `document.getElementById("transferStatus").style.display="none";`;
    txt = txt.replace(bsEnd2, `document.getElementById("transferStatus").style.display="none";\n  saveStateToBackend();`);
}

// Cũng nên thêm saveStateToBackend() vào cuối clearExclusions() nếu clearExclusions không gọi buildSchedule
// Actually refreshScheduleAfterCalendarChange calls buildSchedule, which saves state.

fs.writeFileSync('views/app.ejs', txt);
console.log('Fixed iframe patches');
