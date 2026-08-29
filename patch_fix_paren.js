const fs = require('fs');

let appCode = fs.readFileSync('views/app.ejs', 'utf8');
appCode = appCode.replace(/if\(!\(await customConfirm\(&quot;Xóa chương trình này khỏi dữ liệu trình duyệt\?&quot;\)\)return;/g, 'if(!(await customConfirm(&quot;Xóa chương trình này khỏi dữ liệu trình duyệt?&quot;)))return;');
fs.writeFileSync('views/app.ejs', appCode, 'utf8');

let indexCode = fs.readFileSync('views/index.ejs', 'utf8');
indexCode = indexCode.replace(/if\(!\(await customConfirm\('Xóa môn học này và toàn bộ giáo án liên quan\?'\)\) return;/g, "if(!(await customConfirm('Xóa môn học này và toàn bộ giáo án liên quan?'))) return;");
fs.writeFileSync('views/index.ejs', indexCode, 'utf8');

let usersCode = fs.readFileSync('views/users.ejs', 'utf8');
usersCode = usersCode.replace(/if\(!\(await customConfirm\('Xóa người dùng này\?'\)\) return;/g, "if(!(await customConfirm('Xóa người dùng này?'))) return;");
fs.writeFileSync('views/users.ejs', usersCode, 'utf8');

console.log("Fixed parens");
