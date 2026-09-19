const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// 1. Add buttons to the toolbar
const btnTarget = '&lt;button class=&quot;btn primary&quot; id=&quot;btnSlideAI&quot;&gt;&lt;i class=&quot;fas fa-file-powerpoint&quot;&gt;&lt;/i&gt; Dàn ý Slide&lt;/button&gt;';
const btnInject = `&lt;button class=&quot;btn primary&quot; id=&quot;btnSlideAI&quot;&gt;&lt;i class=&quot;fas fa-file-powerpoint&quot;&gt;&lt;/i&gt; Dàn ý Slide&lt;/button&gt;
            &lt;button class=&quot;btn primary&quot; id=&quot;btnRubricAI&quot;&gt;&lt;i class=&quot;fas fa-clipboard-check&quot;&gt;&lt;/i&gt; Phiếu đánh giá (AI)&lt;/button&gt;
            &lt;button class=&quot;btn primary&quot; id=&quot;btnErrorAI&quot;&gt;&lt;i class=&quot;fas fa-exclamation-triangle&quot;&gt;&lt;/i&gt; Lỗi thường gặp (AI)&lt;/button&gt;`;

content = content.replace(btnTarget, btnInject);

// 2. Add onclick bindings
const bindTarget = '$(&quot;#btnSlideAI&quot;).onclick=runSlideAI;';
const bindInject = `$(&quot;#btnSlideAI&quot;).onclick=runSlideAI;
  $(&quot;#btnRubricAI&quot;).onclick=runRubricAI;
  $(&quot;#btnErrorAI&quot;).onclick=runErrorAI;`;

content = content.replace(bindTarget, bindInject);

// 3. Add the two new functions runRubricAI and runErrorAI after runQuizAI
const funcTarget = 'async function runSlideAI() {';
const funcsInject = `async function runRubricAI() {
  if(!$(&quot;#paper table.ga&quot;)) return alert(&quot;Hãy tạo giáo án trước.&quot;);
  const btn = document.getElementById(&quot;btnRubricAI&quot;);
  const originalHtml = btn ? btn.innerHTML : &quot;&quot;;
  if(btn) { btn.innerHTML = &quot;⏳ Đang tạo...&quot;; btn.disabled = true; }
  
  try {
      const textContent = document.getElementById(&quot;paper&quot;).innerText || document.getElementById(&quot;paper&quot;).textContent;
      const prompt = \`
Bạn là chuyên gia sư phạm Giáo dục nghề nghiệp.
Dưới đây là nội dung giáo án:
\${textContent}

Dựa vào nội dung bài học, hãy thiết kế một "Phiếu đánh giá kỹ năng thực hành" (Rubric).
Yêu cầu:
- Trả về MỘT BẢNG HTML DUY NHẤT (dùng thẻ <table>, KHÔNG bọc trong markdown hay \`\`\`).
- Bảng phải có đường viền viền đen (style="width:100%; border-collapse:collapse; border:1.2px solid #000;"), các ô th/td cũng phải có border (border:1px solid #000; padding:5px).
- Cột: STT, Tiêu chí đánh giá, Điểm tối đa (thang điểm 10), Điểm đạt, Ghi chú.
- Các tiêu chí chia làm 3 phần chuẩn: I. Chuẩn bị (2đ), II. Thực hiện quy trình thao tác (6đ), III. An toàn & 5S (2đ).
- Các tiêu chí phải cụ thể hóa từ nội dung bài thực hành trên.\`;
      
      let raw = "";
      $(&quot;#aiStatus&quot;).className=&quot;status warn&quot;;
      $(&quot;#aiStatus&quot;).textContent=&quot;Gemini đang thiết kế Rubric...&quot;;
      
      raw = await callOpenAI(prompt);
      
      const htmlContent = cleanAIText(raw);
      
      let sec = document.querySelector('.rubric-section');
      if(!sec) {
        sec = document.createElement('div');
        sec.className = 'rubric-section no-ai-extract';
        sec.style.marginTop = '40px';
        document.getElementById('paper').appendChild(sec);
      }
      sec.innerHTML = \`<h3 class="section-title" style="text-align:center; font-size:14pt; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">PHIẾU ĐÁNH GIÁ KỸ NĂNG THỰC HÀNH</h3>\n\` + htmlContent;
      
      $(&quot;#aiStatus&quot;).className=&quot;status ok&quot;;
      $(&quot;#aiStatus&quot;).textContent=&quot;Đã sinh Phiếu đánh giá thành công.&quot;;
      showModal(&quot;Hoàn tất&quot;, &quot;Đã chèn Phiếu đánh giá vào cuối giáo án.&quot;);
  } catch(e) {
      console.error(e);
      alert(&quot;Lỗi: &quot; + (e?.message || e));
  } finally {
      if(btn) { btn.innerHTML = originalHtml; btn.disabled = false; }
  }
}

async function runErrorAI() {
  if(!$(&quot;#paper table.ga&quot;)) return alert(&quot;Hãy tạo giáo án trước.&quot;);
  const btn = document.getElementById(&quot;btnErrorAI&quot;);
  const originalHtml = btn ? btn.innerHTML : &quot;&quot;;
  if(btn) { btn.innerHTML = &quot;⏳ Đang phân tích...&quot;; btn.disabled = true; }
  
  try {
      const textContent = document.getElementById(&quot;paper&quot;).innerText || document.getElementById(&quot;paper&quot;).textContent;
      const prompt = \`
Bạn là chuyên gia sư phạm Giáo dục nghề nghiệp.
Dưới đây là nội dung giáo án:
\${textContent}

Hãy dự đoán và tổng hợp "Các lỗi thường gặp, nguyên nhân và biện pháp khắc phục".
Yêu cầu:
- Trả về MỘT BẢNG HTML DUY NHẤT (dùng thẻ <table>, KHÔNG bọc trong markdown hay \`\`\`).
- Bảng phải có đường viền viền đen (style="width:100%; border-collapse:collapse; border:1.2px solid #000;"), các ô th/td cũng phải có border (border:1px solid #000; padding:5px).
- Cột: STT, Hiện tượng (Lỗi thường gặp), Nguyên nhân, Biện pháp phòng tránh và khắc phục.
- Nêu ít nhất 3-5 lỗi thực tế nhất bám sát nội dung bài thực hành trên.\`;
      
      let raw = "";
      $(&quot;#aiStatus&quot;).className=&quot;status warn&quot;;
      $(&quot;#aiStatus&quot;).textContent=&quot;Gemini đang phân tích lỗi thường gặp...&quot;;
      
      raw = await callOpenAI(prompt);
      
      const htmlContent = cleanAIText(raw);
      
      let sec = document.querySelector('.error-section');
      if(!sec) {
        sec = document.createElement('div');
        sec.className = 'error-section no-ai-extract';
        sec.style.marginTop = '40px';
        document.getElementById('paper').appendChild(sec);
      }
      sec.innerHTML = \`<h3 class="section-title" style="text-align:center; font-size:14pt; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">CÁC LỖI THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC</h3>\n\` + htmlContent;
      
      $(&quot;#aiStatus&quot;).className=&quot;status ok&quot;;
      $(&quot;#aiStatus&quot;).textContent=&quot;Đã sinh bảng phân tích lỗi thành công.&quot;;
      showModal(&quot;Hoàn tất&quot;, &quot;Đã chèn Bảng phân tích lỗi vào cuối giáo án.&quot;);
  } catch(e) {
      console.error(e);
      alert(&quot;Lỗi: &quot; + (e?.message || e));
  } finally {
      if(btn) { btn.innerHTML = originalHtml; btn.disabled = false; }
  }
}

async function runSlideAI() {`;

content = content.replace(funcTarget, funcsInject);

fs.writeFileSync('views/app.ejs', content);
console.log('Features patched successfully!');
