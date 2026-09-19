const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// 1. Fix the heading in runQuizAI
const quizTarget = '&lt;h3 style=&quot;color:#6d28d9; margin-top:20px; font-weight:bold; font-size:16px; text-transform:uppercase;&quot;&gt;BÀI TẬP VÀ ĐỀ KIỂM TRA (AI SINH TỰ ĐỘNG)&lt;/h3&gt;';
const quizReplacement = '&lt;h3 class=&quot;section-title&quot; style=&quot;text-align:center; font-size:14pt; font-weight:bold; margin-bottom:15px; text-transform:uppercase;&quot;&gt;BÀI TẬP VÀ ĐỀ KIỂM TRA&lt;/h3&gt;';
content = content.replace(quizTarget, quizReplacement);

// 2. Fix the exportPdf filename
const printTarget = `    // Call native print (this opens the dialog to save as PDF)
    window.print();`;

const printReplacement = `    // Đặt tên file cho trình duyệt khi in
    const oldTitle = document.title;
    try {
        const filename = getExportGiaoAnFilename("pdf");
        document.title = filename.replace(/\\.pdf$/i, '');
    } catch(e) {}

    // Call native print (this opens the dialog to save as PDF)
    window.print();

    // Khôi phục title
    document.title = oldTitle;`;

content = content.replace(printTarget, printReplacement);

fs.writeFileSync('views/app.ejs', content);
console.log("Fixed PDF filename and Quiz heading");
