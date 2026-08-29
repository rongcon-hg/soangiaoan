const fs = require('fs');
let code = fs.readFileSync('views/app.ejs', 'utf-8');

const newRenderFunc = `
function renderScheduleTable() {
 const tb=document.getElementById("tbody");
 tb.innerHTML="";

 currentSessions.forEach((s,si)=>{
   const c={LT:0,TH:0,KT:0};
   if(s.units) s.units.forEach(x=>c[x.type]++);

   let content="";

   const previousSession = si>0 ? currentSessions[si-1] : null;

   const prevItemsByLesson = new Map();
   if(previousSession){
     (previousSession.units||[]).forEach(u=>{
       if(!prevItemsByLesson.has(u.lesson)) prevItemsByLesson.set(u.lesson,new Set());
       (u.items||[]).forEach(it=>{
         const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
         if(txt) prevItemsByLesson.get(u.lesson).add(txt);
       });
     });
   }

   const orderedLessons=[];
   (s.units||[]).forEach(u=>{
     if(u.lesson && !orderedLessons.includes(u.lesson)) orderedLessons.push(u.lesson);
   });

   orderedLessons.forEach(lessonName=>{
     content+=\`<div class="lesson-title">\${esc(lessonName)}</div>\`;

     const shownThisLesson=new Set();

     (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
       (u.items||[]).forEach(it=>{
         const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
         const cls=Array.isArray(it)?(it[0]||"major"):"major";
         if(!txt) return;

         if(shownThisLesson.has(txt)) return;
         shownThisLesson.add(txt);

         const continued = prevItemsByLesson.get(lessonName)?.has(txt) || false;
         const displayTxt = continued ? \`\${txt} (tiếp theo)\` : txt;

         content+=\`<div class="\${cls}">\${esc(displayTxt)}</div>\`;
       });
     });
   });

   const dt = new Date(s.date);
   const tr=document.createElement("tr");
   tr.innerHTML=\`<td class="stt">\${si+1}</td>
   <td class="date">\${fmt(dt)}<br><span style="font-size:11px;color:#64748b">\${weekdayName(dt)}</span></td>
   <td class="small">\${c.LT||0}</td>
   <td class="small">\${c.TH||0}</td>
   <td class="small">\${c.KT||0}</td>
   <td class="content">\${content}
   <div style="margin-top:8px">
     <button type="button" onclick="sendSessionToPlanner(\${si})" style="padding:6px 9px;font-size:12px;background:#7c3aed">SOẠN GIÁO ÁN BUỔI NÀY</button>
   </div>
   </td>
   <td class="absent"></td>
   <td class="sign"></td>\`;
   tb.appendChild(tr);
 });
}
`.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');

code = code.replace('function buildSchedule(){', newRenderFunc + '\n\nfunction buildSchedule(){');

const matchBlock = code.match(/currentSessions=sessions;\r?\n const tb=document\.getElementById\(&quot;tbody&quot;\);[\s\S]*?if\(typeof saveStateToBackend === 'function'\) saveStateToBackend\(\);\r?\n\}/);

if(matchBlock) {
    code = code.replace(matchBlock[0], "currentSessions=sessions;\n renderScheduleTable();\n if(typeof saveStateToBackend === 'function') saveStateToBackend();\n}");
} else {
    console.log("Could not find the block to replace in buildSchedule!");
}

code = code.replace(/if \(currentSessions &amp;&amp; currentSessions\.length &gt; 0\) \{[\s\S]*?\} else \{/, "if (currentSessions &amp;&amp; currentSessions.length &gt; 0) {\n            renderScheduleTable();\n        } else {");

fs.writeFileSync('views/app.ejs', code, 'utf-8');
console.log("Success");
