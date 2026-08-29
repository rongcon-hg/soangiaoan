const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// 1. Update fetch success callback
const fetchRegex = /(\}\)\.then\(res => res\.json\(\)\)\.then\(data => \{)([\s\S]*?)(status\.innerHTML = oldHtml \+ "[^"]*Đã upload thành công[^"]*";)([\s\S]*?\n\s*\}\)\.catch)/;

if (fetchRegex.test(txt)) {
    txt = txt.replace(fetchRegex, `$1$2status.innerHTML = oldHtml + "<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='" + data.url + "' target='_blank'>Xem trên Google Drive</a></span>";\n             course.driveLink = data.url;\n             if(typeof saveStateToBackend === 'function') saveStateToBackend();$4`);
} else {
    // maybe encoded quotes
    const fetchRegex2 = /(\}\)\.then\(res => res\.json\(\)\)\.then\(data => \{)([\s\S]*?)(status\.innerHTML = oldHtml \+ &quot;.*?Đã upload thành công.*?&quot;;)([\s\S]*?\n\s*\}\)\.catch)/;
    if(fetchRegex2.test(txt)) {
        txt = txt.replace(fetchRegex2, `$1$2status.innerHTML = oldHtml + &quot;<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='&quot; + data.url + &quot;' target='_blank'>Xem trên Google Drive</a></span>&quot;;\n             course.driveLink = data.url;\n             if(typeof saveStateToBackend === 'function') saveStateToBackend();$4`);
    } else {
        console.log("Could not match fetch success");
    }
}

// 2. Update LOAD_PROJECT_STATE
const loadRegex = /(const status = document\.getElementById\(&quot;fileStatus&quot;\);\s*)(status\.innerHTML = `&lt;b&gt;Đã tải dữ liệu dự án từ máy chủ\.&lt;\/b&gt;`;)/;
if (loadRegex.test(txt)) {
    txt = txt.replace(loadRegex, `$1if(course.driveLink) {\n            status.innerHTML = \`&lt;b&gt;Đã tải dữ liệu dự án từ máy chủ.&lt;/b&gt;&lt;br&gt;📁 &lt;a href="\${course.driveLink}" target="_blank" style="color:#16469d;font-weight:bold;text-decoration:underline;"&gt;Mở file Chương trình môn học trên Google Drive&lt;/a&gt;\`;\n        } else {\n            status.innerHTML = \`&lt;b&gt;Đã tải dữ liệu dự án từ máy chủ.&lt;/b&gt;\`;\n        }`);
} else {
    // maybe quotes are standard
    const loadRegex2 = /(const status = document\.getElementById\("fileStatus"\);\s*)(status\.innerHTML = `<b>Đã tải dữ liệu dự án từ máy chủ\.<\/b>`;)/;
    if(loadRegex2.test(txt)) {
        txt = txt.replace(loadRegex2, `$1if(course.driveLink) {\n            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b><br>📁 <a href="\${course.driveLink}" target="_blank" style="color:#16469d;font-weight:bold;text-decoration:underline;">Mở file Chương trình môn học trên Google Drive</a>\`;\n        } else {\n            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;\n        }`);
    } else {
        console.log("Could not match load project state");
    }
}

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched drive link via regex!");
