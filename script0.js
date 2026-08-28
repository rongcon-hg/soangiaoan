
    injectLayout('projects', 'Soạn Giáo án');

function switchTab(step) {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  if(step1) step1.style.display = step === 1 ? "block" : "none";
  if(step2) step2.style.display = step === 2 ? "block" : "none";
  
  const pills = document.querySelectorAll(".step-pill");
  if(pills.length >= 2) {
    if(step === 1) {
      pills[0].style.background = "#fff";
      pills[0].style.color = "#16469d";
      pills[0].style.borderColor = "#fff";
      
      pills[1].style.background = "rgba(255,255,255,.14)";
      pills[1].style.color = "#fff";
      pills[1].style.borderColor = "rgba(255,255,255,.32)";
    } else {
      pills[1].style.background = "#fff";
      pills[1].style.color = "#16469d";
      pills[1].style.borderColor = "#fff";
      
      pills[0].style.background = "rgba(255,255,255,.14)";
      pills[0].style.color = "#fff";
      pills[0].style.borderColor = "rgba(255,255,255,.32)";
    }
  }
}

// Make pills clickable
document.addEventListener("DOMContentLoaded", () => {
    const pills = document.querySelectorAll(".step-pill");
    if(pills.length >= 2) {
        pills[0].style.cursor = "pointer";
        pills[1].style.cursor = "pointer";
        pills[0].onclick = () => switchTab(1);
        pills[1].onclick = () => switchTab(2);
    }
    switchTab(1);
});

// Update the event listener to switch tab instead of scrolling

    
    let currentProject = null;
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');

    checkAuth().then(async u => { 
        if(!u) return;
        window.GEMINI_KEY = u.gemini_api_key || u.admin_gemini_api_key; 
        window.GEMINI_MODEL = u.gemini_model || "gemini-1.5-pro"; 

        // Update plannerFrame AI settings
        const pf = document.getElementById("plannerFrame");
        if(pf && pf.contentWindow && pf.contentWindow.loadAISettings) {
            pf.contentWindow.loadAISettings();
        }

        if(projectId) {
            try {
                const res = await fetch(API_URL + '/projects/' + projectId, { headers: getHeaders() });
                if(res.ok) {
                    currentProject = await res.json();
                    
                    const iframe = document.getElementById("scheduleFrame");
                    const sendData = () => {
                        if(currentProject.program_data) {
                            iframe.contentWindow.postMessage({
                                type: "LOAD_PROJECT_STATE",
                                payload: currentProject.program_data
                            }, "*");
                        }
                    };
                    
                    iframe.addEventListener('load', sendData);
                    sendData();
                }
            } catch(e) {
                console.error("Failed to load project", e);
            }
        }
    });

window.addEventListener("message", async e => {
  if(e.data?.type === "SAVE_PROJECT_STATE" && projectId && currentProject) {
      try {
          await fetch(API_URL + '/projects/' + projectId, {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify({
                  name: e.data.payload?.courseInfo?.name || currentProject.name,
                  course_code: e.data.payload?.courseInfo?.code || currentProject.course_code,
                  total_hours: e.data.payload?.courseInfo?.total || currentProject.total_hours,
                  program_data: e.data.payload
              })
          });
          console.log("Đã lưu trạng thái vào CSDL");
      } catch(err) {
          console.error("Lỗi lưu trạng thái", err);
      }
  }

  if(e.data?.type==="OPEN_LESSON_PLAN_FROM_SCHEDULE"){
    const p=e.data.payload||{};
    const st=document.getElementById("transferStatus");
    st.style.display="block";
    st.innerHTML=`Đã chọn <b>${p.courseName||""} – ${p.courseCode||""}</b> · ${p.weekday||""} ${p.date||""} · ${p.periods||0} tiết.`;
    
    // Check if lesson exists in DB
    try {
        if(projectId) {
            const res = await fetch(API_URL + '/projects/' + projectId + '/lessons/' + p.scheduleTT, { headers: getHeaders() });
            const saved = await res.json();
            if(saved && saved.lesson_data) {
                p.savedLesson = saved.lesson_data;
                st.innerHTML += " <b>(Đã tải giáo án cũ)</b>";
            }
        }
    } catch(err) { console.error(err); }

    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    if(typeof switchTab === 'function') switchTab(2);
  }

  if(e.data?.type === "SAVE_LESSON_PLAN" && projectId) {
      try {
          const res = await fetch(API_URL + '/projects/' + projectId + '/lessons/' + e.data.payload.tt, {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ lesson_data: e.data.payload.data })
          });
          if(res.ok) alert("Đã lưu giáo án thành công vào CSDL!");
          else alert("Lỗi khi lưu giáo án.");
      } catch(err) {
          console.error(err);
          alert("Lỗi mạng khi lưu giáo án.");
      }
  }
});
