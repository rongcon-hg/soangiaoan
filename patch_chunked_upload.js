const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldFetchBlock = `         const formData = new FormData();
         formData.append(&quot;file&quot;, file);
         fetch('/api/drive/upload', {
             method: 'POST',
             headers: { 'Authorization': 'Bearer ' + window.parent.localStorage.getItem('token') },
             body: formData
         }).then(async res => {
             if (!res.ok) {
                 const errData = await res.json().catch(() => ({}));
                 throw new Error(errData.message || errData.error || 'Server error ' + res.status);
             }
             return res.json();
         }).then(data => {
             status.innerHTML = oldHtml + &quot;<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='&quot; + data.url + &quot;' target='_blank' style='color:#16469d;font-weight:bold;text-decoration:underline;'>Xem trên Google Drive</a></span>&quot;;
             course.driveLink = data.url;
             if(typeof saveStateToBackend === 'function') saveStateToBackend();
         }).catch(err => {
             console.error(err);
             status.innerHTML = oldHtml + &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> &quot; + (err.message || err.toString() || 'Lỗi không xác định') + &quot;</span>&quot;;
         });`;

// Note: Using await inside an async function (readProgramFile is async)
const newFetchBlock = `         const token = window.parent.localStorage.getItem('token');
         const chunkSize = 3 * 1024 * 1024; // 3MB per chunk to bypass 4.5MB limit
         
         (async () => {
             try {
                 const startRes = await fetch('/api/drive/start-upload', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify({ fileName: file.name, mimeType: file.type || 'application/octet-stream' })
                 });
                 if (!startRes.ok) throw new Error(await startRes.text());
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
                             'Content-Range': 'bytes ' + start + '-' + (end - 1) + '/' + file.size
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
                         throw new Error(await chunkRes.text());
                     }
                 }
                 if (!fileId) throw new Error('Upload incomplete');
                 
                 const finishRes = await fetch('/api/drive/finish-upload', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify({ fileId })
                 });
                 if (!finishRes.ok) throw new Error(await finishRes.text());
                 const { url } = await finishRes.json();
                 
                 status.innerHTML = oldHtml + &quot;<br><span style='color:#166534;'>✅ <b>Đã upload thành công:</b> <a href='&quot; + url + &quot;' target='_blank' style='color:#16469d;font-weight:bold;text-decoration:underline;'>Xem trên Google Drive</a></span>&quot;;
                 course.driveLink = url;
                 if(typeof saveStateToBackend === 'function') saveStateToBackend();
             } catch(err) {
                 console.error(err);
                 status.innerHTML = oldHtml + &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> &quot; + (err.message || err.toString()) + &quot;</span>&quot;;
             }
         })();`;

if (txt.includes(oldFetchBlock)) {
    txt = txt.replace(oldFetchBlock, newFetchBlock);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched chunked upload in app.ejs!");
} else {
    console.log("Could not find fetch block exactly as expected.");
    // Write out the area to debug
    const i = txt.indexOf("fetch('/api/drive/upload'");
    console.log(txt.substring(Math.max(0, i - 100), Math.min(txt.length, i + 800)));
}
