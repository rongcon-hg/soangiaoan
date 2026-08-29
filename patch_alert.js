const fs = require('fs');

const swalInjection = `
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<style>.swal2-popup { font-family: 'Be Vietnam Pro', sans-serif !important; }</style>
<script>
window._originalAlert = window.alert;
window.alert = function(msg) {
    if(typeof Swal !== 'undefined') {
        Swal.fire({ text: msg, icon: 'info', confirmButtonColor: '#16469d' });
    } else {
        window._originalAlert(msg);
    }
};
window.customConfirm = async function(msg) {
    if(typeof Swal === 'undefined') return window.confirm(msg);
    const result = await Swal.fire({
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16469d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    });
    return result.isConfirmed;
};
</script>
`;

let appCode = fs.readFileSync('views/app.ejs', 'utf8');
appCode = appCode.replace(/&lt;head&gt;/g, `&lt;head&gt;\n${swalInjection.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}`);
appCode = appCode.replace(/if\(!confirm\(&quot;Xóa chương trình này/g, "if(!(await customConfirm(&quot;Xóa chương trình này");
appCode = appCode.replace(/const choice=confirm\(`/g, 'const choice=await customConfirm(`');
fs.writeFileSync('views/app.ejs', appCode, 'utf8');

let indexCode = fs.readFileSync('views/index.ejs', 'utf8');
if(!indexCode.includes('sweetalert2')) {
    indexCode = indexCode.replace('</head>', swalInjection + '\n</head>');
}
indexCode = indexCode.replace(/if\(!confirm\('Xóa môn học này/g, "if(!(await customConfirm('Xóa môn học này");
fs.writeFileSync('views/index.ejs', indexCode, 'utf8');

let usersCode = fs.readFileSync('views/users.ejs', 'utf8');
if(!usersCode.includes('sweetalert2')) {
    usersCode = usersCode.replace('</head>', swalInjection + '\n</head>');
}
usersCode = usersCode.replace(/if\(!confirm\('Xóa người dùng/g, "if(!(await customConfirm('Xóa người dùng");
fs.writeFileSync('views/users.ejs', usersCode, 'utf8');

// For other EJS files that have </head> (e.g. login.ejs, profile.ejs, settings.ejs)
['views/login.ejs', 'views/profile.ejs', 'views/settings.ejs', 'views/test.ejs'].forEach(file => {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        if(!code.includes('sweetalert2') && code.includes('</head>')) {
            code = code.replace('</head>', swalInjection + '\n</head>');
            fs.writeFileSync(file, code, 'utf8');
        }
    }
});

// For main app.ejs (which has its own <head> outside the iframes)
if(!appCode.includes('sweetalert2') && appCode.includes('</head>')) {
    appCode = appCode.replace('</head>', swalInjection + '\n</head>');
    fs.writeFileSync('views/app.ejs', appCode, 'utf8');
}

console.log("Patch complete.");
