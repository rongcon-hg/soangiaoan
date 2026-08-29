const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// The iframe srcdoc script injection
const injectScript = `
function saveStateToBackend() {
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
            displaySessionItems(currentSessions);
        } else {
            updateWeeklyCheck();
        }
        
        const status = document.getElementById("fileStatus");
        status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;
    }
});
`;

txt = txt.replace('let currentSessions = [];', 'let currentSessions = [];\n' + injectScript);

// Now patch refreshScheduleAfterCalendarChange to call saveStateToBackend
txt = txt.replace(
    'function refreshScheduleAfterCalendarChange(){',
    'function refreshScheduleAfterCalendarChange(){ saveStateToBackend();'
);

// Patch updateWeeklyCheck so when generating, it saves state
txt = txt.replace(
    'displaySessionItems(currentSessions);',
    'displaySessionItems(currentSessions); saveStateToBackend();'
);

// Patch readProgramFile to call saveStateToBackend
txt = txt.replace(
    'updateWeeklyCheck();\n }catch(e){',
    'updateWeeklyCheck(); saveStateToBackend();\n }catch(e){'
);

// Patch readProgramFile to upload DOCX to Google Drive in the background
const uploadScript = `
     const rawResult=await mammoth.extractRawText({arrayBuffer:buf.slice(0)});
     
     // Upload background
     if(window.parent.localStorage.getItem('token')) {
         const formData = new FormData();
         formData.append("file", file);
         fetch('/api/drive/upload', {
             method: 'POST',
             headers: { 'Authorization': 'Bearer ' + window.parent.localStorage.getItem('token') },
             body: formData
         }).catch(err => console.error(err));
     }
`;

txt = txt.replace('const rawResult=await mammoth.extractRawText({arrayBuffer:buf.slice(0)});', uploadScript);

fs.writeFileSync('views/app.ejs', txt);
console.log('Patched scheduleFrame inside app.ejs');
