const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldFetchBlock = `         }).then(res => res.json()).then(data => {
             status.innerHTML = oldHtml + &quot;<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='&quot; + data.url + &quot;' target='_blank'>Xem trên Google Drive</a></span>&quot;;
             course.driveLink = data.url;
             if(typeof saveStateToBackend === 'function') saveStateToBackend();
         }).catch(err => {
             console.error(err);
             status.innerHTML = oldHtml + &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> &quot; + (err.message || err.toString() || 'Lỗi không xác định') + &quot;</span>&quot;;
         });`;

const newFetchBlock = `         }).then(async res => {
             if (!res.ok) {
                 const errData = await res.json().catch(() => ({}));
                 throw new Error(errData.message || errData.error || 'Server error ' + res.status);
             }
             return res.json();
         }).then(data => {
             status.innerHTML = oldHtml + &quot;<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='&quot; + data.url + &quot;' target='_blank'>Xem trên Google Drive</a></span>&quot;;
             course.driveLink = data.url;
             if(typeof saveStateToBackend === 'function') saveStateToBackend();
         }).catch(err => {
             console.error(err);
             status.innerHTML = oldHtml + &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> &quot; + (err.message || err.toString() || 'Lỗi không xác định') + &quot;</span>&quot;;
         });`;

if (txt.includes(oldFetchBlock)) {
    txt = txt.replace(oldFetchBlock, newFetchBlock);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched fetch block in app.ejs!");
} else {
    console.log("Could not find fetch block exactly as expected.");
}
