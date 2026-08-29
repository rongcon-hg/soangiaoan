const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regex = /<script>\s*injectLayout\('projects',\s*'Soạn Giáo án'\);\s*checkAuth\(\)\.then\(u\s*=>\s*{\s*if\(u\)\s*{\s*window\.GEMINI_KEY\s*=\s*u\.gemini_key;\s*window\.GEMINI_MODEL\s*=\s*u\.gemini_model;\s*}\s*}\);\s*window\.addEventListener\("message",\s*e\s*=>\s*{[\s\S]*?\}\);\s*<\/script>/;

const match = txt.match(regex);
if (match) {
    const newScript = `<script>
    injectLayout('projects', 'Soạn Giáo án');
    
    let currentProject = null;
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');

    checkAuth().then(async u => { 
        if(!u) return;
        window.GEMINI_KEY = u.gemini_key; 
        window.GEMINI_MODEL = u.gemini_model; 

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
    st.innerHTML=\`Đã chọn <b>\${p.courseName||""} – \${p.courseCode||""}</b> · \${p.weekday||""} \${p.date||""} · \${p.periods||0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.\`;
    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    setTimeout(()=>document.getElementById("step2").scrollIntoView({behavior:"smooth",block:"start"}),150);
  }
});
</script>`;

    txt = txt.replace(match[0], newScript);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched parent script successfully!");
} else {
    console.log("Failed to match the parent script with regex.");
}
