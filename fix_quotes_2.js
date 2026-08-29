const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const brokenCode1 = `function saveStateToBackend() {
    const scheduleSettings = {
        startDate: document.getElementById("startDate").value,
        slotCount: document.getElementById("slotCount").value,
        slots: []
    };
    for(let i = 0; i < Number(scheduleSettings.slotCount||0); i++) {
        const wd = document.getElementById("wd"+i);
        const cp = document.getElementById("cp"+i);
        if(wd && cp) {
            scheduleSettings.slots.push({ weekday: wd.value, periods: cp.value });
        }
    }
    
    const payload = {
        courseInfo: course,
        syllabus: lessons,
        programSequence: programSequence,
        exclusions: exclusions,
        scheduleSettings: scheduleSettings,
        generatedSchedule: currentSessions
    };
    
    window.parent.postMessage({
        type: "SAVE_PROJECT_STATE",
        payload: payload
    }, "*");
}

window.addEventListener("message", e => {
    if (e.data?.type === "LOAD_PROJECT_STATE") {
        const payload = e.data.payload;
        if (!payload) return;
        
        if (payload.courseInfo) course = payload.courseInfo;
        if (payload.syllabus) lessons = payload.syllabus;
        if (payload.programSequence) programSequence = payload.programSequence;
        if (payload.exclusions) exclusions = payload.exclusions;
        if (payload.generatedSchedule) currentSessions = payload.generatedSchedule;
        
        // Restore scheduleConfig
        if (payload.scheduleSettings) {
            if(payload.scheduleSettings.startDate) document.getElementById("startDate").value = payload.scheduleSettings.startDate;
            if(payload.scheduleSettings.slotCount) {
                document.getElementById("slotCount").value = payload.scheduleSettings.slotCount;
                renderWeeklySlots(); // render inputs
                // Now fill the values
                payload.scheduleSettings.slots.forEach((s, idx) => {
                    const wd = document.getElementById("wd"+idx);
                    const cp = document.getElementById("cp"+idx);
                    if (wd) wd.value = s.weekday;
                    if (cp) cp.value = s.periods;
                });
            }
        }
        
        updateCourseCards();
        renderConversionPreview();
        renderExclusions();
        
        if (currentSessions && currentSessions.length > 0) {
            // Restore UI for currentSessions by calling buildSchedule
            // But wait, buildSchedule reads the DOM for inputs!
            // The inputs were populated above.
            setTimeout(() => {
                buildSchedule();
            }, 100);
        } else {
            updateWeeklyCheck();
        }
        
        const status = document.getElementById("fileStatus");
        status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;
    }
});`;

if (txt.includes(brokenCode1)) {
    txt = txt.replace(brokenCode1, brokenCode1.replace(/"/g, '&quot;'));
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Fixed the broken double quotes in load/save state!");
} else {
    console.log("Could not find the load/save broken block.");
}
