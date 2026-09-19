const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const targetClean = `function cleanAIText(t){
  return String(t||&quot;&quot;).replace(/^\\^\\^/);`; // Better use regex

const oldClean = `function cleanAIText(t){
  return String(t||&quot;&quot;).replace(/^\\x60\\x60\\x60(?:html|text|markdown)?/i,&quot;&quot;).replace(/\\x60\\x60\\x60$/,&quot;&quot;).trim();
}`;

content = content.replace(/function cleanAIText\(t\)\{[\s\S]*?\}/, `function cleanAIText(t){
  let s = String(t||&quot;&quot;).replace(/^\\x60\\x60\\x60(?:html|text|markdown)?/i,&quot;&quot;).replace(/\\x60\\x60\\x60$/,&quot;&quot;).trim();
  s = s.replace(/\\*\\*(.*?)\\*\\*/g, '&lt;b&gt;$1&lt;/b&gt;');
  return s;
}`);

// Update runErrorAI prompt
const errorPromptTarget = `- Nêu ít nhất 3-5 lỗi thực tế nhất bám sát nội dung bài thực hành trên.\`;`;
const errorPromptReplacement = `- Nêu ít nhất 3-5 lỗi thực tế nhất bám sát nội dung bài thực hành trên.
- TUYỆT ĐỐI KHÔNG dùng markdown (**). Bắt buộc dùng thẻ &lt;b&gt; để in đậm chữ bên trong bảng.\`;`;

content = content.replace(errorPromptTarget, errorPromptReplacement);

// Update runRubricAI prompt
const rubricPromptTarget = `- Các tiêu chí phải cụ thể hóa từ nội dung bài thực hành trên.\`;`;
const rubricPromptReplacement = `- Các tiêu chí phải cụ thể hóa từ nội dung bài thực hành trên.
- TUYỆT ĐỐI KHÔNG dùng markdown (**). Bắt buộc dùng thẻ &lt;b&gt; để in đậm chữ bên trong bảng.\`;`;

content = content.replace(rubricPromptTarget, rubricPromptReplacement);

fs.writeFileSync('views/app.ejs', content);
console.log("Markdown parsing fixed!");
