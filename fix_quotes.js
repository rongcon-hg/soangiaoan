const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const brokenUpload = `     // Upload background
     if(window.parent.localStorage.getItem('token')) {
         const oldHtml = status.innerHTML;
         status.innerHTML = oldHtml + "<br><span style='color:#7c3aed;'>⏳ <b>Hệ thống đang đẩy file lên Google Drive, vui lòng chờ...</b></span>";
         const formData = new FormData();
         formData.append("file", file);
         fetch('/api/drive/upload', {
             method: 'POST',
             headers: { 'Authorization': 'Bearer ' + window.parent.localStorage.getItem('token') },
             body: formData
         }).then(res => res.json()).then(data => {
             status.innerHTML = oldHtml + "<br><span style='color:#166534;'>✅ <b>Đã upload thành công lên Google Drive của bạn!</b></span>";
         }).catch(err => {
             console.error(err);
             status.innerHTML = oldHtml + "<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive.</b></span>";
         });
     }`;

const fixedUpload = brokenUpload.replace(/"/g, '&quot;');

if (txt.includes(brokenUpload)) {
    txt = txt.replace(brokenUpload, fixedUpload);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Fixed the broken double quotes in srcdoc!");
} else {
    console.log("Could not find the broken upload string.");
}
