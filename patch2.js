const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const backupCode = `
    const formData = new FormData();
    formData.append('file', file);
    try {
        fetch('/api/drive/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + (window.parent ? window.parent.localStorage.getItem('token') : localStorage.getItem('token')) },
            body: formData
        }).then(r => r.json()).then(data => {
            if(data.url) console.log('Đã sao lưu file lên Drive:', data.url);
        });
    } catch(e) {}
`;

// Insert after `status.textContent="Đang đọc: "+file.name+" ...";`
txt = txt.replace(
    'status.textContent="Đang đọc: "+file.name+" ...";',
    'status.textContent="Đang đọc: "+file.name+" ...";\n' + backupCode
);

fs.writeFileSync('views/app.ejs', txt);
console.log('Patched app.ejs for file upload');
