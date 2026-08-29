const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const parentScriptAddition = `
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
`;

const oldListener = `  if(e.data?.type==="OPEN_LESSON_PLAN_FROM_SCHEDULE"){
    const p=e.data.payload||{};
    const st=document.getElementById("transferStatus");
    st.style.display="block";
    st.innerHTML=\`Đã chọn <b>\${p.courseName||""} – \${p.courseCode||""}</b> · \${p.weekday||""} \${p.date||""} · \${p.periods||0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.\`;
    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    setTimeout(()=>document.getElementById("step2").scrollIntoView({behavior:"smooth",block:"start"}),150);
  }`;

const newListener = `  if(e.data?.type==="OPEN_LESSON_PLAN_FROM_SCHEDULE"){
    const p=e.data.payload||{};
    const st=document.getElementById("transferStatus");
    st.style.display="block";
    st.innerHTML=\`Đã chọn <b>\${p.courseName||""} – \${p.courseCode||""}</b> · \${p.weekday||""} \${p.date||""} · \${p.periods||0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.\`;
    document.getElementById("plannerFrame").contentWindow.postMessage({type:"LOAD_SCHEDULE_SESSION",payload:p},"*");
    if(typeof switchTab === 'function') switchTab(2);
  }`;

txt = txt.replace(oldListener, newListener);

const oldInject = `injectLayout('projects', 'Soạn Giáo án');`;
const newInject = `injectLayout('projects', 'Soạn Giáo án');\n` + parentScriptAddition;

txt = txt.replace(oldInject, newInject);

fs.writeFileSync('views/app.ejs', txt);
console.log("Added tabs logic successfully!");
