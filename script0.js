
let course = {name:"",code:"",total:0,lt:0,th:0,kt:0};
let lessons = [];
let programSequence = []; // đúng thứ tự: Bài -> Kiểm tra -> Bài -> ... -> Thi
let currentSessions = [];

function saveStateToBackend() {
    const scheduleSettings = {
        startDate: document.getElementById("startDate").value,
        slotCount: document.getElementById("weeklyCount").value,
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
                document.getElementById("weeklyCount").value = payload.scheduleSettings.slotCount;
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
            displaySessionItems(currentSessions); saveStateToBackend();
        } else {
            updateWeeklyCheck();
        }
        
        const status = document.getElementById("fileStatus");
        if(course.driveLink) {
            status.innerHTML = `<b>Đã tải dữ liệu dự án từ máy chủ.</b><br>📁 <a href='${course.driveLink}' target='_blank' style='color:#16469d;font-weight:bold;text-decoration:underline;'>Mở file Chương trình môn học trên Google Drive</a>`;
        } else {
            status.innerHTML = `<b>Đã tải dữ liệu dự án từ máy chủ.</b>`;
        }
    }
});


function conversionSummary(){
 const summary={lt:0,th:0,kt:0,total:0};

 if(programSequence.length){
   programSequence.forEach(x=>{
     if(x.kind==="lesson"){
       summary.lt += Number(x.ltPeriods||0);
       summary.th += Number(x.thPeriods||0);
     }else if(x.kind==="assessment"){
       summary.kt += Number(x.periodsKT||0);
       summary.th += Number(x.periodsTH||0);
     }
   });
   summary.total=summary.lt+summary.th+summary.kt;
   return summary;
 }

 summary.lt=Number(course.lt||0);
 summary.th=course.th ? Math.ceil(Number(course.th)*60/45) : 0;
 summary.total=summary.lt+summary.th;
 return summary;
}

function convertedTotal(){
 return conversionSummary().total;
}

function updateCourseCards(){
 const hasCourse=!!(course.name||course.code||course.total||course.lt||course.th||course.kt);
 document.getElementById("courseName").textContent=course.name||"Chưa tải chương trình môn học";
 document.getElementById("courseCode").textContent=course.code||"—";
 document.getElementById("totalHours").textContent=hasCourse ? (course.total||0)+" giờ" : "—";

 const s=conversionSummary();
 const convertedEl=document.getElementById("converted");
 const breakdownEl=document.getElementById("convertedBreakdown");

 if(!hasCourse){
   convertedEl.textContent="—";
   breakdownEl.innerHTML="";
   document.getElementById("formulaInfo").innerHTML=
     `<b>Quy tắc:</b> LT của từng Bài = số giờ LT; TH của từng Bài = làm tròn lên (giờ TH × 60/45). Kiểm tra tự động tính như Thực hành.`;
   return;
 }

 convertedEl.textContent=`${s.total} tiết`;
 breakdownEl.innerHTML=
   `Lý thuyết: <b>${s.lt} tiết</b><br>`+
   `Thực hành: <b>${s.th} tiết</b><br>`+
   `Kiểm tra: <b>${s.kt} tiết</b><br>`+
   `Tổng: <b>${s.total} tiết</b>`;

 document.getElementById("formulaInfo").innerHTML=
   `<b>Quy tắc đang áp dụng:</b> quy đổi <b>riêng từng Bài</b>. `+
   `LT = giờ LT; TH = CEILING(giờ TH × 60/45). `+
   `<b>Kiểm tra:</b> CEILING(giờ KT × 60/45). Sau quy đổi, <b>1 tiết đưa vào cột Kiểm tra</b>, số tiết còn lại đưa vào <b>Thực hành</b>. `+
   `<b>Thi kết thúc môn học không đưa vào Sổ đầu bài.</b>`;
}

function normalizeLines(text){
 // Chỉ tách dòng và bỏ khoảng trắng đầu/cuối.
 // KHÔNG sửa câu chữ, dấu câu, số thứ tự hay nội dung nguồn.
 return String(text||"")
   .replace(/\r\n/g,"\n")
   .replace(/\r/g,"\n")
   .split("\n")
   .map(x=>x.trim())
   .filter(x=>x.length>0);
}

function exactKey(s){
 // Chỉ dùng để so trùng; KHÔNG dùng làm nội dung hiển thị.
 return String(s||"").replace(/\s+/g," ").trim().toLowerCase();
}

function getExactCellLines(cell){
 if(!cell) return [];

 // Mammoth thường chuyển từng dòng Word thành <p>/<li>.
 // Ưu tiên đọc từng block để giữ nguyên câu chữ và dấu câu.
 const blocks=[...cell.querySelectorAll("p,li")];
 let lines=[];
 if(blocks.length){
   lines=blocks.map(el=>(el.textContent||"").trim()).filter(Boolean);
 }else{
   const raw=(cell.innerText||cell.textContent||"")
     .replace(/\r\n/g,"\n")
     .replace(/\r/g,"\n");
   lines=raw.split("\n").map(x=>x.trim()).filter(Boolean);
 }

 const out=[];
 const seen=new Set();
 for(const line of lines){
   const key=exactKey(line);
   if(key && !seen.has(key)){
     seen.add(key);
     out.push(line); // lưu nguyên văn
   }
 }
 return out;
}

function parseCourseInfo(text){
 const clean=text.replace(/\r/g," ").replace(/[ \t]+/g," ");
 let m;
 m=clean.match(/Tên môn học\s*:\s*([^\n]+)/i); if(m)course.name=m[1].trim();
 m=clean.match(/Mã(?: số)? môn học\s*:\s*([A-Za-z0-9 _-]+)/i); if(m)course.code=m[1].trim();
 m=clean.match(/Thời gian(?: thực hiện)? môn học\s*:\s*(\d+)\s*giờ/i); if(m)course.total=Number(m[1]);
 m=clean.match(/Lý thuyết\s*:\s*(\d+)\s*giờ/i); if(m)course.lt=Number(m[1]);
 m=clean.match(/Thực hành[^:]*:\s*(\d+)\s*giờ/i); if(m)course.th=Number(m[1]);
 m=clean.match(/(?:Thi\s*\/?\s*)?Kiểm tra\s*:\s*0?(\d+)\s*giờ/i); if(m)course.kt=Number(m[1]);
}

function parseDetailItems(text){
 let detail=String(text||"");

 const parts=detail.split(/2\.\s*Nội dung chi tiết\s*:/i);
 if(parts.length>1) detail=parts.slice(1).join(" ");

 detail=detail.split(/\n\s*IV\.\s*/i)[0];

 const lines=normalizeLines(detail);
 const map={};
 let currentNo=null;
 let inContent=false;

 function numbered(line){
   // Nhận 1. / 1 / 1.1. / 1.1 nhưng lưu NGUYÊN VĂN dòng gốc.
   const m=line.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
   return m ? {num:m[1], raw:line} : null;
 }

 for(const line of lines){
   const lm=line.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.*)$/i);
   if(lm){
     currentNo=Number(lm[2]);
     const titleRaw=line.replace(/\s*Thời gian\s*[:\-].*$/i,"").trim();
     if(!map[currentNo]) map[currentNo]={title:titleRaw,items:[]};
     else if(!map[currentNo].title) map[currentNo].title=titleRaw;
     inContent=false;
     continue;
   }

   if(currentNo===null) continue;

   if(/^2\.\s*Nội dung\s*:?\s*$/i.test(line) || /^Nội dung\s*:?\s*$/i.test(line)){
     inContent=true;
     continue;
   }
   if(/^1\.\s*Mục tiêu\s*:?\s*$/i.test(line) || /^Mục tiêu\s*:?\s*$/i.test(line)){
     inContent=false;
     continue;
   }

   if(inContent){
     const it=numbered(line);
     if(!it) continue;

     const body=it.raw.replace(/^(\d+(?:\.\d+)*)\.?\s+/,"");
     if(/^(Mục tiêu|Nội dung)$/i.test(body.trim())) continue;

     const depth=(it.num.match(/\./g)||[]).length;
     const key=exactKey(it.raw);
     if(!map[currentNo].items.some(x=>exactKey(x[1])===key)){
       map[currentNo].items.push([depth>=1?"sub":"major", it.raw]);
     }
   }
 }

 return map;
}

function cellNumber(td){
 const s=(td?.textContent||"").replace(/[^\d.,-]/g,"").replace(",",".").trim();
 const n=Number(s);
 return Number.isFinite(n)?n:0;
}

function parseProgramTable(htmlText, detailMap){
 const holder=document.createElement("div");
 holder.innerHTML=htmlText;
 const tables=[...holder.querySelectorAll("table")];
 let table=null;
 let maxRows = 0;
 let biggestTable = null;
 for(const t of tables){
   const txt=t.textContent||"";
   const rowCount = t.querySelectorAll("tr").length;
   if(rowCount > maxRows) { maxRows = rowCount; biggestTable = t; }
   if(/Tên chương|Tên các bài|Tên bài|Nội dung/i.test(txt) && (/Lý thuyết|LT|Số tiết|Thời gian/i.test(txt))){
     table=t; break;
   }
 }
 if(!table && biggestTable && maxRows >= 2) table = biggestTable;
 if(!table) return [];

 const rows=[...table.querySelectorAll("tr")];
 const sequence=[];
 const seenLessons=new Set();

 // Thu toàn bộ đề mục NGUYÊN VĂN từ chính bảng phân phối.
 const tableItemsByLesson={};
 let currentLessonNo=null;

 for(const row of rows){
   const cells=[...row.querySelectorAll("td,th")];
   if(cells.length<2) continue;

   const lines=getExactCellLines(cells[1]);
   if(!lines.length) continue;

   for(let li=0; li<lines.length; li++){
     const raw=lines[li];

     const lm=raw.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.+)$/i);
     if(lm){
       currentLessonNo=Number(lm[2]);
       if(!tableItemsByLesson[currentLessonNo]) tableItemsByLesson[currentLessonNo]=[];
       continue;
     }

     if(currentLessonNo!==null){
       const im=raw.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
       if(im){
         const key=exactKey(raw);
         if(!tableItemsByLesson[currentLessonNo].some(x=>exactKey(x[1])===key)){
           const depth=(im[1].match(/\./g)||[]).length;
           tableItemsByLesson[currentLessonNo].push([depth>=1?"sub":"major", raw]);
         }
       }
     }
   }
 }

 for(const row of rows){
   const cells=[...row.querySelectorAll("td,th")];
   if(cells.length<2) continue;

   const lines=getExactCellLines(cells[1]);
   const name=lines[0] || (cells[1].textContent||"").trim();

   const lm=name.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.+)$/i);
   if(lm){
     const no=Number(lm[2]);
     if(seenLessons.has(no)) continue;
     seenLessons.add(no);

     const ltHours=cellNumber(cells[3]);
     const thHours=cellNumber(cells[4]);

     // Tên bài lưu nguyên văn từ nguồn.
     const title=name.trim();

     const mergedItems=[];
     const allSources=[
       ...((detailMap[no]&&detailMap[no].items)||[]),
       ...(tableItemsByLesson[no]||[])
     ];

     for(const it of allSources){
       if(!it || !it[1]) continue;
       const key=exactKey(it[1]);
       if(!mergedItems.some(x=>exactKey(x[1])===key)){
         mergedItems.push([it[0], it[1]]); // lưu nguyên văn
       }
     }

     sequence.push({
       kind:"lesson",
       no,
       title,
       ltHours,
       thHours,
       ltPeriods:Math.ceil(ltHours),
       thPeriods:Math.ceil(thHours*60/45),
       items:mergedItems,
       itemCount:mergedItems.length
     });
     continue;
   }

   if(/^(Bài tập tổng hợp)/i.test(name)){
      const ltHours=cellNumber(cells[3]);
      const thHours=cellNumber(cells[4]);
      sequence.push({
        kind:"lesson",
        no: 9999 + sequence.length,
        title: name.trim(),
        ltHours,
        thHours,
        ltPeriods:Math.ceil(ltHours),
        thPeriods:Math.ceil(thHours*60/45),
        items: [],
        itemCount: 0
      });
      continue;
    }
    
    if(/^(Kiểm tra|Thi)/i.test(name)){
     if(/^Thi\s+kết\s+thúc\s+môn/i.test(name)) continue;

     const ktLt=cellNumber(cells[5]);
     const ktTh=cellNumber(cells[6]);
     const thiLt=cellNumber(cells[7]);
     const thiTh=cellNumber(cells[8]);

     const hoursLT=ktLt+thiLt;
     const hoursTH=ktTh+thiTh;
     const rawHours=(hoursLT+hoursTH) || cellNumber(cells[2]) || 1;
     const autoPeriods=Math.ceil(rawHours*60/45);

     if(autoPeriods>0){
       sequence.push({
         kind:"assessment",
         title:name.trim(), // nguyên văn
         rawHours,
         assessmentType:"Thực hành",
         periodsLT:0,
         periodsKT:1,
         periodsTH:Math.max(0,autoPeriods-1),
         periods:autoPeriods
       });
     }
   }
 }

 return sequence;
}

function recalcAssessments(){
 programSequence.forEach(x=>{
   if(x.kind!=="assessment") return;
   const converted=Math.ceil(x.rawHours*60/45);
   x.assessmentType="Thực hành";
   x.periodsKT=converted>0 ? 1 : 0;
   x.periodsTH=Math.max(0,converted-x.periodsKT);
   x.periodsLT=0;
   x.periods=converted;
 });
}

function renderConversionPreview(){
 const box=document.getElementById("conversionPreview");
 if(!programSequence.length){
   box.innerHTML='<div style="color:#64748b;font-size:13px">Chưa có dữ liệu để kiểm tra.</div>';
   return;
 }
 let rows="";
 programSequence.forEach(x=>{
   if(x.kind==="lesson"){
     rows+=`<tr>
       <td><b>${esc(x.title)}</b></td>
       <td style="text-align:center">${x.ltHours}</td>
       <td style="text-align:center">${x.thHours}</td>
       <td><b>${x.ltPeriods} LT + ${x.thPeriods} TH = ${x.ltPeriods+x.thPeriods} tiết</b></td>
     </tr>`;
   }else{
     rows+=`<tr>
       <td><b>${esc(x.title)} (Thực hành)</b></td>
       <td style="text-align:center">—</td>
       <td style="text-align:center">${x.rawHours} giờ</td>
       <td><b>${x.rawHours} giờ KT × 60/45 → ${x.periods} tiết; phân bổ: ${x.periodsKT||0} KT + ${x.periodsTH||0} TH</b></td>
     </tr>`;
   }
 });
 let rows="";
 programSequence.forEach(x=>{
   if(x.kind==="lesson"){
     rows+=`<tr>
       <td><b>${esc(x.title)}</b></td>
       <td style="text-align:center">${x.ltHours}</td>
       <td style="text-align:center">${x.thHours}</td>
       <td><b>${x.ltPeriods} LT + ${x.thPeriods} TH = ${x.ltPeriods+x.thPeriods} tiết</b></td>
     </tr>`;
   }else{
     rows+=`<tr>
       <td><b>${esc(x.title)} (Thực hành)</b></td>
       <td style="text-align:center">—</td>
       <td style="text-align:center">${x.rawHours} giờ</td>
       <td><b>${x.rawHours} giờ KT × 60/45 → ${x.periods} tiết; phân bổ: ${x.periodsKT||0} KT + ${x.periodsTH||0} TH</b></td>
     </tr>`;
   }
 });
 box.innerHTML=`<table style="width:100%;border-collapse:collapse">
 <thead><tr>
 <th style="border-bottom:1px solid #ddd;padding:7px;text-align:left">Bài / Mốc</th>
 <th style="border-bottom:1px solid #ddd;padding:7px">LT giờ</th>
 <th style="border-bottom:1px solid #ddd;padding:7px">TH giờ</th>
 <th style="border-bottom:1px solid #ddd;padding:7px;text-align:left">Sau quy đổi</th>
 </tr></thead>
 <tbody>${rows}</tbody>
 <tfoot><tr><td colspan="3" style="padding:8px;text-align:right"><b>TỔNG SAU QUY ĐỔI</b></td>
 <td style="padding:8px"><b>${conversionSummary().total} tiết</b></td></tr></tfoot>
 </table>`;
}


async function uploadToDrive() {
    const fileInput = document.getElementById('programFile');
    const file = fileInput.files[0];
    if (!file) return;


   let token = null;
   try { token = localStorage.getItem('token') || (window.parent && window.parent.localStorage ? window.parent.localStorage.getItem('token') : null); } catch(e) {}
   
   if(token) {
       let driveStatusDiv = document.getElementById('driveStatusBox');
       if (!driveStatusDiv) {
           driveStatusDiv = document.createElement('div');
           driveStatusDiv.id = 'driveStatusBox';
           driveStatusDiv.style.marginTop = '10px';
           
       }
       driveStatusDiv.innerHTML = "<span style='color:#7c3aed;'>⏳ <b>Hệ thống đang đẩy file lên Google Drive, vui lòng chờ...</b></span>";
       
       const chunkSize = 3 * 1024 * 1024; // 3MB per chunk to bypass 4.5MB limit
       
       (async () => {
           try {
               const startRes = await fetch('/api/drive/start-upload', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                   body: JSON.stringify({ fileName: file.name, mimeType: file.name.toLowerCase().endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : (file.type || 'application/octet-stream') })
               });
               if (!startRes.ok) {
                   let errText = await startRes.text();
                   try { errText = JSON.parse(errText).message || errText; } catch(e) {}
                   throw new Error(errText);
               }
               const { uploadUrl } = await startRes.json();
               
               let fileId = null;
               for (let start = 0; start < file.size; start += chunkSize) {
                   const end = Math.min(start + chunkSize, file.size);
                   const chunk = file.slice(start, end);
                   const chunkRes = await fetch('/api/drive/upload-chunk', {
                       method: 'PUT',
                       headers: {
                           'Authorization': 'Bearer ' + token,
                           'X-Upload-Url': uploadUrl,
                           'Content-Range': 'bytes ' + start + '-' + (end - 1) + '/' + file.size,
                           'Content-Type': 'application/octet-stream'
                       },
                       body: chunk
                   });
                   
                   if (chunkRes.status === 308) {
                       continue;
                   } else if (chunkRes.ok) {
                       const data = await chunkRes.json();
                       fileId = data.fileId;
                       break;
                   } else {
                       let errText = await chunkRes.text();
                       try { errText = JSON.parse(errText).error || errText; } catch(e) {}
                       throw new Error(errText);
                   }
               }
               if (!fileId) throw new Error('Upload incomplete');
               
               const finishRes = await fetch('/api/drive/finish-upload', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                   body: JSON.stringify({ fileId })
               });
               if (!finishRes.ok) {
                   let errText = await finishRes.text();
                   try { errText = JSON.parse(errText).error || errText; } catch(e) {}
                   throw new Error(errText);
               }
               const { url } = await finishRes.json();
               
               driveStatusDiv.innerHTML = "<span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='" + url + "' target='_blank' style='color:#16469d;font-weight:bold;text-decoration:underline;'>Xem trên Google Drive</a></span>";
               course.driveLink = url;
               if(typeof saveStateToBackend === 'function') saveStateToBackend();
           } catch(err) {
               console.error(err);
               driveStatusDiv.innerHTML = "<span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> " + (err.message || err.toString()) + "</span>";
           }
       })();
   }
}

async function readProgramFile(file){
 if(!file)return;
 const status=document.getElementById("fileStatus");
 status.textContent="Đang đọc: "+file.name+" ...";

 try{
   // Upload moved to manual button
   document.getElementById('btnUploadDrive').style.display = 'block';

   let text="", htmlText="";
   if(file.name.toLowerCase().endsWith(".docx")){
     if(typeof mammoth==="undefined") throw new Error("Không tải được bộ đọc DOCX. Hãy kiểm tra kết nối Internet.");
     const buf=await file.arrayBuffer();

     // Phải tạo bản sao vì ArrayBuffer có thể bị thư viện sử dụng.
     const rawResult=await mammoth.extractRawText({arrayBuffer:buf.slice(0)});

     const htmlResult=await mammoth.convertToHtml({arrayBuffer:buf.slice(0)});
     text=rawResult.value;
     htmlText=htmlResult.value;
   }else{
     text=await file.text();
   }

   // Xóa sạch dữ liệu cũ
   lessons=[];
   programSequence=[];
   course={name:"",code:"",total:0,lt:0,th:0,kt:0};
   document.getElementById("tbody").innerHTML="";

   parseCourseInfo(text);
   const detailMap=parseDetailItems(text);

   if(htmlText){
     programSequence=parseProgramTable(htmlText,detailMap);
   }

   // Fallback chỉ dành cho file text/md: đọc các Bài từ phần chi tiết,
   // không dùng dữ liệu môn trước.
   if(!programSequence.length && Object.keys(detailMap).length){
     for(const [noStr,d] of Object.entries(detailMap)){
       const no=Number(noStr);
       programSequence.push({
         kind:"lesson",no,
         title:`Bài ${no}: ${d.title||""}`,
         ltHours:0,thHours:0,ltPeriods:0,thPeriods:0,items:d.items||[]
       });
     }
   }

   lessons=programSequence.filter(x=>x.kind==="lesson");

   // Kiểm tra toàn bộ đề mục sau khi parse để phát hiện thiếu dữ liệu.
   const missingLessons=lessons.filter(x=>(x.items||[]).length===0);
   const totalDetectedItems=lessons.reduce((s,x)=>s+(x.items||[]).length,0);

   if(programSequence.length){
     status.innerHTML=`<b>Đã đọc:</b> ${file.name} · ${lessons.length} Bài/Chương · ${programSequence.filter(x=>x.kind==="assessment").length} mốc Kiểm tra. Thi kết thúc môn đã được loại. Dữ liệu cũ đã được xóa.`+
       (missingLessons.length
        ? `<br><span style="color:#b45309"><b>Cảnh báo:</b> ${missingLessons.length} Bài/Chương chưa nhận diện được đề mục; cần kiểm tra file gốc.</span>`
        : `<br><span style="color:#166534"><b>Đã kiểm tra:</b> tất cả Bài/Chương đều có dữ liệu đề mục nhận diện được · Tổng ${totalDetectedItems} đề mục.</span>`);
   }else{
     status.innerHTML=`<b>Chưa nhận diện được bảng phân phối thời gian.</b> Hệ thống không sử dụng dữ liệu cũ.`;
   }

   updateCourseCards();
   renderConversionPreview();
   updateWeeklyCheck();
 if(typeof saveStateToBackend === 'function') saveStateToBackend();
 }catch(e){
   lessons=[];
   programSequence=[];
   status.textContent="Không đọc được file: "+e.message;
   document.getElementById("tbody").innerHTML="";
   renderConversionPreview();
 }
}

function renderWeeklySlots(){
 const n=Math.max(1,Math.min(7,Number(document.getElementById("weeklyCount").value)||1));
 const box=document.getElementById("weeklySlots");
 const old=[...box.querySelectorAll(".slot")].map(s=>({
   day:s.querySelector(".weekday")?.value,
   periods:s.querySelector(".periods")?.value
 }));
 box.innerHTML="";
 const defaultDays=[2,4,6,1,3,5,0];
 for(let i=0;i<n;i++){
   const div=document.createElement("div");div.className="slot";
   div.innerHTML=`<label>Buổi ${i+1}</label>
   <div class="slot-row">
     <select class="weekday" id="wd${i}" onchange="updateWeeklyCheck(); if(typeof saveStateToBackend === 'function') saveStateToBackend();">
       <option value="1">Thứ 2</option><option value="2">Thứ 3</option><option value="3">Thứ 4</option>
       <option value="4">Thứ 5</option><option value="5">Thứ 6</option><option value="6">Thứ 7</option><option value="0">Chủ nhật</option>
     </select>
     <input class="periods" id="cp${i}" type="number" min="1" max="10" value="${old[i]?.periods||5}" oninput="updateWeeklyCheck(); if(typeof saveStateToBackend === 'function') saveStateToBackend();">
     <span class="slot-period-label">tiết</span>
   </div>`;
   box.appendChild(div);
   div.querySelector(".weekday").value=old[i]?.day ?? defaultDays[i];
 }
 updateWeeklyCheck();
}

function updateWeeklyCheck(){
 const slots=[...document.querySelectorAll(".slot")];
 const total=slots.reduce((s,x)=>s+(Number(x.querySelector(".periods").value)||0),0);
 const target=(course.total||course.lt||course.th||course.kt) ? `<b>${convertedTotal()} tiết</b>` : `<b>tổng số tiết của môn sau khi tải file</b>`;

 const names={"0":"Chủ nhật","1":"Thứ 2","2":"Thứ 3","3":"Thứ 4","4":"Thứ 5","5":"Thứ 6","6":"Thứ 7"};
 const detail=slots.map(x=>{
   const day=x.querySelector(".weekday").value;
   const p=Number(x.querySelector(".periods").value)||0;
   return `<b>${names[day]}: ${p} tiết</b>`;
 }).join(" · ");

 document.getElementById("weeklyCheck").innerHTML=
   `<b>${slots.length} buổi/tuần</b> · <b>${total} tiết/tuần</b><br>`+
   `${detail}<br>`+
   `<span style="color:#475569">Lặp cấu hình này đến khi đủ ${target}. Ngày nghỉ chỉ bị bỏ qua, không chuyển số tiết sang ngày khác.</span>`;
}

function balancedTypes(lt,th){
 const total=lt+th, out=[]; let usedLT=0, usedTH=0;
 if(total<=0) return out;

 // Rải LT đều trong phần LT+TH, không dồn toàn bộ LT lên đầu.
 for(let i=0;i<total;i++){
   const shouldLT=Math.round((i+1)*lt/total);
   if(usedLT<lt && shouldLT>usedLT){
     out.push("LT"); usedLT++;
   }else if(usedTH<th){
     out.push("TH"); usedTH++;
   }else{
     out.push("LT"); usedLT++;
   }
 }
 return out;
}

function lessonToUnits(item){
 const types=balancedTypes(item.ltPeriods,item.thPeriods);
 const allItems=(item.items||[]).map(it=>{
   if(Array.isArray(it)) return [it[0],it[1]];
   return ["major",String(it||"")];
 });
 const unitCount=types.length;

 if(!unitCount) return [];

 // NGUYÊN TẮC BẮT BUỘC:
 // 1) Không bỏ sót bất kỳ đề mục/tiểu mục nào của chương trình.
 // 2) Giữ đúng thứ tự nguồn.
 // 3) Nếu số đề mục > số tiết: một tiết có thể chứa nhiều đề mục LIÊN TIẾP.
 // 4) Nếu số tiết > số đề mục: đề mục được kéo dài qua các tiết liên tiếp.
 //    "(tiếp theo)" chỉ được xác định khi dựng SỔ ĐẦU BÀI theo ranh giới BUỔI.
 const chunks=Array.from({length:unitCount},()=>[]);

 if(!allItems.length){
   return types.map(type=>({type,lesson:item.title,items:[]}));
 }

 if(allItems.length>=unitCount){
   // Chia toàn bộ đề mục thành các nhóm liên tiếp; union của chunks = 100% nguồn.
   for(let i=0;i<unitCount;i++){
     const startIndex=Math.floor(i*allItems.length/unitCount);
     const endIndex=Math.floor((i+1)*allItems.length/unitCount);
     chunks[i]=allItems.slice(startIndex,endIndex);
   }
 }else{
   // Ít đề mục hơn số tiết: lặp đề mục theo vùng liên tiếp, không nhảy cóc.
   for(let i=0;i<unitCount;i++){
     const itemIndex=Math.min(
       allItems.length-1,
       Math.floor(i*allItems.length/unitCount)
     );
     chunks[i]=[allItems[itemIndex]];
   }
 }

 return types.map((type,i)=>({
   type,
   lesson:item.title,
   items:chunks[i]||[]
 }));
}

function validateLessonItemCoverage(item,units){
 const source=(item.items||[]).map(it=>Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim()).filter(Boolean);
 const allocated=[];
 (units||[]).forEach(u=>{
   (u.items||[]).forEach(it=>{
     const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
     if(txt && !allocated.includes(txt)) allocated.push(txt);
   });
 });

 const missing=source.filter(x=>!allocated.includes(x));
 return {
   ok:missing.length===0,
   sourceCount:source.length,
   allocatedCount:allocated.length,
   missing
 };
}

function assessmentToUnits(item){
 const units=[];
 const label=`${item.title}`;

 for(let i=0;i<(item.periodsKT||0);i++){
   units.push({
     type:"KT",
     assessmentMode:"KT",
     lesson:label,
     items:[]
   });
 }
 for(let i=0;i<(item.periodsTH||0);i++){
   units.push({
     type:"TH",
     assessmentMode:"TH",
     lesson:label,
     items:[]
   });
 }
 return units;
}

function buildProgramUnits(){
 const units=[];
 const coverageErrors=[];

 programSequence.forEach(item=>{
   if(item.kind==="lesson"){
     const lessonUnits=lessonToUnits(item);
     const check=validateLessonItemCoverage(item,lessonUnits);
     if(!check.ok){
       coverageErrors.push({
         title:item.title,
         sourceCount:check.sourceCount,
         allocatedCount:check.allocatedCount,
         missing:check.missing
       });
     }
     units.push(...lessonUnits);
   }else if(item.kind==="assessment"){
     units.push(...assessmentToUnits(item));
   }
 });

 if(coverageErrors.length){
   const msg=coverageErrors.map(e=>
     `${e.title}: nguồn ${e.sourceCount} đề mục, đã chia ${e.allocatedCount}; thiếu: ${e.missing.join(" | ")}`
   ).join("\n");
   alert("LỖI CHIA NỘI DUNG: hệ thống phát hiện đề mục bị thiếu.\n\n"+msg+
         "\n\nHệ thống dừng chia lịch để tránh tạo Sổ đầu bài sai.");
   return [];
 }

 return units;
}

function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':""","'":"&#039;"}[m]))}
function fmt(d){return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`}
function weekdayName(d){
 const names=["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
 return names[d.getDay()];
}


let exclusions=[];

function dateKey(d){
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}


function refreshScheduleAfterCalendarChange(){
  // Chỉ tự chia lại khi đã có dữ liệu chương trình và ngày bắt đầu.
  if(programSequence.length && document.getElementById("startDate").value){
    buildSchedule();
  }
  if(typeof saveStateToBackend === 'function') saveStateToBackend();
}



function formatDateInput(el){
 let v=el.value.replace(/\D/g,"").slice(0,8);
 if(v.length>4) v=v.slice(0,2)+"/"+v.slice(2,4)+"/"+v.slice(4);
 else if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2);
 el.value=v;
}

function displayDateToISO(v){
 const m=(v||"").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
 if(!m) return "";
 const d=Number(m[1]), mo=Number(m[2]), y=Number(m[3]);
 const dt=new Date(y,mo-1,d);
 if(dt.getFullYear()!==y || dt.getMonth()!==mo-1 || dt.getDate()!==d) return "";
 return `${String(y).padStart(4,"0")}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function getDraftExclusion(){
 const startText=document.getElementById("excludeStartDate").value.trim();
 const endText=document.getElementById("excludeEndDate").value.trim() || startText;
 if(!startText) return null;

 const start=displayDateToISO(startText);
 const end=displayDateToISO(endText);
 const reason=document.getElementById("excludeReason").value.trim();
 const type=document.getElementById("excludeType").value;

 if(!start || !end) return {invalid:true,startText,endText};
 if(end < start) return {invalid:true,start,end};
 return {start,end,reason:reason||"Ngày nghỉ",type,draft:true};
}

function getActiveExclusions(){
 const active=[...exclusions];
 const draft=getDraftExclusion();
 if(draft && !draft.invalid){
   const duplicate=active.some(x=>x.start===draft.start && x.end===draft.end);
   if(!duplicate) active.push(draft);
 }
 return active;
}

function onExclusionDraftChange(){
 const draft=getDraftExclusion();
 const endInput=document.getElementById("excludeEndDate");

 if(draft && draft.invalid){
   endInput.setCustomValidity("Ngày không hợp lệ. Nhập theo định dạng dd/mm/yyyy và bảo đảm ngày kết thúc không trước ngày bắt đầu.");
 }else{
   endInput.setCustomValidity("");
 }

 if(programSequence.length && document.getElementById("startDate").value && draft && !draft.invalid){
   buildSchedule();
 }
}

function addExclusion(){
 const draft=getDraftExclusion();
 if(!draft){
   alert("Vui lòng nhập ngày bắt đầu nghỉ theo định dạng dd/mm/yyyy.");
   return;
 }
 if(draft.invalid){
   alert("Khoảng ngày nghỉ không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy và kiểm tra ngày bắt đầu/kết thúc.");
   return;
 }

 const {start,end,reason,type}=draft;
 exclusions.push({start,end,reason,type});
 exclusions.sort((a,b)=>a.start.localeCompare(b.start));

 document.getElementById("excludeStartDate").value="";
 document.getElementById("excludeEndDate").value="";
 document.getElementById("excludeReason").value="";
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function removeExclusion(index){
 exclusions.splice(index,1);
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function clearExclusions(){
 exclusions=[];
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function vnDate(s){
 return s.split("-").reverse().join("/");
}

function renderExclusions(){
 const box=document.getElementById("exclusionList");
 if(!exclusions.length){
   box.innerHTML='<div style="padding:9px 10px;color:#64748b;font-size:13px">Chưa khai báo thời gian nghỉ.</div>';
   return;
 }
 box.innerHTML=exclusions.map((x,i)=>{
   const tag=x.type==="holiday"
      ? '<span class="tag-holiday">Nghỉ lễ</span>'
      : '<span class="tag-school">Kế hoạch trường</span>';
   const range=x.start===x.end ? vnDate(x.start) : `${vnDate(x.start)} → ${vnDate(x.end)}`;
   return `<div class="exclusion-item">
     <div><b>${range}</b></div>
     <div>${tag} ${esc(x.reason)}</div>
     <div><button class="gray" onclick="removeExclusion(${i})">Xóa</button></div>
   </div>`;
 }).join("");
}

function isExcludedDate(d){
 const key=dateKey(d);
 return getActiveExclusions().some(x=>key>=x.start && key<=x.end);
}

function nextScheduledDates(start, slots, needed){
  const slotsByDay = new Map();
  slots.forEach(s => {
    const wd = Number(s.day);
    if (!slotsByDay.has(wd)) slotsByDay.set(wd, []);
    slotsByDay.get(wd).push(Number(s.periods));
  });

  let dates=[];
  let d=new Date(start);
  let guard=0;

  while(dates.length<needed && guard<3000){
    const wd=d.getDay();
    if(slotsByDay.has(wd) && !isExcludedDate(d)){
      const daySlots = slotsByDay.get(wd);
      for(const periods of daySlots) {
        dates.push({ date:new Date(d), weekday:wd, periods:periods });
      }
    }
    d.setDate(d.getDate()+1);
    guard++;
  }
  return dates;
}


function rawSessionItems(session){
  const out=[];
  (session?.units||[]).forEach(u=>{
    (u.items||[]).forEach(it=>{
      const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
      if(txt && !out.includes(txt)) out.push(txt);
    });
  });
  return out;
}

function displaySessionItems(sessionIndex){
  const session=currentSessions[sessionIndex];
  const current=rawSessionItems(session);
  const previous=sessionIndex>0 ? rawSessionItems(currentSessions[sessionIndex-1]) : [];

  return current.map(txt=>({
    raw:txt,
    display:previous.includes(txt) ? `${txt} (tiếp theo)` : txt
  }));
}

function buildSchedule(){
 if(!programSequence.length){
   alert("Chưa có dữ liệu Chương trình môn học để chia lịch.");
   return;
 }
 recalcAssessments();

 const units=buildProgramUnits();
 if(!units.length){
   alert("Chưa có số tiết hợp lệ. Vui lòng kiểm tra bảng phân phối thời gian trong Chương trình môn học.");
   return;
 }

 const slots=[...document.querySelectorAll(".slot")].map(s=>({
   day:Number(s.querySelector(".weekday").value),
   periods:Number(s.querySelector(".periods").value)||0
 })).filter(x=>x.periods>0);

 if(!slots.length){
   alert("Vui lòng khai báo ít nhất 1 buổi học trong tuần.");
   return;
 }

 

 const weeklyPeriods=slots.reduce((s,x)=>s+x.periods,0);
 const estimatedWeeks=Math.ceil(units.length/Math.max(1,weeklyPeriods));
 const needed=estimatedWeeks*slots.length+slots.length+10;

 const startValue=document.getElementById("startDate").value;
 if(!startValue){
   alert("Vui lòng chọn ngày bắt đầu.");
   return;
 }
 const start=new Date(startValue+"T00:00:00");
 const dates=nextScheduledDates(start,slots,needed);


 const sessions=[];
 let cursor=0,di=0;
 while(cursor<units.length && di<dates.length){
   const cap=dates[di].periods;
   sessions.push({
     date:dates[di].date,
     units:units.slice(cursor,Math.min(cursor+cap,units.length))
   });
   cursor+=cap;
   di++;
 }

 currentSessions=sessions;
 const tb=document.getElementById("tbody");
 tb.innerHTML="";

 sessions.forEach((s,si)=>{
   const c={LT:0,TH:0,KT:0};
   s.units.forEach(x=>c[x.type]++);

   let content="";

   // Nhóm đúng theo thứ tự xuất hiện:
   // TÊN BÀI -> các đề mục của chính bài đó -> rồi mới sang BÀI kế tiếp.
   const previousSession = si>0 ? currentSessions[si-1] : null;

   // Các đề mục đã xuất hiện ở buổi trước, lưu theo từng tên bài.
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
     content+=`<div class="lesson-title">${esc(lessonName)}</div>`;

     const shownThisLesson=new Set();

     (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
       (u.items||[]).forEach(it=>{
         const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
         const cls=Array.isArray(it)?(it[0]||"major"):"major";
         if(!txt) return;

         // Trong cùng một buổi, cùng một đề mục của cùng một bài chỉ hiện 1 lần.
         if(shownThisLesson.has(txt)) return;
         shownThisLesson.add(txt);

         // Chỉ ghi "(tiếp theo)" nếu đúng đề mục của đúng bài đã xuất hiện ở buổi trước.
         const continued = prevItemsByLesson.get(lessonName)?.has(txt) || false;
         const displayTxt = continued ? `${txt} (tiếp theo)` : txt;

         content+=`<div class="${cls}">${esc(displayTxt)}</div>`;
       });
     });
   });

   const tr=document.createElement("tr");
   tr.innerHTML=`<td class="stt">${si+1}</td>
   <td class="date">${fmt(s.date)}<br><span style="font-size:11px;color:#64748b">${weekdayName(s.date)}</span></td>
   <td class="small">${c.LT||0}</td>
   <td class="small">${c.TH||0}</td>
   <td class="small">${c.KT||0}</td>
   <td class="content">${content}
   <div style="margin-top:8px">
     <button type="button" onclick="sendSessionToPlanner(${si})" style="padding:6px 9px;font-size:12px;background:#7c3aed">SOẠN GIÁO ÁN BUỔI NÀY</button>
   </div>
   </td>
   <td class="absent"></td>
   <td class="sign"></td>`;
   tb.appendChild(tr);
 });
 if(typeof saveStateToBackend === 'function') saveStateToBackend();
}


function sendSessionToPlanner(index){
 const s=currentSessions[index];
 if(!s){ alert("Không tìm thấy buổi học."); return; }

 // "Tên bài học trước" lấy đúng từ TT ngay trước trong Sổ đầu bài.
 // TT 1 không có bài học trước.
 let previousLesson="";
 let previousLessonTitle="";
 let previousLessonItems=[];
 if(index>0 && currentSessions[index-1]){
   const prev=currentSessions[index-1];
   const prevLessons=[...new Set((prev.units||[]).map(u=>u.lesson).filter(Boolean))];
   previousLessonTitle=prevLessons.join(" + ");

   // Lấy toàn bộ đề mục/tiểu mục thực sự đã dạy ở TT liền trước.
   previousLessonItems=displaySessionItems(index-1).map(x=>x.display);

   // Chuỗi dùng cho trường Tên bài học trước: Tên bài + toàn bộ đề mục đã dạy hôm đó.
   previousLesson = previousLessonTitle;
   if(previousLessonItems.length){
     previousLesson += "\n" + previousLessonItems.join("\n");
   }
 }

 const counts={LT:0,TH:0,KT:0};
 s.units.forEach(u=>counts[u.type]=(counts[u.type]||0)+1);

 const lessons=[...new Set(s.units.map(u=>u.lesson).filter(Boolean))];

 // Giữ nguyên cấu trúc hiển thị của Sổ đầu bài:
 // Tên bài -> các đề mục của bài đó -> rồi mới sang bài kế tiếp.
 const lessonGroups=[];
 const prevSession=index>0 ? currentSessions[index-1] : null;
 const prevByLesson=new Map();

 if(prevSession){
   (prevSession.units||[]).forEach(u=>{
     if(!prevByLesson.has(u.lesson)) prevByLesson.set(u.lesson,new Set());
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(txt) prevByLesson.get(u.lesson).add(txt);
     });
   });
 }

 lessons.forEach(lessonName=>{
   const groupItems=[];
   const seen=new Set();

   (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(!txt || seen.has(txt)) return;
       seen.add(txt);

       // Chỉ ghi "(tiếp theo)" nếu đúng đề mục của đúng bài đã có ở buổi trước.
       const continued=prevByLesson.get(lessonName)?.has(txt) || false;
       groupItems.push(continued ? `${txt} (tiếp theo)` : txt);
     });
   });

   lessonGroups.push({
     lesson:lessonName,
     items:groupItems
   });
 });

 const items=[];
 const orderedLessons=[...new Set((s.units||[]).map(u=>u.lesson).filter(Boolean))];
 orderedLessons.forEach(lessonName=>{
   const seen=new Set();
   (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(!txt || seen.has(txt)) return;
       seen.add(txt);
       const continued=prevByLesson.get(lessonName)?.has(txt) || false;
       items.push(continued ? `${txt} (tiếp theo)` : txt);
     });
   });
 });

 // An toàn dữ liệu: nếu là buổi thuộc một Bài mà chưa có đề mục,
 // lấy đề mục tương ứng trực tiếp từ chương trình để không truyền buổi rỗng sang Bước 2.
 if(!items.length){
   const lessonNames=[...new Set((s.units||[]).map(u=>u.lesson).filter(Boolean))];
   lessonNames.forEach(name=>{
     const lessonObj=programSequence.find(x=>x.kind==="lesson" && x.title===name);
     if(lessonObj && lessonObj.items && lessonObj.items.length){
       const first=lessonObj.items[0];
       const txt=Array.isArray(first)?first[1]:String(first||"");
       if(txt && !items.includes(txt)) items.push(txt);
     }
   });
 }

 const payload={
   source:"so-dau-bai",
   courseName:course.name||"",
   courseCode:course.code||"",
   date:fmt(s.date),
   weekday:weekdayName(s.date),
   periods:s.units.length,
   lt:counts.LT||0,
   th:counts.TH||0,
   kt:counts.KT||0,
   lessons,
   lessonGroups,
   items,
   previousLesson,
   previousLessonTitle,
   previousLessonItems,
   scheduleTT:index+1,

   // Gửi toàn bộ chương trình môn học đã đọc ở Bước 1 sang Bước 2 để xem lại.
   fullCourse:{
     name:course.name||"",
     code:course.code||"",
     total:Number(course.total||0),
     lt:Number(course.lt||0),
     th:Number(course.th||0),
     kt:Number(course.kt||0)
   },
   fullProgram:programSequence.map(x=>JSON.parse(JSON.stringify(x))),

   summaryText:lessons.join(" | ") + (items.length ? " | " + items.join(" | ") : "")
 };

 parent.postMessage({type:"OPEN_LESSON_PLAN_FROM_SCHEDULE",payload},"*");
}
function exportExcel(){
 const table=document.getElementById("mainTable").outerHTML;
 const css=`<style>table{border-collapse:collapse;width:100%;font-family:"Times New Roman";font-size:12pt}th,td{border:1px solid #000;padding:5px;vertical-align:middle}th{text-align:center;font-weight:bold}.stt,.date,.small,.absent,.sign{text-align:center}.content{vertical-align:top}.lesson-title,.major{font-weight:bold}.sub{margin-left:18px}
.exclusions{margin-top:12px}
.exclusion-row{display:grid;grid-template-columns:160px 1fr 90px;gap:8px;align-items:end;margin-bottom:8px}
.exclusion-list{margin-top:10px;border:1px solid #d9e1ec;border-radius:9px;overflow:hidden}
.exclusion-item{display:grid;grid-template-columns:120px 1fr 90px;gap:8px;padding:8px 10px;border-bottom:1px solid #e5e7eb;align-items:center}
.exclusion-item:last-child{border-bottom:0}
.tag-holiday{display:inline-block;padding:2px 7px;border-radius:999px;background:#fee2e2;color:#b91c1c;font-size:12px;font-weight:700}
.tag-school{display:inline-block;padding:2px 7px;border-radius:999px;background:#ede9fe;color:#6d28d9;font-size:12px;font-weight:700}
@media(max-width:700px){.exclusion-row,.exclusion-item{grid-template-columns:1fr}}

</style>`;
 const xls=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">${css}</head><body>${table}</body></html>`;
 const blob=new Blob(["\ufeff",xls],{type:"application/vnd.ms-excel;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="So_dau_bai_"+(course.code||"mon_hoc")+".xls";document.body.appendChild(a);a.click();document.body.removeChild(a);
}
updateCourseCards();
renderConversionPreview();
renderWeeklySlots();
renderExclusions();
document.getElementById("tbody").innerHTML="";
