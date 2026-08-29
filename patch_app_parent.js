const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldScript = `<script>
    injectLayout('projects', 'Soạn Giáo án');
    checkAuth().then(u => { if(u) { window.GEMINI_KEY = u.gemini_key; window.GEMINI_MODEL = u.gemini_model; } });

window.addEventListener("message",e=>{
  if(e.data?.type==="OPEN_LESSON_PLAN_FROM_SCHEDULE"){
    const p=e.data.payload||{};
    const st=document.getElementById("transferStatus");
    st.style.display="block";
    st.innerHTML=\`Đã chọn <b>\${p.courseName||""} – \${p.courseCode||""}</b> · \${p.weekday||""} \${p.date||""} · \${p.periods||0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.\`;
    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    setTimeout(()=>document.getElementById("step2").scrollIntoView({behavior:"smooth",block:"start"}),150);
  }
});
</script>`;

const newScript = `<script>
    injectLayout('projects', 'Soạn Giáo án');
    
    let currentProject = null;
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');

    checkAuth().then(async u => { 
        if(!u) return;
        window.GEMINI_KEY = u.gemini_key; 
        window.GEMINI_MODEL = u.gemini_model; 

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
                    
                    // Gửi khi iframe đã sẵn sàng
                    iframe.addEventListener('load', sendData);
                    // Hoặc gửi luôn nếu nó đã load xong
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
                  name: currentProject.name,
                  course_code: currentProject.course_code,
                  total_hours: currentProject.total_hours,
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
    st.innerHTML=\`Đã chọn <b>\${p.courseName||""} – \${p.courseCode||""}</b> · \${p.weekday||""} \${p.date||""} · \${p.periods||0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.\`;
    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    setTimeout(()=>document.getElementById("step2").scrollIntoView({behavior:"smooth",block:"start"}),150);
  }
});
</script>`;

txt = txt.replace(oldScript, newScript);
fs.writeFileSync('views/app.ejs', txt);
console.log('Patched app.ejs parent script');
