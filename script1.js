
const DEFAULT_PROGRAMS = [
  {
    code:"MH18", name:"Kỹ thuật xử lý phim và kỹ xảo điện ảnh", totalHours:75, version:"2026",
    lessons:[
      {title:"Bài 1: Một số chức năng cơ bản của phần mềm Adobe Premiere", hours:3, sections:[
        {title:"1. Khởi tạo Project", items:["1.1. Tạo một Project mới","1.2. Import Video vào Project"]},
        {title:"2. Một số thiết lập cho khu vực Preview và Timeline", items:[
          "2.1. Hiển thị khung an toàn và thiết lập tùy chọn hiển thị","2.2. Thêm Track","2.3. Loại bỏ các Track rỗng",
          "2.4. Mở rộng khung hình cho Video","2.5. Điều chỉnh độ lớn của khung hình cho Video",
          "2.6. Quay Video bằng một độ cho trước","2.7. Chèn nhiều Video vào một màn hình"
        ]}
      ]},
      {title:"Bài 2: Phương pháp biên tập Video", hours:5, sections:[
        {title:"1. Biên tập Track trên thanh Timeline",items:["1.1. Loại bỏ liên kết giữa Video và Audio","1.2. Không cho phép Video hiển thị trong khu vực Preview","1.3. Khóa và mở khóa cho một Track"]},
        {title:"2. Làm việc với các Tool của Workplace",items:["2.1. Công cụ Selection Tool","2.2. Cắt Video thành từng đoạn bằng Razor Tool","2.3. Công cụ Hand Tool","2.4. Công cụ Zoom Tool"]},
        {title:"3. Một số công cụ biên tập nâng cao",items:["3.1. In Point và Out Point","3.2. Chèn một đoạn Video vào Timeline","3.3. Tạo màu nền cho Video bằng Color Matte","3.4. Lệnh Opacity","3.5. Tăng, giảm tốc độ trình chiếu","3.6. Thay đổi số khung hình trên giây","3.7. Nhóm các đối tượng","3.8. Liên kết Audio và Video","3.9. Thêm một Sequence mới","3.10. Dừng hình"]}
      ]},
      {title:"Bài 3: Kỹ xảo và hiệu ứng",hours:12,sections:[
        {title:"1. Một số hiệu ứng căn bản",items:["1.1. Phóng lớn một nhân vật trong Video","1.2. Hiệu ứng Tint","1.3. Hiệu ứng Brightness & Contrast","1.4. Hiệu ứng Black & White"]},
        {title:"2. Hiệu ứng ánh sáng",items:["2.1. Hiệu ứng Light Factory","2.2. Hiệu ứng Lightning","2.3. Hiệu ứng Lighting Effects"]},
        {title:"3. Một số hiệu ứng nâng cao",items:["3.2. Xử lý nhiễu bằng hiệu ứng Neat Video","3.3. Khử nhiễu nhanh bằng hiệu ứng Video Denoise"]},
        {title:"4. Một số hiệu ứng về màu sắc",items:["4.1. Cân bằng thông số màu bằng hiệu ứng Color Balance","4.2. Thay đổi màu cho Video bằng hiệu ứng Change Color"]},
        {title:"5. Hiệu ứng chuyển cảnh",items:["5.1. Chuyển tiếp giữa hai đoạn Video khác nhau","5.2. Hiệu ứng Zoom","5.3. Hiệu ứng Hollywood FX 5"]},
        {title:"6. Làm việc với Keyframe",items:["6.1. Cho hình ảnh hiển thị trong Video","6.2. Lồng ghép các đoạn phim","6.3. Điều khiển hiệu ứng bằng Keyframe"]}
      ]},
      {title:"Bài 4: Chèn văn bản vào Video",hours:7,sections:[
        {title:"1. Thiết kế các kiểu chữ cơ bản",items:["1.1. Tạo một đối tượng văn bản","1.2. Chỉnh sửa nội dung văn bản","1.3. Điều chỉnh màu sắc cho font chữ","1.4. Xây dựng chất liệu nền cho font chữ","1.5. Tạo bóng cho font chữ"]},
        {title:"2. Một số công cụ soạn thảo khác",items:["2.1. Vertical Type Tool","2.2. Công cụ Path Type Tool","2.3. Tạo Style riêng","2.4. Tạo tiêu đề chuyển động","2.5. Xử lý các kiểu chữ trên thanh Timeline"]},
        {title:"3. Một số ứng dụng của tiêu đề",items:["3.1. Tạo một tiêu đề ẩn - hiện","3.2. Nhúng hiệu ứng vào văn bản","3.3. Xây dựng một đoạn phim giới thiệu","3.4. Xây dựng một đoạn kết cho phim"]}
      ]},
      {title:"Bài 5: Phương pháp biên tập âm thanh trong Adobe Premiere",hours:7,sections:[
        {title:"1. Tìm hiểu một số chức năng của Audio",items:["1.1. Audio Track","1.2. Vô hiệu hóa một Track Audio","1.3. Khóa và mở khóa một Track Audio","1.4. Xóa Track Audio","1.5. Thêm Track Audio","1.6. Đóng mở Audio Mixer"]},
        {title:"2. Một số chức năng nâng cao của Audio trong Adobe Premiere",items:["2.1. Xóa âm thanh trong một Video","2.2. Thêm nhạc vào Video","2.3. Giảm âm lượng cho tập tin Audio","2.4. Tăng giảm tốc độ cho tập tin Audio","2.5. Làm việc với Keyframe","2.6. Điều khiển Keyframe trên thanh Timeline","2.7. Xóa một đoạn Audio trong Video","2.8. Phương pháp thu âm cho Video"]},
        {title:"3. Áp dụng hiệu ứng cho Audio",items:["3.1. Hiệu ứng Channel Volume","3.2. Tăng - giảm âm thanh Bass","3.3. Hiệu ứng chuyển tiếp cho Audio"]}
      ]},
      {title:"Bài 6: Phương pháp xuất phim trong Adobe Premiere",hours:6,sections:[
        {title:"1. Xuất phim ra định dạng AVI",items:["1.1. Xuất phim theo Microsoft AVI","1.2. Xuất phim theo Uncompressed Microsoft AVI"]},
        {title:"2. Xuất phim theo định dạng MPG",items:["2.1. Xuất phim theo chuẩn VCD","2.2. Xuất phim theo chuẩn SVCD"]},
        {title:"3. Xuất tập tin theo một số định dạng khác",items:["3.1. Xuất phim theo định dạng MOV của QuickTime","3.2. Xuất phim theo chuẩn Flash","3.3. Xuất phim theo chuẩn DVD"]}
      ]},
      {title:"Bài 7: Tạo kỹ xảo bằng Adobe After Effect",hours:31,sections:[
        {title:"Nội dung",items:["1. Tạo một project","2. Hiệu ứng Blur & Shappen","3. Hiệu ứng Channel","4. Hiệu ứng Color Correction","5. Hiệu ứng Dirstort","6. Hiệu ứng Gennerate","7. Hiệu ứng Keying","8. Hiệu ứng Matte and Noise","9. Hiệu ứng Perfective","10. Hiệu ứng Simulation"]}
      ]}
    ]
  },
  {
    code:"MH28",name:"Ứng dụng AI trong thiết kế",totalHours:45,version:"2026",
    lessons:[
      {title:"Bài 1: Tổng quan và làm quen với công cụ AI",hours:8,sections:[
        {title:"1. Khái niệm trí tuệ nhân tạo và ứng dụng trong thiết kế đồ họa",items:[]},
        {title:"2. Giới thiệu các công cụ AI",items:[]},
        {title:"3. Lợi ích và hạn chế của AI",items:[]}
      ]},
      {title:"Bài 2: Nguyên lý AI và thiết kế ấn phẩm quảng cáo",hours:7,sections:[
        {title:"1. Công nghệ text-to-image và generative AI",items:["1.1. Quy trình","1.2. Vai trò của dữ liệu huấn luyện trong chất lượng đầu ra"]},
        {title:"2. Prompt engineering",items:["2.1. Cấu trúc câu lệnh","2.2. Mẹo tối ưu"]}
      ]},
      {title:"Bài 3: Ứng dụng AI trong UI/UX và thiết kế giao diện",hours:6,sections:[
        {title:"1. Ứng dụng AI trong thiết kế wireframe và mockup UI/UX",items:[]},
        {title:"2. Lựa chọn công cụ AI phù hợp",items:[]}
      ]},
      {title:"Bài 4: Typography và tích hợp AI với phần mềm thiết kế",hours:7,sections:[
        {title:"1. AI trong thiết kế typography",items:[]},{title:"2. Chuyển đổi tệp dữ liệu",items:[]}
      ]},
      {title:"Bài 5: Xu hướng, đạo đức AI và chiến dịch truyền thông",hours:6,sections:[
        {title:"1. Xu hướng AI trong thiết kế (AR/VR, tự động hóa)",items:[]},{title:"2. Đạo đức AI",items:[]},{title:"3. Phân tích chiến dịch truyền thông thực tế",items:[]}
      ]},
      {title:"Bài 6: Ứng dụng AI trong thực tiễn",hours:7,sections:[
        {title:"1. Lập kế hoạch cho dự án thiết kế cá nhân",items:[]},{title:"2. Thực hiện sản phẩm thiết kế ứng dụng AI",items:[]},{title:"3. Xây dựng portfolio cá nhân",items:[]},{title:"4. Trình bày và phản biện sản phẩm",items:[]}
      ]}
    ]
  },
  {
    code:"MH31",name:"Ứng dụng thiết kế sản phẩm đồ họa trên Canva",totalHours:45,version:"2026",
    lessons:[
      {title:"Chương 1: Giới thiệu và Cơ bản về Canva",hours:6,sections:[
        {title:"1.1. Hướng dẫn tải và cài đặt Canva",items:[]},{title:"1.2. Khám phá giao diện và các thành phần chính",items:[]},{title:"1.3. Hướng dẫn tạo dự án mới",items:[]},{title:"1.4. Quản lý và lưu trữ dự án",items:[]}
      ]},
      {title:"Chương 2: Cơ bản về Thiết kế Đồ họa trên phần mềm Canva",hours:17,sections:[
        {title:"2.1. Các loại nền và kích thước",items:[]},{title:"2.2. Thêm và Dựng hình ảnh",items:[]},{title:"2.3. Sử dụng Text và Font",items:[]},{title:"2.4. Sử dụng Màu sắc",items:[]},{title:"2.5. Hiệu ứng và Lớp",items:[]}
      ]},
      {title:"Chương 3: Thiết kế sản phẩm cụ thể",hours:17,sections:[
        {title:"3.1. Tạo Poster",items:[]},{title:"3.2. Tạo Banner",items:[]},{title:"3.3. Tạo Brochure",items:[]},{title:"3.4. Tạo Thẻ Tên",items:[]},{title:"3.5. Tạo Thẻ Gửi quà",items:[]}
      ]},
      {title:"Chương 4: Tổng kết và ôn tập",hours:5,sections:[
        {title:"4.1. Tổng kết",items:[]},{title:"4.2. Ôn tập",items:[]}
      ]}
    ]
  },
  {
    code:"MH14",name:"Thiết kế giao diện người dùng UI/UX",totalHours:45,version:"2026",
    lessons:[
      {title:"Bài 1: Tổng quan về UI/UX và Figma",hours:8,sections:[
        {title:"1. Giới thiệu và vai trò của UI/UX trong thiết kế đồ họa số",items:[]},{title:"2. So sánh UI với UX",items:[]},{title:"3. Làm quen với Figma",items:[]}
      ]},
      {title:"Bài 2: Nguyên tắc thiết kế giao diện người dùng (UI)",hours:6,sections:[
        {title:"1. Bố cục và hệ thống lưới (grid system)",items:["1.1. Nguyên tắc bố cục","1.2. Khoảng cách và căn chỉnh trong thiết kế giao diện"]},
        {title:"2. Màu sắc, typography và hệ thống thiết kế",items:["2.1. Màu sắc trong UI","2.2. Typography","2.3. Hệ thống thiết kế - Xây dựng các thành phần cơ bản"]}
      ]},
      {title:"Bài 3: UI Components & Patterns",hours:6,sections:[
        {title:"1. UI Components",items:[]},{title:"2. UI Patterns",items:[]}
      ]},
      {title:"Bài 4: Nghiên cứu người dùng và Phân loại nhóm người dùng",hours:5,sections:[
        {title:"1. Quy trình nghiên cứu người dùng",items:[]},{title:"2. Phân loại người dùng",items:[]},{title:"3. Lập bảng phân nhóm người dùng",items:[]}
      ]},
      {title:"Bài 5: Tạo Personas và Hành trình người dùng",hours:5,sections:[
        {title:"1. Xây dựng hồ sơ người dùng đại diện",items:[]},{title:"2. Vẽ bản đồ hành trình trải nghiệm người dùng",items:[]}
      ]},
      {title:"Bài 6: Tạo wireframe và prototype với Figma",hours:5,sections:[
        {title:"1. Wireframe, Mockup, Prototype",items:[]},{title:"2. Kỹ thuật liên kết màn hình trong Figma (prototype mode)",items:[]},{title:"3. Thử nghiệm kịch bản người dùng",items:[]}
      ]},
      {title:"Bài 7: Dự án thiết kế UI/UX",hours:8,sections:[
        {title:"1. Phác thảo giao diện và wireframe",items:[]},{title:"2. Thiết kế giao diện hoàn chỉnh và prototype",items:[]},{title:"3. Thử nghiệm người dùng và cải tiến thiết kế",items:[]}
      ]}
    ]
  }
];

let db;
let programs=[];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open("giaoAnDB",1);
    req.onupgradeneeded=e=>{
      const d=e.target.result;
      if(!d.objectStoreNames.contains("programs")) d.createObjectStore("programs",{keyPath:"id",autoIncrement:true});
    };
    req.onsuccess=e=>{db=e.target.result;resolve(db)};
    req.onerror=()=>reject(req.error);
  });
}
function tx(store,mode="readonly"){return db.transaction(store,mode).objectStore(store)}
function getAll(){return new Promise((res,rej)=>{const r=tx("programs").getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function addProgram(p){return new Promise((res,rej)=>{const r=tx("programs","readwrite").add(p);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function putProgram(p){return new Promise((res,rej)=>{const r=tx("programs","readwrite").put(p);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function deleteProgram(id){return new Promise((res,rej)=>{const r=tx("programs","readwrite").delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function ensureDefaults(){
  let all=await getAll();
  if(all.length===0){for(const p of DEFAULT_PROGRAMS) await addProgram(structuredClone(p));all=await getAll()}
  programs=all;
}
function fillPeriods(){
  $("#periods").innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1} tiết</option>`).join("");
  $("#periods").value="4"; updateMinutes()
}
function updateMinutes(){
  const locked=Number($("#totalMinutes").dataset.fromSchedule)||0;
  if(locked>0){
    $("#totalMinutes").value=locked+" phút";
    return;
  }
  const v=Number($("#periods").value)||0;
  $("#totalMinutes").value=v>0 ? (v*45)+" phút" : "—";
}
function renderSubjects(){
  const cur=$("#subject").value;
  $("#subject").innerHTML=programs.map(p=>`<option value="${p.id}">${p.name} – ${p.code}${p.version?` (${p.version})`:""}</option>`).join("");
  if(programs.some(p=>String(p.id)===cur)) $("#subject").value=cur;
  renderLessons();
  if($("#programList")) renderProgramList();
}
function currentProgram(){return programs.find(p=>String(p.id)===$("#subject").value)}
function renderLessons(){
  const p=currentProgram(); $("#lesson").innerHTML=(p?.lessons||[]).map((l,i)=>`<option value="${i}">${l.title}</option>`).join("");
  renderSections()
}
function currentLesson(){const p=currentProgram();return p?.lessons?.[Number($("#lesson").value)]}
function renderSections(){
  const l=currentLesson();$("#section").innerHTML=(l?.sections||[]).map((s,i)=>`<option value="${i}">\${s.title || "Nội dung từ Sổ đầu bài"}</option>`).join("");
  renderSubitems()
}
function currentSection(){return currentLesson()?.sections?.[Number($("#section").value)]}
function renderSubitems(){
  const s=currentSection();
  const items=s?.items||[];
  const box=$("#subitems");

  if(!items.length){
    box.innerHTML=`<div class="hint">Buổi học này không có đề mục/tiểu mục được phân từ Sổ đầu bài.</div>`;
    return;
  }

  box.innerHTML=
    `<div class="hint" style="margin-bottom:7px"><b>Đủ ${items.length} nội dung</b> theo đúng Sổ đầu bài. Dữ liệu được khóa, không chọn/bỏ thủ công tại Bước 2.</div>`+
    items.map((x,i)=>`
      <label class="checkitem">
        <input type="checkbox" class="subcheck" value="${i}" checked disabled>
        <span>${escapeHtml(String(x||""))}</span>
      </label>
    `).join("");
}
function selectedContent(){
  const s=currentSection();
  if(!s) return [];
  return (s.items||[]).length ? [...s.items] : (s.title ? [s.title] : []);
}
function renderProgramList(){
  const box=$("#programList");
  if(!box) return;
  box.innerHTML=programs.map(p=>`<div class="program">
    <div><b>${p.code}</b> – ${p.name}<br><small>${p.totalHours||"?"} giờ • ${p.lessons?.length||0} bài/chương • ${p.version||"không phiên bản"}</small></div>
    <div class="program-actions">
      <button class="btn mini" onclick="viewProgram(${p.id})">Xem</button>
      <button class="btn mini danger" onclick="removeProgram(${p.id})">Xóa</button>
    </div>
  </div>`).join("")
}
window.removeProgram=async id=>{
  if(!confirm("Xóa chương trình này khỏi dữ liệu trình duyệt?"))return;
  await deleteProgram(id);programs=await getAll();renderSubjects()
}
window.viewProgram=id=>{
  const p=programs.find(x=>x.id===id);showModal(`${p.code} – ${p.name}`,`<pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify(p,null,2))}</pre>`)
}
function showModal(t,b){$("#modalTitle").textContent=t;$("#modalBody").innerHTML=b;$("#modal").classList.remove("hidden")}
function closeModal(){$("#modal").classList.add("hidden")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':""","'":"&#039;"}[m]))}

function distribute(total,n){
  if(n<=0)return[];
  const base=Math.floor(total/n), arr=Array(n).fill(base);
  for(let i=0;i<total-base*n;i++)arr[i]++;
  return arr
}

function normalizeRows(rows,target){
  const out=(rows||[])
    .filter(r=>r && Number(r.time)>0)
    .map(r=>({...r,time:Number(r.time)||0}));
  if(!out.length) return out;
  const targetTotal=Number(target)||0;
  let sum=out.reduce((s,r)=>s+r.time,0);
  let diff=targetTotal-sum;

  if(diff>0){
    for(let i=0;i<out.length && diff>0;i++){
      const room=Math.max(0,12-out[i].time);
      const add=Math.min(room,diff);
      out[i].time+=add;
      diff-=add;
    }
    for(let i=0;i<out.length && diff>0;i++){
      const room=Math.max(0,15-out[i].time);
      const add=Math.min(room,diff);
      out[i].time+=add;
      diff-=add;
    }
    let n=1;
    while(diff>0){
      const t=Math.min(12,diff);
      out.push({
        title:`Hoạt động bổ sung ${n}`,
        content:"Bổ sung ví dụ, bài tập, mẹo, chú ý hoặc tình huống vận dụng liên quan trực tiếp đến nội dung đang học; không lặp lại nội dung đã triển khai.",
        gv:"Giao nhiệm vụ; hướng dẫn; nhận xét.",
        sv:"Thực hiện; trao đổi; hoàn thiện.",
        time:t
      });
      diff-=t;
      n++;
    }
  }else if(diff<0){
    let need=-diff;
    for(let i=out.length-1;i>=0 && need>0;i--){
      const reducible=Math.max(0,out[i].time-1);
      const cut=Math.min(reducible,need);
      out[i].time-=cut;
      need-=cut;
    }
  }
  return out.filter(r=>r.time>0);
}

function activityRows(type,items,total){
  const rows=[];
  let globalStageIndex=0;

  function push(title,content,gv,sv,time){
    if(time<=0) return;
    rows.push({title,content,gv,sv,time});
  }

  const contentItems=(items&&items.length)?items:[currentSection()?.title||"Nội dung bài học"];

  function segmentTimes(block){
    if(block<=0) return [];
    let n=Math.max(1,Math.ceil(block/11));
    let arr=distribute(block,n);

    while(n>1 && Math.min(...arr)<5){
      const cand=distribute(block,n-1);
      if(Math.max(...cand)<=15){
        n--;
        arr=cand;
      }else break;
    }
    return arr;
  }

  function cleanLabel(s){
    return String(s||"").replace(/\s+/g," ").trim();
  }

  const enrichments=[
    {
      label:"Trọng tâm cần nắm",
      content:x=>`Xác định những điểm cốt lõi của ${x}; làm rõ mục đích, kết quả cần đạt và mối liên hệ với nhiệm vụ đang thực hiện.`,
      gv:"Định hướng; giải thích.",
      sv:"Lắng nghe; xác định trọng tâm."
    },
    {
      label:"Ví dụ thực tế",
      content:x=>`Phân tích một ví dụ thực tế liên quan đến ${x}; chỉ ra dữ liệu đầu vào, cách xử lý và kết quả mong đợi để người học hình dung cách áp dụng.`,
      gv:"Nêu ví dụ; phân tích.",
      sv:"Quan sát; nhận xét."
    },
    {
      label:"Bài tập nhận biết",
      content:x=>`Giao bài tập ngắn yêu cầu người học nhận biết đúng thành phần, công cụ, thao tác hoặc nguyên tắc liên quan đến ${x}; đối chiếu đáp án ngay tại lớp.`,
      gv:"Giao bài tập; kiểm tra.",
      sv:"Thực hiện; đối chiếu."
    },
    {
      label:"Tình huống ứng dụng",
      content:x=>`Đặt tình huống có yêu cầu cụ thể liên quan đến ${x}; người học lựa chọn cách xử lý phù hợp và giải thích lý do.`,
      gv:"Nêu tình huống; gợi hỏi.",
      sv:"Phân tích; đề xuất."
    },
    {
      label:"Mẹo thực hiện",
      content:x=>`Bổ sung các mẹo giúp thực hiện ${x} nhanh, chính xác và dễ kiểm soát hơn; nhấn mạnh cách tiết kiệm thao tác hoặc tránh chỉnh sửa lại nhiều lần.`,
      gv:"Chia sẻ mẹo; minh họa.",
      sv:"Ghi nhận; thử áp dụng."
    },
    {
      label:"Chú ý quan trọng",
      content:x=>`Nêu các điểm cần đặc biệt chú ý khi thực hiện ${x}; xác định điều kiện dễ gây sai kết quả và cách kiểm tra trước khi chuyển sang bước tiếp theo.`,
      gv:"Nhấn mạnh; cảnh báo.",
      sv:"Ghi chú; kiểm tra."
    },
    {
      label:"Lỗi thường gặp",
      content:x=>`Phân tích các lỗi thường gặp trong ${x}; xác định dấu hiệu nhận biết, nguyên nhân và cách khắc phục tương ứng.`,
      gv:"Nêu lỗi; hướng dẫn sửa.",
      sv:"Nhận diện; sửa lỗi."
    },
    {
      label:"So sánh phương án",
      content:x=>`So sánh hai hoặc nhiều cách thực hiện ${x}; chỉ ra ưu điểm, hạn chế và trường hợp nên sử dụng từng phương án.`,
      gv:"So sánh; phân tích.",
      sv:"Đối chiếu; lựa chọn."
    },
    {
      label:"Phân tích sản phẩm mẫu",
      content:x=>`Quan sát một sản phẩm/kết quả mẫu liên quan đến ${x}; phân tích điểm đạt, điểm chưa đạt và các chi tiết cần điều chỉnh.`,
      gv:"Trình chiếu mẫu; phân tích.",
      sv:"Quan sát; đánh giá."
    },
    {
      label:"Checklist thao tác",
      content:x=>`Xây dựng checklist ngắn cho ${x}; kiểm tra lần lượt điều kiện đầu vào, bước thực hiện, kết quả trung gian và trạng thái hoàn tất.`,
      gv:"Hướng dẫn checklist.",
      sv:"Đối chiếu; đánh dấu."
    },
    {
      label:"Câu hỏi kiểm tra nhanh",
      content:x=>`Đặt các câu hỏi ngắn kiểm tra mức độ hiểu ${x}; yêu cầu người học giải thích bằng chính thao tác hoặc ví dụ thay vì chỉ nhắc lại khái niệm.`,
      gv:"Đặt câu hỏi; nhận xét.",
      sv:"Trả lời; giải thích."
    },
    {
      label:"Bài tập biến thể",
      content:x=>`Thay đổi một điều kiện của ${x} và yêu cầu người học điều chỉnh cách thực hiện cho phù hợp; so sánh kết quả trước và sau thay đổi.`,
      gv:"Giao biến thể; quan sát.",
      sv:"Điều chỉnh; báo cáo."
    },
    {
      label:"Thử thách tốc độ",
      content:x=>`Yêu cầu thực hiện ${x} trong thời gian giới hạn nhưng vẫn bảo đảm đúng quy trình và chất lượng; sau đó rút kinh nghiệm về thao tác còn chậm.`,
      gv:"Giao thử thách; bấm thời gian.",
      sv:"Thực hiện; tự rút kinh nghiệm."
    },
    {
      label:"Thử thách độ chính xác",
      content:x=>`Giao yêu cầu cần độ chính xác cao đối với ${x}; người học tự kiểm tra sai lệch và hiệu chỉnh cho đến khi đạt tiêu chí.`,
      gv:"Nêu tiêu chí; kiểm tra.",
      sv:"Thực hiện; hiệu chỉnh."
    },
    {
      label:"Tự đánh giá",
      content:x=>`Người học tự đánh giá mức độ hoàn thành ${x} theo các tiêu chí đã công bố; ghi rõ điểm làm tốt, điểm cần cải thiện và nguyên nhân.`,
      gv:"Cung cấp tiêu chí; nhận xét.",
      sv:"Tự đánh giá; ghi nhận."
    },
    {
      label:"Đánh giá chéo",
      content:x=>`Người học đối chiếu kết quả ${x} với sản phẩm của bạn/nhóm khác theo cùng tiêu chí; đưa ra nhận xét ngắn và đề xuất chỉnh sửa.`,
      gv:"Tổ chức đánh giá chéo.",
      sv:"Nhận xét; góp ý."
    },
    {
      label:"Tiêu chí sản phẩm",
      content:x=>`Làm rõ các tiêu chí đánh giá kết quả của ${x}: đúng yêu cầu, đúng kỹ thuật, đầy đủ nội dung, tính nhất quán và khả năng sử dụng.`,
      gv:"Nêu tiêu chí; minh họa.",
      sv:"Đối chiếu; ghi nhớ."
    },
    {
      label:"Mốc kiểm tra giữa chặng",
      content:x=>`Dừng tại một mốc hợp lý của ${x} để kiểm tra kết quả trung gian; phát hiện sớm sai lệch trước khi tiếp tục các bước sau.`,
      gv:"Kiểm tra; góp ý.",
      sv:"Dừng thao tác; đối chiếu."
    },
    {
      label:"Khắc phục sai lệch",
      content:x=>`Chọn một sai lệch điển hình trong ${x}; thực hiện quy trình xác định nguyên nhân, sửa lỗi và kiểm tra lại kết quả sau khắc phục.`,
      gv:"Mô tả sai lệch; hướng dẫn.",
      sv:"Phân tích; khắc phục."
    },
    {
      label:"Tối ưu quy trình",
      content:x=>`Rà soát quy trình ${x}; tìm bước có thể rút gọn, chuẩn hóa hoặc sắp xếp lại để tăng hiệu quả mà không làm giảm chất lượng.`,
      gv:"Gợi ý tối ưu; nhận xét.",
      sv:"Đề xuất; thử nghiệm."
    },
    {
      label:"Ghi nhớ nhanh",
      content:x=>`Tóm tắt ${x} bằng các từ khóa hoặc quy tắc ngắn; người học tự diễn đạt lại thành một trình tự dễ nhớ và dễ áp dụng.`,
      gv:"Gợi ý từ khóa.",
      sv:"Tóm tắt; trình bày."
    },
    {
      label:"Sơ đồ quy trình",
      content:x=>`Chuyển nội dung ${x} thành sơ đồ các bước hoặc luồng xử lý; xác định rõ điểm bắt đầu, thao tác chính, điểm kiểm tra và kết quả cuối.`,
      gv:"Hướng dẫn sơ đồ.",
      sv:"Vẽ sơ đồ; giải thích."
    },
    {
      label:"Câu hỏi Vì sao?",
      content:x=>`Yêu cầu người học giải thích vì sao từng bước quan trọng trong ${x}; làm rõ hậu quả có thể xảy ra nếu bỏ qua hoặc thực hiện sai thứ tự.`,
      gv:"Đặt câu hỏi Vì sao.",
      sv:"Giải thích; liên hệ."
    },
    {
      label:"Câu hỏi Nếu... thì?",
      content:x=>`Đưa ra các điều kiện thay đổi đối với ${x} và yêu cầu dự đoán kết quả; xác định cách xử lý phù hợp cho từng trường hợp.`,
      gv:"Đưa giả định; gợi mở.",
      sv:"Dự đoán; đề xuất."
    },
    {
      label:"Mini case",
      content:x=>`Cho một tình huống ngắn có dữ liệu và yêu cầu cụ thể liên quan đến ${x}; người học xử lý từ đầu đến kết quả trong phạm vi nhỏ.`,
      gv:"Giao mini case; quan sát.",
      sv:"Xử lý; trình bày."
    },
    {
      label:"Bài tập sửa sản phẩm",
      content:x=>`Cung cấp một kết quả có chủ ý chứa lỗi liên quan đến ${x}; người học phát hiện, sửa và giải thích vì sao cách sửa là phù hợp.`,
      gv:"Cung cấp mẫu lỗi.",
      sv:"Phát hiện; sửa; giải thích."
    },
    {
      label:"Bài tập hoàn thiện",
      content:x=>`Cung cấp một sản phẩm chưa hoàn chỉnh liên quan đến ${x}; yêu cầu người học bổ sung phần thiếu và kiểm tra tính nhất quán sau khi hoàn thiện.`,
      gv:"Giao sản phẩm dở dang.",
      sv:"Hoàn thiện; kiểm tra."
    },
    {
      label:"Bài tập lựa chọn",
      content:x=>`Đưa ra nhiều phương án xử lý ${x}; người học chọn phương án phù hợp nhất cho điều kiện cho trước và nêu căn cứ lựa chọn.`,
      gv:"Đưa phương án; nhận xét.",
      sv:"Lựa chọn; giải thích."
    },
    {
      label:"Liên hệ thực tế",
      content:x=>`Liên hệ ${x} với tình huống thường gặp trong học tập, sản xuất hoặc công việc thực tế; chỉ ra giá trị sử dụng và giới hạn áp dụng.`,
      gv:"Liên hệ; phân tích.",
      sv:"Trao đổi; nêu ví dụ."
    },
    {
      label:"Mở rộng công cụ",
      content:x=>`Giới thiệu một cách tiếp cận/công cụ bổ trợ có thể dùng cùng ${x}; so sánh khi nào nên dùng và khi nào không cần dùng.`,
      gv:"Giới thiệu; so sánh.",
      sv:"Quan sát; nhận xét."
    },
    {
      label:"Mẹo kiểm tra kết quả",
      content:x=>`Hướng dẫn các dấu hiệu hoặc thao tác kiểm tra nhanh để xác nhận ${x} đã được thực hiện đúng trước khi lưu hoặc chuyển bước.`,
      gv:"Hướng dẫn kiểm tra.",
      sv:"Kiểm tra; xác nhận."
    },
    {
      label:"Chú ý khi lưu và bàn giao",
      content:x=>`Nhấn mạnh cách lưu, đặt tên, tổ chức tệp hoặc bàn giao kết quả sau ${x}; tránh mất dữ liệu và nhầm phiên bản.`,
      gv:"Nhắc quy tắc lưu.",
      sv:"Thực hiện; đối chiếu."
    },
    {
      label:"Phản hồi cuối hoạt động",
      content:x=>`Người học nêu một điều đã làm tốt và một điều còn vướng khi thực hiện ${x}; giảng viên phản hồi ngắn để chốt cách xử lý đúng.`,
      gv:"Thu phản hồi; chốt ý.",
      sv:"Phản hồi; ghi nhận."
    },
    {
      label:"Bài tập củng cố",
      content:x=>`Thực hiện một nhiệm vụ ngắn tổng hợp lại ${x} mà không xem hướng dẫn chi tiết; dùng kết quả để xác định mức độ thành thạo.`,
      gv:"Giao bài củng cố.",
      sv:"Thực hiện độc lập."
    },
    {
      label:"Thẻ ghi nhớ",
      content:x=>`Tạo thẻ ghi nhớ cho ${x} gồm: từ khóa, thao tác chính, lỗi cần tránh và tiêu chí kiểm tra cuối cùng.`,
      gv:"Hướng dẫn cấu trúc thẻ.",
      sv:"Tạo thẻ; chia sẻ."
    },
    {
      label:"Một phút tổng kết",
      content:x=>`Trong một phút, người học viết ngắn điều quan trọng nhất của ${x}, điểm còn chưa chắc và câu hỏi cần được giải đáp.`,
      gv:"Giao nhiệm vụ tổng kết.",
      sv:"Viết nhanh; nộp phản hồi."
    }
  ];

  function getEnrichment(item){
    const e=enrichments[globalStageIndex % enrichments.length];
    const cycle=Math.floor(globalStageIndex/enrichments.length);
    globalStageIndex++;

    if(cycle===0) return e;

    return {
      label:`${e.label} – mở rộng ${cycle+1}`,
      content:x=>`${e.content(x)} Yêu cầu sử dụng dữ liệu/tình huống khác với lần trước để tránh lặp lại nội dung.`,
      gv:e.gv,
      sv:e.sv
    };
  }

  function coreStage(type,item,slotIndex){
    if(type==="theory"){
      return {
        label:"Nội dung cốt lõi",
        content:`Trình bày trực tiếp ${item}: làm rõ khái niệm, mục đích, đặc điểm, nguyên tắc hoặc trường hợp áp dụng phù hợp với phạm vi của đề mục; liên hệ ngắn với kiến thức trước và nội dung tiếp theo.`,
        gv:"Giải thích; minh họa.",
        sv:"Lắng nghe; ghi chép; trả lời."
      };
    }
    if(type==="practice"){
      return {
        label:"Thao tác cốt lõi",
        content:`Thực hiện ${item} theo đúng quy trình: chuẩn bị dữ liệu/công cụ, thao tác theo thứ tự, kiểm tra kết quả sau từng bước và lưu kết quả đúng yêu cầu.`,
        gv:"Thao tác mẫu; hướng dẫn.",
        sv:"Quan sát; thực hành."
      };
    }
    return {
      label:"Kiến thức và thao tác cốt lõi",
      content:`Làm rõ kiến thức trực tiếp phục vụ ${item}, minh họa thao tác chính và yêu cầu người học thực hiện ngay trên dữ liệu được giao; kiểm tra kết quả trước khi chuyển nội dung.`,
      gv:"Giải thích; thao tác mẫu; hướng dẫn.",
      sv:"Quan sát; thực hành; kiểm tra."
    };
  }

  function addItemRows(item,block,type){
    const times=segmentTimes(block);

    times.forEach((t,i)=>{
      if(i===0){
        const c=coreStage(type,item,i);
        push(`${item} – ${c.label}`,c.content,c.gv,c.sv,t);
      }else{
        const e=getEnrichment(item);
        push(`${item} – ${e.label}`,e.content(item),e.gv,e.sv,t);
      }
    });
  }

  if(type==="theory"){
    const lead=5,endTime=8,self=5;
    const remain=Math.max(0,total-lead-endTime-self);

    push("1. Dẫn nhập",
      "Gợi mở tình huống hoặc kiến thức có liên quan trực tiếp đến bài; nêu vấn đề cần giải quyết và mục tiêu học tập để người học xác định trọng tâm.",
      "Nêu vấn đề; đặt câu hỏi.","Lắng nghe; trả lời.",lead);

    const blocks=distribute(remain,contentItems.length);
    contentItems.forEach((x,i)=>addItemRows(cleanLabel(x),blocks[i],"theory"));

    push("3. Củng cố kiến thức và kết thúc bài",
      "Hệ thống hóa các điểm cốt lõi của toàn bài; kiểm tra nhanh mức độ đạt mục tiêu và nhấn mạnh những nội dung cần ghi nhớ.",
      "Tổng kết; kiểm tra; nhận xét.","Trả lời; hệ thống hóa.",endTime);

    push("4. Hướng dẫn tự học",
      "Giao nhiệm vụ tự học có liên hệ trực tiếp với nội dung vừa học; yêu cầu chuẩn bị dữ liệu/tài liệu cho buổi tiếp theo.",
      "Giao nhiệm vụ.","Ghi nhận nhiệm vụ.",self);

  }else if(type==="practice"){
    const lead=5,initial=10,endTime=8,self=5;
    const remain=Math.max(0,total-lead-initial-endTime-self);

    push("1. Dẫn nhập",
      "Nêu nhiệm vụ thực hành, sản phẩm/kết quả cần đạt, yêu cầu kỹ thuật và tiêu chí đánh giá.",
      "Nêu yêu cầu.","Lắng nghe; xác định nhiệm vụ.",lead);

    push("2. Hướng dẫn ban đầu",
      "Kiểm tra điều kiện thực hành; giới thiệu quy trình tổng quát, dữ liệu/công cụ cần dùng và các điểm an toàn hoặc lưu ý trước khi thao tác.",
      "Hướng dẫn; kiểm tra chuẩn bị.","Quan sát; chuẩn bị.",initial);

    const blocks=distribute(remain,contentItems.length);
    contentItems.forEach((x,i)=>addItemRows(cleanLabel(x),blocks[i],"practice"));

    push("4. Hướng dẫn kết thúc",
      "Nhận xét kết quả thực hành; tổng hợp các lỗi thực tế đã xuất hiện trong buổi học và hướng dẫn cách khắc phục tương ứng.",
      "Nhận xét; tổng kết.","Lắng nghe; sửa lỗi.",endTime);

    push("5. Hướng dẫn tự rèn luyện",
      "Giao nhiệm vụ luyện tập tiếp theo với dữ liệu khác để củng cố kỹ năng; yêu cầu tự đối chiếu bằng checklist hoặc tiêu chí đã học.",
      "Giao nhiệm vụ.","Ghi nhận nhiệm vụ.",self);

  }else{
    const lead=5,intro=8,endTime=8,self=5;
    const remain=Math.max(0,total-lead-intro-endTime-self);

    push("1. Dẫn nhập",
      "Tạo tình huống thực tế gắn với nội dung; nêu vấn đề cần giải quyết, mục tiêu kiến thức – kỹ năng và sản phẩm/kết quả người học cần đạt.",
      "Nêu vấn đề; đặt câu hỏi.","Lắng nghe; trả lời.",lead);

    push("2. Giới thiệu chủ đề",
      "Giới thiệu phạm vi nhiệm vụ, yêu cầu kỹ thuật, dữ liệu/công cụ cần chuẩn bị và tiêu chí đánh giá kết quả.",
      "Giải thích; minh họa.","Quan sát; ghi chép.",intro);

    const blocks=distribute(remain,contentItems.length);
    contentItems.forEach((x,i)=>addItemRows(cleanLabel(x),blocks[i],"integrated"));

    push("4. Kết thúc vấn đề",
      "Đối chiếu kết quả cuối buổi với mục tiêu; chốt kiến thức, kỹ năng đã hình thành và các điểm cần cải thiện.",
      "Tổng kết; nhận xét.","Hệ thống hóa; sửa lỗi.",endTime);

    push("5. Hướng dẫn tự học",
      "Giao nhiệm vụ mở rộng hoặc hoàn thiện sản phẩm bằng dữ liệu khác; yêu cầu chuẩn bị nội dung cho buổi sau.",
      "Giao nhiệm vụ.","Ghi nhận nhiệm vụ.",self);
  }

  const seen=new Set();
  rows.forEach((r,idx)=>{
    const key=(String(r.title)+"||"+String(r.content)).replace(/\s+/g," ").trim().toLowerCase();
    if(seen.has(key)){
      const e=getEnrichment(r.title);
      r.title=`${r.title} – ${e.label}`;
      r.content=e.content(r.title);
      r.gv=e.gv;
      r.sv=e.sv;
    }
    seen.add((String(r.title)+"||"+String(r.content)).replace(/\s+/g," ").trim().toLowerCase());
  });

  return normalizeRows(rows,total);
}
function objectives(type){
  const p=currentProgram(),l=currentLesson(),sec=currentSection();
  const base=`Sau khi học xong nội dung ${sec?.title||""}, người học có khả năng:`;
  if(type==="theory")return `${base}<br>- Trình bày và giải thích được các kiến thức cốt lõi của nội dung học.<br>- Phân tích được ví dụ/tình huống liên quan và vận dụng kiến thức vào nhiệm vụ đơn giản.<br>- Chủ động học tập, trao đổi và tự đánh giá mức độ hiểu bài.`;
  if(type==="practice")return `${base}<br>- Thực hiện đúng quy trình và thao tác kỹ thuật theo yêu cầu.<br>- Tạo được sản phẩm/kết quả đạt tiêu chí cơ bản; phát hiện và sửa được lỗi thường gặp.<br>- Rèn luyện tác phong cẩn thận, chủ động và chịu trách nhiệm với kết quả thực hành.`;
  return `${base}<br>- Trình bày được kiến thức, nguyên tắc hoặc quy trình trực tiếp liên quan đến nhiệm vụ.<br>- Thực hiện được các thao tác và hoàn thiện sản phẩm theo yêu cầu.<br>- Tự kiểm tra, điều chỉnh và chịu trách nhiệm với kết quả học tập.`
}
function buildPaper(){
  const type=$("#type").value,p=currentProgram(),l=currentLesson(),sec=currentSection(),items=selectedContent();
  if(!p||!l||!sec){alert("Vui lòng chọn đủ môn, bài/chương và nội dung.");return}

  if($("#subject").disabled){
    const imported=$("#scheduleImportInfo")?.innerText||"";
    if(!imported.includes(p.name) || !imported.includes(p.code)){
      alert("Không thể tạo giáo án vì Môn học – Mã môn tại Bước 2 không khớp dữ liệu từ Bước 1.");
      return;
    }
  }

  if($("#subject").disabled && !$("#type").disabled){
    alert("Không thể tạo giáo án vì Loại giáo án phải được khóa theo Sổ đầu bài ở Bước 1.");
    return;
  }

  if($("#subject").disabled){
    const expectedPeriods=Number($("#periods").dataset.fromSchedule)||0;
    const actualPeriods=Number($("#periods").value)||0;
    if(expectedPeriods<=0 || actualPeriods!==expectedPeriods){
      alert("Không thể tạo giáo án vì Số tiết tại Bước 2 không khớp Sổ đầu bài ở Bước 1.");
      return;
    }
  }

  if($("#subject").disabled){
    const expectedLesson=$("#lesson").dataset.fromSchedule;
    const actualLesson=$("#lesson").value;
    if(expectedLesson===undefined || actualLesson!==expectedLesson){
      alert("Không thể tạo giáo án vì Bài / Chương tại Bước 2 không khớp Sổ đầu bài ở Bước 1.");
      return;
    }
  }

  if($("#subject").disabled){
    const expectedTotal=Number($("#totalMinutes").dataset.fromSchedule)||0;
    const actualTotal=(Number($("#periods").value)||0)*45;
    if(expectedTotal<=0 || actualTotal!==expectedTotal){
      alert("Không thể tạo giáo án vì Tổng thời gian tại Bước 2 không khớp Sổ đầu bài ở Bước 1.");
      return;
    }
  }
  const total=Number($("#periods").value)*45;
  const stabilize = total>=90 ? 5 : 3;
  const lessonTotal = total-stabilize;
  const rows=activityRows(type,items,lessonTotal);

  const names={theory:"GIÁO ÁN LÝ THUYẾT",practice:"GIÁO ÁN THỰC HÀNH",integrated:"GIÁO ÁN TÍCH HỢP"};
  const prevValue=String($("#prevLesson").value||"").trim();
  let lead;
  if($("#subject").disabled){
    const prevTitle=String($("#prevLesson").dataset.title||"").trim();
    let prevItems=[];
    try{ prevItems=JSON.parse($("#prevLesson").dataset.items||"[]"); }catch(e){ prevItems=[]; }

    if(prevTitle){
      const itemHtml=(prevItems||[]).map(x=>`<div style="margin-left:18px">${escapeHtml(x)}</div>`).join("");
      lead = `<b>Tên bài học trước:</b> ${escapeHtml(prevTitle)}${itemHtml}`;
    }else{
      lead = `<b>Tên bài học trước:</b>`;
    }
  }else{
    lead = type==="theory"
      ? `Tên chương: ${escapeHtml(prevValue||"................................................")}`
      : `Tên bài học trước: ${escapeHtml(prevValue||"................................................")}`;
  }

  const rowHtml=rows.map((r,i)=>`<tr>
    <td class="tt">${i+1}</td>
    <td class="content editable ai-content-cell" contenteditable="true"><b>${escapeHtml(r.title)}</b><br><span class="ai-text">${escapeHtml(r.content)}</span>
      <div class="ai-tools no-print" contenteditable="false">
        <button class="ai-btn" onclick="runRowAI(this,'expand')">✨ Triển khai</button>
        <button class="ai-btn" onclick="runRowAI(this,'rewrite')">✍ Viết lại</button>
        <button class="ai-btn" onclick="runRowAI(this,'example')">➕ Ví dụ</button>
        <button class="ai-btn" onclick="runRowAI(this,'steps')">🔧 Thao tác</button>
        <button class="ai-btn" onclick="runRowAI(this,'errors')">⚠ Lỗi & khắc phục</button>
        <button class="ai-btn" onclick="runRowAI(this,'skillcheck')">✓ Kiểm tra Skill</button>
      </div>
    </td>
    <td class="activity editable" contenteditable="true">${escapeHtml(r.gv)}</td>
    <td class="activity editable" contenteditable="true">${escapeHtml(r.sv)}</td>
    <td class="time"><input class="time-input" type="number" min="0" value="${r.time}" oninput="checkTime()"></td>
  </tr>`).join("");

  $("#paper").innerHTML=`
    <table class="top-template">
      <tr>
        <td class="logo-cell"></td>
        <td class="appendix-cell">
          <div class="appendix-title">PHỤ LỤC 10</div>
          <div class="appendix-note">(Ban hành kèm theo Quyết định số …./QĐ-NSG ngày …tháng … năm 2018 của<br>Hiệu trưởng trường Cao đẳng Bách khoa Nam Sài Gòn)</div>
        </td>
      </tr>
    </table>

    <table class="meta-template">
      <tr>
        <td class="left-meta">
          GIÁO ÁN SỐ: <span contenteditable="true">${escapeHtml($("#gaNumber").value||"............................")}</span>
        </td>
        <td class="right-meta">
          <b>Thời gian thực hiện:</b> ${total} phút (${String(Number($("#periods").value)).padStart(2,"0")} tiết)<br>
          ${lead}<br>
          Thực hiện từ ngày ................. đến ngày .................
        </td>
      </tr>
    </table>

    <div class="lesson-heading">
      ${(()=>{
        const groups=Array.isArray(p?.scheduleGroups) ? p.scheduleGroups : [];
        if(groups.length){
          return `<div class="lesson-main-title"><b>TÊN BÀI:</b></div>` +
            groups.map(g=>{
              const lesson=String(g.lesson||"").trim();
              const its=Array.isArray(g.items)?g.items:[];
              return `<div class="lesson-group">
                <div class="lesson-group-title">${escapeHtml(lesson)}</div>
                ${its.map(x=>`<div class="exact-outline-item">${escapeHtml(String(x||""))}</div>`).join("")}
              </div>`;
            }).join("");
        }

        return `<div class="lesson-main-title"><b>TÊN BÀI:</b> ${escapeHtml(l.title)}</div>` +
          `<div class="lesson-outline exact-outline">${
            (items||[]).map(x=>`<div class="exact-outline-item">${escapeHtml(String(x||""))}</div>`).join("")
          }</div>`;
      })()}
    </div>

    <div class="section-title">MỤC TIÊU CỦA BÀI:</div>
    <div class="editable" contenteditable="true">${objectives(type)}</div>

    <div class="section-title">${type==="theory"?"ĐỒ DÙNG VÀ PHƯƠNG TIỆN DẠY HỌC":"ĐỒ DÙNG VÀ TRANG THIẾT BỊ DẠY HỌC"}</div>
    <div class="editable" contenteditable="true">Máy vi tính; máy chiếu; phần mềm/công cụ phù hợp với chương trình môn học; tài liệu hướng dẫn; dữ liệu hoặc tệp thực hành phục vụ trực tiếp cho nội dung được chọn.</div>

    ${type!=="theory"?`<div class="section-title">HÌNH THỨC TỔ CHỨC DẠY HỌC:</div>
    <div class="editable" contenteditable="true">Tổ chức tại phòng học/phòng máy phù hợp; kết hợp hướng dẫn chung, minh họa/thao tác mẫu, thực hành cá nhân hoặc nhóm và kiểm tra sản phẩm.</div>`:""}

    <div class="section-title">I. ỔN ĐỊNH LỚP HỌC: <span style="font-weight:normal">Thời gian: <b id="stabilizeTime">${stabilize}</b> phút</span></div>
    <div class="editable" contenteditable="true">Kiểm tra sĩ số, thiết bị, phần mềm và điều kiện học tập; ổn định vị trí; bảo đảm người học sẵn sàng tham gia bài học.</div>

    <div class="section-title">II. THỰC HIỆN BÀI HỌC</div>
    <table class="ga">
      <colgroup>
        <col style="width:5%">
        <col style="width:41%">
        <col style="width:22%">
        <col style="width:22%">
        <col style="width:10%">
      </colgroup>
      <thead><tr><th>TT</th><th>NỘI DUNG</th><th>HOẠT ĐỘNG CỦA GIẢNG VIÊN</th><th>HOẠT ĐỘNG CỦA SINH VIÊN</th><th>THỜI GIAN</th></tr></thead>
      <tbody>${rowHtml}</tbody>
      <tfoot>
        <tr><td colspan="4" class="sum" style="text-align:right">CỘNG PHẦN II</td><td class="time sum" id="sumCell">${lessonTotal}</td></tr>
        <tr><td colspan="4" class="sum" style="text-align:right">TỔNG TOÀN BỘ GIÁO ÁN (gồm ổn định lớp)</td><td class="time sum" id="grandTotalCell">${total}</td></tr>
      </tfoot>
    </table>

    ${type!=="theory"?`<div class="section-title">IV. RÚT KINH NGHIỆM TỔ CHỨC THỰC HIỆN:</div>
    <div class="editable" contenteditable="true">....................................................................................................................................................................................</div>`:""}

    ${type==="theory"?`<div class="section-title">Nguồn tài liệu tham khảo</div>
    <div class="editable" contenteditable="true">Chương trình môn học; mẫu giáo án tương ứng; tài liệu chuyên môn do người dùng cung cấp. Khi bổ sung kiến thức ngoài chương trình phải ưu tiên nguồn chính thức/uy tín.</div>`:""}

    <div class="footer-sign">
      <div><b>TRƯỞNG KHOA</b></div>
      <div>Ngày.....tháng.....năm.....<br><b>GIẢNG VIÊN</b></div>
    </div>
  `;
  $("#paper").setAttribute("contenteditable","false");
  checkTime();
}
window.checkTime=function(){
  const target=Number($("#periods").value)*45;
  const stabilize=Number($("#stabilizeTime")?.textContent)||0;
  const vals=$$(".time-input").map(x=>Number(x.value)||0);
  const part2=vals.reduce((a,b)=>a+b,0);
  const sum=part2+stabilize;
  if($("#sumCell"))$("#sumCell").textContent=part2;
  if($("#grandTotalCell"))$("#grandTotalCell").textContent=sum;

  const over=vals.filter(v=>v>15).length;
  const at15=vals.filter(v=>v===15).length;
  const over12=vals.filter(v=>v>12 && v<=15).length;
  const under5=vals.filter(v=>v>0 && v<5).length;
  const el=$("#timeStatus");

  if(sum!==target){
    el.className="status bad";
    el.textContent=`Chưa đạt Skill: tổng hiện tại ${sum}/${target} phút (${sum-target>0?"+":""}${sum-target} phút). Phải cân đối lại để đúng tuyệt đối.`;
    return;
  }
  if(over>0){
    el.className="status bad";
    el.textContent=`Chưa đạt Skill: có ${over} hoạt động vượt 15 phút. Bắt buộc chia nhỏ.`;
    return;
  }
  if(over12>0 || under5>0){
    el.className="status warn";
    el.textContent=`Đủ ${sum}/${target} phút. Không vượt 15 phút; tuy nhiên có ${over12} hoạt động 13–15 phút${at15?` (${at15} hoạt động đúng 15 phút)`:""}${under5?` và ${under5} hoạt động dưới 5 phút`:""}. Skill ưu tiên 5–12 phút, vì vậy nên tiếp tục tối ưu khi có thể.`;
    return;
  }
  el.className="status ok";
  el.textContent=`Đạt Skill: ${sum}/${target} phút; các hoạt động nằm trong vùng ưu tiên 5–12 phút; không có hoạt động vượt 15 phút.`;
}

function getAIKey(){
  const key=$("#apiKey")?.value.trim() || (window.parent.GEMINI_KEY || '') || "";
  return key;
}
function getAIModel(){
  return $("#aiModel")?.value || (window.parent.GEMINI_MODEL || 'gemini-1.5-flash') || "gemini-3.7-flash";
}
function saveAISettings(){
  const key=$("#apiKey").value.trim();
  const model=$("#aiModel").value;
  if($("#saveKey").value==="yes"){
    if(key) localStorage.setItem("giaoan_gemini_key",key);
  }else{
    localStorage.removeItem("giaoan_gemini_key");
  }
  localStorage.setItem("giaoan_gemini_model",model);
  $("#aiStatus").className="status ok";
  $("#aiStatus").textContent=`Đã lưu cài đặt Gemini. Model: ${model}.`;
}
function loadAISettings(){
  const key=window.parent.GEMINI_KEY || localStorage.getItem("giaoan_gemini_key") || "";
  let model=window.parent.GEMINI_MODEL || localStorage.getItem("giaoan_gemini_model") || "gemini-3.7-flash";
  const retired=["gemini-2.5-flash","gemini-2.5-pro","gemini-2.5-flash-lite"];
  if(retired.includes(model)){
    model="gemini-3.7-flash";
    localStorage.setItem("giaoan_gemini_model",model);
  }
  if($("#apiKey")) $("#apiKey").value=key;
  if($("#aiModel")) $("#aiModel").value=model;
  if($("#aiStatus")){
    if(key){
      $("#aiStatus").className="status ok";
      $("#aiStatus").textContent=`Đã có API key trên máy. Model: ${model}.`;
    }
  }
}

async function testGeminiConnection(){
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready;
    }
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    $("#aiStatus").className="status warn";
    $("#aiStatus").textContent="Đang kiểm tra kết nối Gemini...";
    const result=await callOpenAI("Chỉ trả lời đúng một từ: OK");
    $("#aiStatus").className="status ok";
    $("#aiStatus").textContent=`Kết nối Gemini thành công. Model: ${getAIModel()}.`;
  }catch(e){
    $("#aiStatus").className="status bad";
    let msg=e.message||"Lỗi không xác định";
    if(/API key|API_KEY_INVALID|invalid key|key not valid/i.test(msg)){
      msg="Gemini API Key không hợp lệ. Hãy tạo/kiểm tra key trong Google AI Studio.";
    }else if(/quota|RESOURCE_EXHAUSTED|429/i.test(msg)){
      msg="Đã vượt hạn mức/quota Gemini API. Hãy kiểm tra quota hoặc billing của Google AI Studio.";
    }else if(/not found|model/i.test(msg)){
      msg="Model Gemini đã chọn không khả dụng với API key này. Hãy thử gemini-3.7-flash.";
    }
    $("#aiStatus").textContent="Không kết nối được Gemini: "+msg;
    alert("Không kết nối được Gemini: "+msg);
  }
}

function skillRulesText(){
  return `
BẮT BUỘC BÁM SÁT SKILL SOẠN GIÁO ÁN:
- Đúng môn học, mã môn, bài/chương, đề mục, mục tiêu và phạm vi chương trình.
- Không tự đổi tên bài, mã môn, số tiết hay phạm vi nội dung.
- Đúng cấu trúc riêng của loại giáo án; tuyệt đối không trộn Lý thuyết/Thực hành/Tích hợp.
- 01 tiết = 45 phút; tổng thời gian phải chính xác.
- Mỗi nội dung/tiểu hoạt động ưu tiên 5–12 phút; hạn chế tối đa 15 phút; không để lý thuyết/hướng dẫn thao tác vượt 15 phút.
- Cột NỘI DUNG phải chi tiết, đủ để giảng viên nhìn vào là triển khai được ngay.
- Nếu là lý thuyết, khi phù hợp phải có: khái niệm, bản chất, đặc điểm, vai trò, phân loại, nguyên tắc, thành phần, quy tắc sử dụng, trường hợp áp dụng, ví dụ, so sánh, lỗi nhận thức, câu hỏi kiểm tra.
- Nếu là thực hành/tích hợp, khi phù hợp phải có: mục tiêu thao tác, công cụ, chuẩn bị dữ liệu/môi trường, điều kiện đầu vào, quy trình, bước thực hiện, thao tác cụ thể, kết quả mong đợi, cách kiểm tra, lỗi thường gặp, nguyên nhân, cách sửa, mẹo, yêu cầu sản phẩm, tiêu chí đánh giá, bài tập áp dụng.
- Khi chương trình ghi ngắn nhưng thời lượng lớn, phải phát triển thêm nội dung chuyên môn có giá trị; không lặp câu chữ, không kéo dài cơ học, không lan man, không bịa kiến thức.
- Giáo án Tích hợp phải có kiến thức + minh họa/thao tác mẫu + SV thực hành + kiểm tra/sửa lỗi + củng cố.
- Giáo án Thực hành ưu tiên phần lớn thời gian cho thao tác mẫu, luyện tập, kiểm tra sản phẩm, sửa lỗi.
- Giáo án Lý thuyết phải có dẫn nhập, kiến thức mới, ví dụ/minh họa, tương tác, câu hỏi, vận dụng, củng cố.
- Hoạt động của giảng viên viết ngắn gọn, chỉ hành động.
- Hoạt động của sinh viên viết ngắn gọn, tương ứng trực tiếp với GV và nội dung.
- Phải có ví dụ/minh họa/bài tập/lỗi thường gặp/tiêu chí sản phẩm khi phù hợp.
`;
}
function currentContext(){
  const p=currentProgram(),l=currentLesson(),s=currentSection();
  const total=Number($("#periods").value)*45;
  return `
Môn học: ${p?.name||""}
Mã môn: ${p?.code||""}
Loại giáo án: ${$("#type option:checked")?.textContent||""}
Bài/Chương: ${l?.title||""}
Đề mục: ${s?.title||""}
Các tiểu mục được chọn: ${selectedContent().join(" | ")}
Số tiết: ${$("#periods").value}
Tổng thời gian giáo án: ${total} phút
`;
}
async function listGeminiModels(key){
  const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models",{
    headers:{"x-goog-api-key":key}
  });
  const data=await res.json();
  if(!res.ok) throw new Error(data?.error?.message||("Không lấy được danh sách model: HTTP "+res.status));
  return (data.models||[])
    .filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent"))
    .map(m=>m.name.replace(/^models\//,""));
}

function modelPriority(models, preferred){
  const uniq=[];
  const add=m=>{if(m && models.includes(m) && !uniq.includes(m))uniq.push(m)};
  add(preferred);
  models.filter(m=>/flash/i.test(m) && !/lite/i.test(m)).sort().reverse().forEach(add);
  models.filter(m=>/flash-lite/i.test(m)).sort().reverse().forEach(add);
  models.filter(m=>/pro/i.test(m)).sort().reverse().forEach(add);
  models.forEach(add);
  return uniq;
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function generateWithGemini(key,model,prompt){
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const res=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","x-goog-api-key":key},
    body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}]})
  });
  const data=await res.json();
  if(!res.ok){
    const err=new Error(data?.error?.message||("Gemini API HTTP "+res.status));
    err.status=res.status; err.model=model; throw err;
  }
  const parts=data?.candidates?.[0]?.content?.parts||[];
  const out=parts.map(p=>p.text||"").join("\n").trim();
  if(!out) throw new Error("Gemini không trả về nội dung.");
  return out;
}

async function callOpenAI(prompt){
  const key=getAIKey();
  if(!key) throw new Error("Chưa có Google/Gemini API Key.");

  let models;
  try{
    models=await listGeminiModels(key);
  }catch(e){
    models=[getAIModel()];
  }
  const candidates=modelPriority(models,getAIModel());
  if(!candidates.length) throw new Error("API key này không có model hỗ trợ generateContent.");

  let lastErr=null;
  for(let mi=0;mi<candidates.length;mi++){
    const model=candidates[mi];
    for(let attempt=1;attempt<=3;attempt++){
      try{
        if($("#aiStatus")){
          $("#aiStatus").className="status warn";
          $("#aiStatus").textContent=`Đang gọi ${model}${attempt>1?` – thử lại ${attempt}/3`:""}...`;
        }
        const out=await generateWithGemini(key,model,prompt);
        localStorage.setItem("giaoan_gemini_model",model);
        if($("#aiModel")){
          let opt=[...$("#aiModel").options].find(o=>o.value===model);
          if(!opt){opt=new Option(model,model);$("#aiModel").add(opt)}
          $("#aiModel").value=model;
        }
        return out;
      }catch(e){
        lastErr=e;
        const msg=(e.message||"").toLowerCase();
        const temporary=e.status===429 || e.status===503 ||
          /high demand|overloaded|temporar|resource_exhausted|unavailable|try again later/.test(msg);
        if(temporary && attempt<3){
          if($("#aiStatus")) $("#aiStatus").textContent=`${model} đang bận. Tự thử lại sau ${attempt*2} giây...`;
          await sleep(attempt*2000);
          continue;
        }
        if(temporary){
          if($("#aiStatus")) $("#aiStatus").textContent=`${model} vẫn đang bận. Đang tự chuyển model dự phòng...`;
          break;
        }
        if(e.status===404 || /not found|not supported|no longer available/.test(msg)) break;
        throw e;
      }
    }
  }
  throw lastErr||new Error("Không có model Gemini khả dụng lúc này.");
}

async function refreshGeminiModels(){
  const key=getAIKey();
  if(!key) return;
  try{
    const models=await listGeminiModels(key);
    const sel=$("#aiModel");
    const current=getAIModel();
    sel.innerHTML="";
    modelPriority(models,current).forEach((m,i)=>sel.add(new Option(m+(i===0?" (ưu tiên)":""),m)));
    if(models.includes(current))sel.value=current;
    $("#aiStatus").className="status ok";
    $("#aiStatus").textContent=`Đã tải ${models.length} model Gemini khả dụng từ API.`;
  }catch(e){
    $("#aiStatus").className="status warn";
    $("#aiStatus").textContent="Chưa tải được danh sách model động: "+e.message;
  }
}
function cleanAIText(t){
  return String(t||"").replace(/^```(?:html|text|markdown)?/i,"").replace(/```$/,"").trim();
}
function rowPrompt(cell, action){
  const current=cell.querySelector(".ai-text")?.innerText.trim() || cell.innerText.trim();
  const minutes=Number(cell.closest("tr")?.querySelector(".time-input")?.value)||0;
  const actionMap={
    expand:"Triển khai nội dung hiện tại chi tiết hơn, giàu giá trị giảng dạy, nhưng tuyệt đối không lan man.",
    rewrite:"Viết lại nội dung hiện tại rõ ràng, mạch lạc, chuyên nghiệp và đúng phong cách cột NỘI DUNG của giáo án.",
    example:"Bổ sung ví dụ/minh họa sát đề mục, có thể dùng trực tiếp khi giảng dạy.",
    steps:"Bổ sung quy trình/bước thực hiện cụ thể, thao tác theo thứ tự, kết quả mong đợi và cách kiểm tra.",
    errors:"Bổ sung lỗi thường gặp, nguyên nhân, cách khắc phục và mẹo thực hiện khi phù hợp.",
    skillcheck:"Kiểm tra đoạn hiện tại theo Skill; viết lại thành phiên bản đạt yêu cầu, loại bỏ nội dung chung chung hoặc thiếu chi tiết."
  };
  return `
Bạn là trợ lý chuyên soạn giáo án nghề nghiệp.
${skillRulesText()}
NGỮ CẢNH:
${currentContext()}
Thời lượng của hoạt động hiện tại: ${minutes} phút.

YÊU CẦU AI:
${actionMap[action]||actionMap.rewrite}

NỘI DUNG HIỆN TẠI:
${current}

QUY TẮC ĐẦU RA:
- Chỉ trả về NỘI DUNG đã hoàn thiện để đưa vào chính ô này.
- Không trả về tiêu đề "NỘI DUNG", không giải thích cách làm, không chào hỏi.
- Không tự thêm thời gian.
- Không đổi tên môn/bài/đề mục.
- Mức độ chi tiết phải phù hợp với ${minutes} phút.
`;
}
window.runRowAI=async function(btn,action){
  const cell=btn.closest(".ai-content-cell");
  if(!cell)return;
  const oldText=cell.querySelector(".ai-text")?.innerText.trim()||"";
  try{
    btn.closest(".ai-tools").classList.add("ai-loading");
    $("#aiStatus").className="status warn";
    $("#aiStatus").textContent="Gemini đang xử lý nội dung...";
    const result=cleanAIText(await callOpenAI(rowPrompt(cell,action)));
    showAICompare(cell,oldText,result);
    $("#aiStatus").className="status ok";
    $("#aiStatus").textContent="Gemini đã tạo đề xuất. Hãy xem trước trước khi áp dụng.";
  }catch(e){
    $("#aiStatus").className="status bad";
    $("#aiStatus").textContent="Lỗi Gemini: "+e.message;
    alert("Không gọi được Gemini: "+e.message);
  }finally{
    btn.closest(".ai-tools").classList.remove("ai-loading");
  }
}
function showAICompare(cell,oldText,newText){
  showModal("Gemini đề xuất chỉnh sửa",`
    <div class="row2">
      <div><label>Nội dung hiện tại</label><textarea id="aiOld" style="min-height:300px">${escapeHtml(oldText)}</textarea></div>
      <div><label>Gemini đề xuất</label><textarea id="aiNew" style="min-height:300px">${escapeHtml(newText)}</textarea></div>
    </div>
    <div class="toolbar" style="margin-top:12px">
      <button class="btn primary" id="aiReplace">Thay thế</button>
      <button class="btn" id="aiAppend">Chèn thêm</button>
      <button class="btn" id="aiCancel">Hủy</button>
    </div>`);
  $("#aiReplace").onclick=()=>{
    cell.querySelector(".ai-text").innerText=$("#aiNew").value.trim();
    closeModal();
  };
  $("#aiAppend").onclick=()=>{
    const current=cell.querySelector(".ai-text").innerText.trim();
    cell.querySelector(".ai-text").innerText=current+"\n"+$("#aiNew").value.trim();
    closeModal();
  };
  $("#aiCancel").onclick=closeModal;
}
async function runWholeAI(){
  if(!$("#paper table.ga")) return alert("Hãy tạo giáo án trước.");
  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready;
    }
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    $("#aiStatus").className="status warn";
    $("#aiStatus").textContent="Gemini đang rà soát toàn bộ giáo án...";
    const rows=$$("#paper table.ga tbody tr");
    const payload=rows.map((tr,i)=>({
      index:i+1,
      content:tr.querySelector(".ai-text")?.innerText.trim()||"",
      gv:tr.children[2]?.innerText.trim()||"",
      sv:tr.children[3]?.innerText.trim()||"",
      time:Number(tr.querySelector(".time-input")?.value)||0
    }));
    const prompt=`
Bạn là chuyên gia kiểm định và hoàn thiện giáo án.
${skillRulesText()}
NGỮ CẢNH:
${currentContext()}

DỮ LIỆU CÁC HOẠT ĐỘNG HIỆN TẠI:
${JSON.stringify(payload,null,2)}

Hãy rà soát toàn bộ và trả về CHỈ một JSON array hợp lệ, mỗi phần tử dạng:
{"index":1,"content":"...","gv":"...","sv":"..."}
Yêu cầu:
- Giữ nguyên số lượng dòng và index.
- Không thay đổi thời gian.
- Viết cột content thật chi tiết, sát đề mục, không chung chung.
- gv và sv ngắn gọn, chỉ mô tả hành động, tương ứng trực tiếp với content.
- Không thêm markdown, không bao JSON bằng code fence.
`;
    const raw=cleanAIText(await callOpenAI(prompt));
    let arr;
    try{arr=JSON.parse(raw)}catch(e){throw new Error("Gemini chưa trả về JSON hợp lệ. Hãy thử lại.")}
    if(!Array.isArray(arr))throw new Error("Định dạng Gemini trả về không đúng.");
    showModal("Gemini hoàn thiện toàn bộ giáo án",`
      <p>Gemini đã đề xuất cập nhật <b>${arr.length}</b> hoạt động. Hệ thống sẽ không thay đổi thời gian.</p>
      <div class="note">Nên xem nhanh nội dung sau khi áp dụng và bấm <b>Kiểm tra thời gian</b>.</div>
      <div class="toolbar" style="margin-top:12px">
        <button class="btn primary" id="applyWholeAI">Áp dụng toàn bộ</button>
        <button class="btn" id="cancelWholeAI">Hủy</button>
      </div>`);
    $("#applyWholeAI").onclick=()=>{
      arr.forEach(x=>{
        const tr=rows[Number(x.index)-1]; if(!tr)return;
        const aiText=tr.querySelector(".ai-text"); if(aiText&&x.content)aiText.innerText=x.content;
        if(tr.children[2]&&x.gv)tr.children[2].innerText=x.gv;
        if(tr.children[3]&&x.sv)tr.children[3].innerText=x.sv;
      });
      closeModal();checkTime();
      $("#aiStatus").className="status ok";
      $("#aiStatus").textContent="Đã áp dụng Gemini cho toàn bộ giáo án.";
    };
    $("#cancelWholeAI").onclick=closeModal;
  }catch(e){
    $("#aiStatus").className="status bad";
    $("#aiStatus").textContent="Lỗi Gemini: "+e.message;
    alert(e.message);
  }
}

function runTimeCheck(){
  if(!$("#paper table.ga")){
    const p=Number($("#periods").value)||0;
    if(p<=0){
      $("#timeStatus").className="status bad";
      $("#timeStatus").textContent="Chưa có dữ liệu buổi học từ Sổ đầu bài để kiểm tra thời gian.";
      $("#timeStatus").scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }
    $("#timeStatus").className="status warn";
    $("#timeStatus").textContent=`Buổi học có ${p} tiết = ${p*45} phút. Hãy bấm Tạo giáo án trước để kiểm tra tổng thời gian của các hoạt động.`;
    $("#timeStatus").scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  checkTime();
  const status=$("#timeStatus");
  status.scrollIntoView({behavior:"smooth",block:"center"});
  const msg=status.textContent.trim();
  if(status.classList.contains("bad")){
    alert("KIỂM TRA THỜI GIAN\\n\\n"+msg);
  }else if(status.classList.contains("warn")){
    alert("KIỂM TRA THỜI GIAN\\n\\n"+msg);
  }else{
    alert("KIỂM TRA THỜI GIAN\\n\\n"+msg);
  }
}

function addRow(){
  const tbody=$("#paper table.ga tbody"); if(!tbody){alert("Hãy tạo giáo án trước.");return}
  const i=tbody.children.length+1;
  const tr=document.createElement("tr");
  tr.innerHTML=`<td class="tt">${i}</td><td class="content editable" contenteditable="true"><b>Nội dung bổ sung</b><br>Mô tả chi tiết...</td><td class="activity editable" contenteditable="true">Hướng dẫn.</td><td class="activity editable" contenteditable="true">Thực hiện.</td><td class="time"><input class="time-input" type="number" min="0" value="5" oninput="checkTime()"></td>`;
  tbody.appendChild(tr);checkTime()
}

async function importJSON(text){
  const obj=JSON.parse(text);
  const list=Array.isArray(obj)?obj:[obj];
  for(const p0 of list){
    if(!p0.code||!p0.name||!Array.isArray(p0.lessons)) throw new Error("JSON chưa đúng cấu trúc chương trình.");
    const exist=programs.find(p=>p.code===p0.code && (p.version||"")===(p0.version||""));
    if(exist){
      const choice=confirm(`Đã có ${p0.code}${p0.version?" phiên bản "+p0.version:""}. Bấm OK để cập nhật; Cancel để lưu bản mới.`);
      if(choice){p0.id=exist.id;await putProgram(p0)}
      else{delete p0.id; p0.version=p0.version||new Date().getFullYear()+"-"+Date.now(); await addProgram(p0)}
    }else await addProgram(p0);
  }
  programs=await getAll();renderSubjects()
}
function basicParseText(text, filename){
  const clean=text.replace(/\r/g,"").replace(/\t/g," ").replace(/[ ]{2,}/g," ");
  const code=(clean.match(/Mã (?:số )?môn học\s*:?\s*(MH\s*\d+)/i)||[])[1]?.replace(/\s+/g,"") || prompt("Không tự nhận diện được mã môn. Nhập mã môn:");
  const name=(clean.match(/Tên môn học\s*:?\s*([^\n]+)/i)||[])[1]?.trim() || prompt("Không tự nhận diện được tên môn. Nhập tên môn:");
  const hours=Number((clean.match(/(?:Thời gian thực hiện môn học|Thời gian môn học)\s*:?\s*(\d+)\s*giờ/i)||[])[1])||0;
  const lines=clean.split("\n").map(x=>x.trim()).filter(Boolean);
  const lessonIdx=[];
  lines.forEach((x,i)=>{if(/^(Bài|Chương)\s*\d+\s*(:|\.)/i.test(x) || /^(Bài tập tổng hợp|Kiểm tra|Thi(?: kết thúc)?)/i.test(x))lessonIdx.push(i)});
  const lessons=[];
  for(let k=0;k<lessonIdx.length;k++){
    const start=lessonIdx[k],end=lessonIdx[k+1]??lines.length,title=lines[start];
    const chunk=lines.slice(start+1,end);
    const sections=[];
    chunk.forEach(x=>{
      if(/^\d+(?:\.\d+)?\.\s+/.test(x) || /^\d+\.\s+/.test(x)){
        if(/^\d+\.\d+\.\s+/.test(x) && sections.length) sections[sections.length-1].items.push(x);
        else sections.push({title:x,items:[]});
      }
    });
    lessons.push({title,hours:0,sections});
  }
  return {code,name,totalHours:hours,version:String(new Date().getFullYear()),lessons,sourceFile:filename}
}
async function handleProgramFile(file){
  const ext=file.name.split(".").pop().toLowerCase();
  if(ext==="json"){
    await importJSON(await file.text());
    alert("Đã nhập chương trình.");
    return
  }
  if(ext==="txt"){
    const p=basicParseText(await file.text(),file.name); previewParsed(p); return
  }
  if(ext==="docx"){
    try{
      if(!window.mammoth) await loadScript("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js");
      const arr=await file.arrayBuffer();const result=await mammoth.extractRawText({arrayBuffer:arr});
      previewParsed(basicParseText(result.value,file.name));return
    }catch(e){showModal("Không đọc được DOCX",`<p>Trình duyệt đang chạy ngoại tuyến hoặc thư viện đọc DOCX chưa tải được.</p><p>Giải pháp ổn định: lưu chương trình thành <b>TXT</b> hoặc <b>JSON</b> rồi nhập lại.</p><p>${escapeHtml(e.message)}</p>`);return}
  }
  if(ext==="pdf"){
    showModal("Nhập PDF",`<p>Bản HTML độc lập chưa OCR/đọc PDF phức tạp ngoại tuyến một cách tin cậy.</p><p>Để tránh nhập sai chương trình, hãy chuyển PDF thành TXT/JSON hoặc dùng bản XAMPP có bộ đọc PDF phía máy chủ.</p>`);
    return
  }
}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("Không tải được thư viện"));document.head.appendChild(s)})}
function previewParsed(p){
  showModal("Xem trước chương trình được nhận diện",`
    <p><b>Môn:</b> ${escapeHtml(p.name||"")}</p>
    <p><b>Mã:</b> ${escapeHtml(p.code||"")} &nbsp; <b>Tổng giờ:</b> ${p.totalHours||"?"}</p>
    <p><b>Phát hiện:</b> ${p.lessons.length} bài/chương</p>
    <div style="max-height:320px;overflow:auto;border:1px solid #ddd;padding:8px"><pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify(p.lessons,null,2))}</pre></div>
    <div class="toolbar" style="margin-top:12px"><button class="btn primary" id="confirmParsed">Xác nhận nhập</button></div>`);
  $("#confirmParsed").onclick=async()=>{await addProgram(p);programs=await getAll();renderSubjects();closeModal();alert("Đã nhập chương trình.")}
}
function newProgram(){
  showModal("Tạo chương trình thủ công",`
    <div class="row2"><div><label>Mã môn</label><input id="npCode"></div><div><label>Tổng giờ</label><input id="npHours" type="number"></div></div>
    <label>Tên môn</label><input id="npName">
    <label>Phiên bản</label><input id="npVersion" value="${new Date().getFullYear()}">
    <p class="hint">Sau khi tạo, có thể nhập chương trình chi tiết bằng JSON để có đầy đủ bài, mục và tiểu mục.</p>
    <button class="btn primary" id="npSave">Lưu</button>`);
  $("#npSave").onclick=async()=>{const p={code:$("#npCode").value.trim(),name:$("#npName").value.trim(),totalHours:Number($("#npHours").value)||0,version:$("#npVersion").value.trim(),lessons:[]};if(!p.code||!p.name)return alert("Cần mã môn và tên môn.");await addProgram(p);programs=await getAll();renderSubjects();closeModal()}
}
function exportBlob(name,data,type){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},300)
}
function backup(){exportBlob(`backup_giao_an_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(programs,null,2),"application/json")}
function getCleanPaperClone(){
  if(!$("#paper table")) return null;
  const clone=$("#paper").cloneNode(true);
  clone.querySelectorAll(".ai-tools").forEach(x=>x.remove());
  clone.querySelectorAll("table.ga tfoot").forEach(x=>x.remove());
  clone.querySelectorAll(".time-input").forEach(inp=>{
    const span=document.createElement("span");
    span.textContent=inp.value;
    inp.replaceWith(span);
  });
  clone.querySelectorAll("[contenteditable]").forEach(x=>x.removeAttribute("contenteditable"));
  return clone;
}

function exportWord(){
  const clone=getCleanPaperClone();
  if(!clone){alert("Hãy tạo giáo án trước.");return;}

  const css=`
    @page{size:A4 portrait;margin:20mm 15mm 20mm 20mm}
    body{font-family:"Times New Roman",serif;font-size:12pt;color:#111;margin:0}
    table{border-collapse:collapse;width:100%;table-layout:fixed}
    th,td{border:1px solid #222;padding:5px;vertical-align:top;line-height:1.2}
    .top-template td,.meta-template td{border:1px dashed #999}
    .top-template{width:100%;border-collapse:collapse;margin-bottom:0}
    .logo-cell{width:28%;height:76px}
    .appendix-cell{text-align:center;height:76px;line-height:1.2}
    .appendix-title{font-weight:bold;font-size:16px}
    .appendix-note{font-style:italic;font-size:14px}
    .meta-template{width:93%;margin:0 auto;border-collapse:collapse}
    .left-meta{width:40%;font-weight:bold}
    .right-meta{width:60%;line-height:1.2}
    .lesson-heading{margin-top:16px;font-size:12pt;line-height:1.2}
    .lesson-main-title{font-weight:bold}
    .lesson-outline{margin:4px 0 0 46px;padding-left:22px;font-weight:bold}
    .lesson-outline li{padding-left:4px;margin:2px 0}.exact-outline{margin:4px 0 0 46px;font-weight:bold}.exact-outline-item{margin:2px 0}
    .section-title{font-weight:bold;margin:10px 0 5px;font-size:12pt}
    table.ga{width:100%;table-layout:fixed}
    table.ga th,table.ga td{border:1.2px solid #111;padding:5px;vertical-align:top;font-size:12pt;line-height:1.22;color:#000;background:#fff}
    table.ga th:nth-child(1),table.ga td:nth-child(1){width:5%}
    table.ga th:nth-child(2),table.ga td:nth-child(2){width:41%}
    table.ga th:nth-child(3),table.ga td:nth-child(3){width:22%}
    table.ga th:nth-child(4),table.ga td:nth-child(4){width:22%}
    table.ga th:nth-child(5),table.ga td:nth-child(5){width:10%}
    .footer-sign{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:28px}
  `;

  const doc=`<!doctype html>
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Giáo án</title>
    <style>${css}</style>
  </head>
  <body>${clone.innerHTML}</body>
  </html>`;

  const blob=new Blob(["\ufeff",doc],{type:"application/msword;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`Giao_an_${currentProgram()?.code||"mon_hoc"}_${new Date().toISOString().slice(0,10)}.doc`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},300);
}

async function exportPdf(){
  if(!$("#paper table")){alert("Hãy tạo giáo án trước.");return;}

  if(typeof html2pdf==="undefined"){
    alert("Chưa tải được thư viện xuất PDF. Vui lòng kiểm tra kết nối Internet rồi thử lại.");
    return;
  }

  const clone=getCleanPaperClone();
  if(!clone){alert("Hãy tạo giáo án trước.");return;}

  clone.querySelectorAll(".no-print,.ai-tools,button,input,select").forEach(el=>{
    if(el.classList?.contains("time-input")){
      const span=document.createElement("span");
      span.textContent=el.value;
      el.replaceWith(span);
    }else if(el.tagName==="INPUT" || el.tagName==="SELECT"){
      const span=document.createElement("span");
      span.textContent=el.value||el.options?.[el.selectedIndex]?.text||"";
      el.replaceWith(span);
    }else{
      el.remove();
    }
  });

  const holder=document.createElement("div");
  holder.style.width="175mm";
  holder.style.background="#fff";
  holder.style.fontFamily='"Times New Roman", serif';
  holder.style.fontSize="12pt";
  holder.style.color="#111";
  holder.style.padding="0";
  holder.style.boxSizing="border-box";
  holder.style.overflow="visible";
  holder.appendChild(clone);

  const paper=holder.querySelector(".paper") || clone;
  paper.style.width="175mm";
  paper.style.maxWidth="175mm";
  paper.style.minHeight="auto";
  paper.style.margin="0";
  paper.style.padding="0";
  paper.style.border="0";
  paper.style.boxShadow="none";

  const pdfStyle=document.createElement("style");
  pdfStyle.textContent=`
    *{
      box-sizing:border-box!important;
      -webkit-print-color-adjust:exact!important;
      print-color-adjust:exact!important;
      text-rendering:geometricPrecision!important;
    }
    .paper{
      width:175mm!important;
      max-width:175mm!important;
      min-width:175mm!important;
      min-height:0!important;
      padding:0!important;
      margin:0!important;
      border:0!important;
      box-shadow:none!important;
      overflow:visible!important;
      background:#fff!important;
      color:#000!important;
      font-family:"Times New Roman",serif!important;
      font-size:12pt!important;
    }
    table{
      border-collapse:collapse!important;
      border-spacing:0!important;
      page-break-inside:auto!important;
    }
    table.ga{
      width:175mm!important;
      max-width:175mm!important;
      table-layout:fixed!important;
      border:1.2px solid #000!important;
      background:#fff!important;
    }
    table.ga thead{
      display:table-header-group!important;
    }
    table.ga tr{
      page-break-inside:avoid!important;
      break-inside:avoid!important;
    }
    table.ga th,table.ga td{
      border:1.2px solid #000!important;
      padding:5px!important;
      vertical-align:top!important;
      box-sizing:border-box!important;
      overflow:visible!important;
      overflow-wrap:break-word!important;
      word-break:normal!important;
      white-space:normal!important;
      color:#000!important;
      background:#fff!important;
      font-family:"Times New Roman",serif!important;
      font-size:12pt!important;
      line-height:1.22!important;
    }
    table.ga th{
      font-weight:700!important;
      text-align:center!important;
    }
    table.ga th:nth-child(1),table.ga td:nth-child(1){width:5%!important;min-width:5%!important;max-width:5%!important}
    table.ga th:nth-child(2),table.ga td:nth-child(2){width:41%!important;min-width:41%!important;max-width:41%!important}
    table.ga th:nth-child(3),table.ga td:nth-child(3){width:22%!important;min-width:22%!important;max-width:22%!important}
    table.ga th:nth-child(4),table.ga td:nth-child(4){width:22%!important;min-width:22%!important;max-width:22%!important}
    table.ga th:nth-child(5),table.ga td:nth-child(5){width:10%!important;min-width:10%!important;max-width:10%!important}
    .top-template,.meta-template{
      width:100%!important;
      table-layout:fixed!important;
      border-collapse:collapse!important;
    }
    .top-template td,.meta-template td{
      border:1px solid #777!important;
      color:#000!important;
      background:#fff!important;
      overflow:visible!important;
      white-space:normal!important;
    }
  `;
  holder.prepend(pdfStyle);

  const filename=`Giao_an_${currentProgram()?.code||"mon_hoc"}_${new Date().toISOString().slice(0,10)}.pdf`;

  const opt={
    margin:[20,15,20,20],
    filename,
    image:{type:"png",quality:1},
    html2canvas:{
      scale:3,
      useCORS:true,
      allowTaint:false,
      backgroundColor:"#ffffff",
      logging:false,
      scrollX:0,
      scrollY:0,
      windowWidth:Math.ceil(175/25.4*96),
      letterRendering:true
    },
    jsPDF:{
      unit:"mm",
      format:"a4",
      orientation:"portrait",
      compress:true
    },
    pagebreak:{
      mode:["css","legacy"],
      avoid:["tr","thead",".top-template",".meta-template",".lesson-heading",".section-title"]
    }
  };

  try{
    if(document.fonts && document.fonts.ready){
      await document.fonts.ready;
    }
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

    $("#aiStatus").className="status warn";
    $("#aiStatus").textContent="Đang tạo PDF A4, không kèm ngày giờ, tên trang, đường dẫn hay số trang của trình duyệt...";
    await html2pdf().set(opt).from(holder).save();
    $("#aiStatus").className="status ok";
    $("#aiStatus").textContent="Đã xuất PDF A4 sạch, không có header/footer của trình duyệt.";
  }catch(e){
    console.error(e);
    $("#aiStatus").className="status bad";
    $("#aiStatus").textContent="Không xuất được PDF: "+(e?.message||e);
    alert("Không xuất được PDF: "+(e?.message||e));
  }
}

let receivedFullProgram=null;
let receivedFullCourse=null;

function escProgram(s){ return escapeHtml(String(s??"")); }

function renderFullProgramViewer(){
  const box=$("#fullProgramViewer");
  if(!box) return;
  const seq=receivedFullProgram||[];
  const c=receivedFullCourse||{};
  if(!seq.length){
    box.innerHTML='<div class="hint">Không có dữ liệu chương trình để hiển thị.</div>';
    return;
  }

  let html=`
    <div style="font-family:'Times New Roman',serif">
      <div style="text-align:center;font-weight:bold;font-size:18px;margin-bottom:8px">CHƯƠNG TRÌNH MÔN HỌC</div>
      <div><b>Tên môn học:</b> ${escProgram(c.name||"")}</div>
      <div><b>Mã môn:</b> ${escProgram(c.code||"")}</div>
      <div><b>Thời gian môn học:</b> ${Number(c.total||0)} giờ
        ${c.lt||c.th||c.kt ? ` (Lý thuyết: ${Number(c.lt||0)} giờ; Thực hành: ${Number(c.th||0)} giờ; Kiểm tra/Thi: ${Number(c.kt||0)} giờ)` : ""}
      </div>
      <hr style="border:0;border-top:1px solid #ddd;margin:10px 0">
  `;

  seq.forEach((x,idx)=>{
    if(x.kind==="lesson"){
      html+=`<div style="margin:12px 0">
        <div style="font-weight:bold">${escProgram(x.title||("Bài "+(idx+1)))}</div>
        <div style="font-size:13px;color:#475569;margin:2px 0">
          LT: ${Number(x.ltHours||0)} giờ → ${Number(x.ltPeriods||0)} tiết;
          TH: ${Number(x.thHours||0)} giờ → ${Number(x.thPeriods||0)} tiết ·
          <b>${(x.items||[]).length} đề mục</b>
        </div>`;
      (x.items||[]).forEach(it=>{
        const cls=Array.isArray(it)?it[0]:"";
        const txt=Array.isArray(it)?it[1]:it;
        html+=`<div style="margin-left:${cls==="sub"?"34":"18"}px;line-height:1.35">${escProgram(txt)}</div>`;
      });
      html+=`</div>`;
    }else if(x.kind==="assessment"){
      html+=`<div style="margin:10px 0;font-weight:bold">${escProgram(x.title||"Kiểm tra")}
        <span style="font-weight:normal;color:#475569"> – ${Number(x.periods||0)} tiết</span>
      </div>`;
    }
  });

  html+='</div>';
  box.innerHTML=html;
}

function setFullProgramFromSchedule(pld){
  receivedFullCourse=pld.fullCourse||null;
  receivedFullProgram=Array.isArray(pld.fullProgram)?pld.fullProgram:null;

  const head=$("#fullProgramHeader");
  const btn=$("#btnToggleFullProgram");
  const viewer=$("#fullProgramViewer");

  if(receivedFullCourse && receivedFullProgram){
    head.className="status ok";
    head.innerHTML=`<b>${escapeHtml(receivedFullCourse.name||"")} – ${escapeHtml(receivedFullCourse.code||"")}</b><br>
      Tổng thời gian chương trình: ${Number(receivedFullCourse.total||0)} giờ ·
      ${receivedFullProgram.filter(x=>x.kind==="lesson").length} Bài/Chương ·
      ${receivedFullProgram.filter(x=>x.kind==="assessment").length} mốc kiểm tra`;
    btn.disabled=false;
    btn.textContent="Xem toàn bộ chương trình";
    viewer.classList.add("hidden");
    renderFullProgramViewer();
  }else{
    head.className="status warn";
    head.textContent="Bước 1 chưa truyền được toàn bộ chương trình môn học.";
    btn.disabled=true;
  }
}

function toggleFullProgram(){
  const viewer=$("#fullProgramViewer");
  const btn=$("#btnToggleFullProgram");
  if(!viewer)return;
  const hidden=viewer.classList.contains("hidden");
  viewer.classList.toggle("hidden");
  btn.textContent=hidden ? "Ẩn chương trình môn học" : "Xem toàn bộ chương trình";
}

async function receiveScheduleSession(data){
  const pld=data||{};
  const sourceName=String(pld.courseName||"").trim();
  const sourceCode=String(pld.courseCode||"").trim();
  const info=$("#scheduleImportInfo");

  setFullProgramFromSchedule(pld);

  if(!sourceName || !sourceCode){
    if(info){
      info.className="status bad";
      info.innerHTML="<b>Không thể soạn giáo án:</b> Bước 1 chưa xác định đầy đủ Tên môn học và Mã môn.";
    }
    alert("Bước 1 chưa có đầy đủ Tên môn học – Mã môn. Vui lòng tải đúng Chương trình môn học trước.");
    return;
  }

  if(info){
    info.className="status ok";
    info.innerHTML=`<b>Môn học – Mã môn từ Bước 1:</b> ${escapeHtml(sourceName)} – ${escapeHtml(sourceCode)}<br>
      <b>TT ${pld.scheduleTT||""}</b> · ${escapeHtml(pld.weekday||"")} ${escapeHtml(pld.date||"")} ·
      <b>${pld.periods||0} tiết</b> (khóa theo Sổ đầu bài) · <b>${(Number(pld.periods)||0)*45} phút</b> · LT ${pld.lt||0} · TH ${pld.th||0} · KT ${pld.kt||0}<br>
      <span style="font-size:13px">${escapeHtml(pld.summaryText||"")}</span><br>
      <span style="font-size:13px"><b>Tên bài học trước:</b><br>
      ${pld.previousLesson ? escapeHtml(pld.previousLesson).replace(/\n/g,"<br>") : "(không có – TT 1)"}</span>`;
  }

  window.currentScheduleTT = pld.scheduleTT;
  $("#btnSaveLesson").style.display = "inline-block";
  const ltCount=Number(pld.lt)||0;
  const thCount=Number(pld.th)||0;
  const ktCount=Number(pld.kt)||0;

  let gaType="";
  let gaReason="";

  if(ltCount>0 && thCount>0){
    gaType="integrated";
    gaReason=`Buổi học có ${ltCount} tiết Lý thuyết + ${thCount} tiết Thực hành → Giáo án Tích hợp.`;
  }else if(thCount>0){
    gaType="practice";
    gaReason=`Buổi học có ${thCount} tiết Thực hành${ktCount>0?` và ${ktCount} tiết Kiểm tra`:""} → Giáo án Thực hành.`;
  }else if(ltCount>0){
    gaType="theory";
    gaReason=`Buổi học có ${ltCount} tiết Lý thuyết${ktCount>0?` và ${ktCount} tiết Kiểm tra`:""} → Giáo án Lý thuyết.`;
  }else if(ktCount>0){
    gaType="practice";
    gaReason=`Buổi học chỉ có ${ktCount} tiết Kiểm tra → dùng Giáo án Thực hành/kiểm tra.`;
  }else{
    if(info){
      info.className="status bad";
      info.innerHTML="<b>Không thể xác định loại giáo án:</b> buổi học trong Sổ đầu bài không có tiết LT/TH/KT.";
    }
    alert("Không thể xác định loại giáo án vì buổi học không có tiết LT/TH/KT.");
    return;
  }

  $("#type").value=gaType;
  $("#type").disabled=true;
  $("#type").title="Loại giáo án được khóa theo cơ cấu tiết LT/TH/KT của buổi trong Sổ đầu bài.";

  if(info){
    const lessonText=(pld.lessons&&pld.lessons.length)?pld.lessons.join(" + "):"";
    info.innerHTML += `<br><b>Bài / Chương:</b> ${escapeHtml(lessonText)}<br>
      <b>Loại giáo án:</b> ${escapeHtml($("#type option:checked").textContent)}<br>
      <span style="font-size:13px">${escapeHtml(gaReason)}</span>`;
  }

  const periods=Number(pld.periods)||0;
  if(periods<=0){
    if(info){
      info.className="status bad";
      info.innerHTML += "<br><b>Không thể soạn giáo án:</b> buổi học chưa có số tiết hợp lệ.";
    }
    alert("Buổi học trong Sổ đầu bài chưa có số tiết hợp lệ.");
    return;
  }

  $("#periods").innerHTML="";
  $("#periods").add(new Option(`${periods} tiết`,String(periods)));
  $("#periods").value=String(periods);
  $("#periods").disabled=true;
  $("#periods").dataset.fromSchedule=String(periods);

  const scheduleTotalMinutes=periods*45;
  $("#totalMinutes").value=scheduleTotalMinutes+" phút";
  $("#totalMinutes").dataset.fromSchedule=String(scheduleTotalMinutes);
  $("#totalMinutes").readOnly=true;
  $("#totalMinutes").title="Tổng thời gian được tính tự động từ số tiết của buổi trong Sổ đầu bài: 1 tiết = 45 phút.";

  programs=[];

  const tempId="schedule_"+Date.now();
  const groups=Array.isArray(pld.lessonGroups) ? pld.lessonGroups : [];
  const fallbackTitle=(pld.lessons&&pld.lessons.length)?pld.lessons[0]:"Nội dung theo Sổ đầu bài";
  const fallbackItems=(pld.items&&pld.items.length)?pld.items:[pld.summaryText||fallbackTitle];

  const tempProgram={
    id:tempId,
    code:sourceCode,
    name:sourceName,
    totalHours:periods,
    version:"Sổ đầu bài",
    scheduleGroups:groups,
    lessons:[{
      title:fallbackTitle,
      hours:periods,
      sections:[{
        title:"",
        items:fallbackItems
      }]
    }]
  };

  programs=[tempProgram];
  renderSubjects();

  $("#subject").disabled=false;
  $("#lesson").disabled=false;
  $("#section").disabled=false;
  $("#periods").disabled=false;

  $("#subject").value=tempId;
  renderLessons();

  const selectedP=currentProgram();
  if(!selectedP || String(selectedP.name).trim()!==sourceName || String(selectedP.code).trim()!==sourceCode){
    if(info){
      info.className="status bad";
      info.innerHTML=`<b>Lỗi đồng bộ:</b> Bước 1 = ${escapeHtml(sourceName)} – ${escapeHtml(sourceCode)}; Bước 2 không khớp.`;
    }
    alert("Lỗi đồng bộ: Môn học – Mã môn tại Bước 2 không khớp Bước 1.");
    return;
  }

  $("#lesson").value="0";
  renderSections();
  $("#section").value="0";
  renderSubitems();

  $("#lesson").disabled=true;
  $("#lesson").dataset.fromSchedule=$("#lesson").value;
  $("#lesson").title="Bài / Chương được khóa theo đúng buổi học trong Sổ đầu bài ở Bước 1.";

  $("#subject").disabled=true;
  $("#type").disabled=true;
  $("#periods").disabled=true;
  $("#subject").title="Môn học – Mã môn được khóa theo Sổ đầu bài ở Bước 1.";
  $("#type").title="Loại giáo án được xác định từ cơ cấu LT/TH/KT của buổi ở Bước 1.";
  $("#periods").title="Số tiết được lấy trực tiếp từ buổi học ở Bước 1.";
  $("#prevLesson").value=String(pld.previousLesson||"").trim();
  $("#prevLesson").dataset.title=String(pld.previousLessonTitle||"").trim();
  $("#prevLesson").dataset.items=JSON.stringify(pld.previousLessonItems||[]);
  $("#gaNumber").value="";
  $("#btnGenerate").disabled=false;
  $("#btnGenerate").classList.add("primary");
  $("#btnGenerate").title="Tạo giáo án từ đúng dữ liệu buổi học đã chọn ở Sổ đầu bài.";
  if(pld.savedLesson) {
    $("#paper").innerHTML = pld.savedLesson;
  }

  $("#btnAIWhole").disabled=false;
  checkTime();

  $("#scheduleImportCard")?.scrollIntoView({behavior:"smooth",block:"start"});
}

window.addEventListener("message",e=>{
  if(e.data?.type==="LOAD_SCHEDULE_SESSION"){
    receiveScheduleSession(e.data.payload);
  }
});
async function init(){
  await openDB();
  programs=[];

  $("#periods").innerHTML='<option value="">— Chưa nhận số tiết từ Bước 1 —</option>';
  $("#totalMinutes").value="—";
  $("#totalMinutes").dataset.fromSchedule="";

  $("#subject").innerHTML='<option value="">— Chưa nhận dữ liệu từ Bước 1 —</option>';
  $("#lesson").innerHTML='<option value="">— Chưa có bài/chương —</option>';
  $("#section").innerHTML='<option value="">— Chưa có nội dung —</option>';
  $("#subitems").innerHTML='<div class="hint">Hãy tải Chương trình môn học và chia Sổ đầu bài ở Bước 1, sau đó bấm <b>SOẠN GIÁO ÁN BUỔI NÀY</b>.</div>';

  $("#subject").disabled=true;
  $("#type").disabled=true;
  $("#lesson").disabled=true;
  $("#section").disabled=true;
  $("#periods").disabled=true;

  $("#subject").onchange=renderLessons;$("#lesson").onchange=renderSections;$("#section").onchange=renderSubitems;$("#periods").onchange=()=>{updateMinutes();checkTime()};
  $("#btnGenerate").onclick=()=>{
    try{ buildPaper(); }
    catch(e){
      console.error(e);
      alert("Không tạo được giáo án do lỗi nội bộ: "+(e?.message||e));
    }
  };
  $("#btnCheck").onclick=runTimeCheck;
  $("#btnAddRow").onclick=addRow;
  $("#btnGenerate").disabled=true;
  $("#btnAIWhole").disabled=true;
$("#modalClose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
  $("#btnSaveLesson").onclick = () => { const clone = getCleanPaperClone(); if(!clone) return alert("Chưa có nội dung giáo án để lưu."); window.parent.postMessage({ type: "SAVE_LESSON_PLAN", payload: { tt: window.currentScheduleTT, data: clone.innerHTML } }, "*"); }; $("#btnBackup").onclick=backup;$("#btnRestore").onclick=()=>$("#restoreFile").click();
  $("#restoreFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;const list=JSON.parse(await f.text());if(!Array.isArray(list))return alert("File backup không hợp lệ.");for(const p of list){delete p.id;await addProgram(p)}programs=await getAll();renderSubjects();alert("Đã khôi phục dữ liệu.");e.target.value=""};
  $("#btnExportWord").onclick=exportWord;
  $("#btnExportPdf").onclick=exportPdf;
  $("#btnToggleFullProgram").onclick=toggleFullProgram;
  $("#btnSaveAI").onclick=saveAISettings;
  $("#btnTestAI").onclick=testGeminiConnection;
  $("#btnRefreshModels").onclick=refreshGeminiModels;
  $("#btnAIWhole").onclick=runWholeAI;
  loadAISettings();
}
init();
