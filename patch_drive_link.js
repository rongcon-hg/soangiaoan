const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// 1. Update the fetch success callback
const oldFetchSuccess = `         }).then(res => res.json()).then(data => {
             status.innerHTML = oldHtml + "<br><span style='color:#166534;'>✅ <b>Đã upload thành công lên Google Drive của bạn!</b></span>";
         }).catch(err => {`;
const newFetchSuccess = `         }).then(res => res.json()).then(data => {
             status.innerHTML = oldHtml + \`<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href="\${data.url}" target="_blank">Xem trên Google Drive</a></span>\`;
             if(typeof course !== 'undefined') course.driveLink = data.url;
             if(typeof saveStateToBackend === 'function') saveStateToBackend();
         }).catch(err => {`;
         
if(txt.includes(oldFetchSuccess)) {
    txt = txt.replace(oldFetchSuccess, newFetchSuccess);
}

// 2. Update the LOAD_PROJECT_STATE status update
const oldLoadStatus = `        const status = document.getElementById("fileStatus");
        status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;`;
const newLoadStatus = `        const status = document.getElementById("fileStatus");
        if(typeof course !== 'undefined' && course.driveLink) {
            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b><br>📁 <a href="\${course.driveLink}" target="_blank" style="color:#16469d;font-weight:bold;text-decoration:underline;">Mở file Chương trình môn học trên Google Drive</a>\`;
        } else {
            status.innerHTML = \`<b>Đã tải dữ liệu dự án từ máy chủ.</b>\`;
        }`;

if(txt.includes(oldLoadStatus)) {
    txt = txt.replace(oldLoadStatus, newLoadStatus);
}

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched drive link!");
