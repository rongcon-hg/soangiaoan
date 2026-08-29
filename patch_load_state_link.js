const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const loadRegex = /(const status = document\.getElementById\(&quot;fileStatus&quot;\);\s*)(status\.innerHTML = `<b>Đã tải dữ liệu dự án từ máy chủ\.<\/b>`;)/;

if (loadRegex.test(txt)) {
    txt = txt.replace(loadRegex, `$1if(course.driveLink) {\n            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b><br>📁 <a href="\${course.driveLink}" target="_blank" style="color:#16469d;font-weight:bold;text-decoration:underline;">Mở file Chương trình môn học trên Google Drive</a>\`;\n        } else {\n            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;\n        }`);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched LOAD_PROJECT_STATE!");
} else {
    console.log("Still could not match load project state");
}
