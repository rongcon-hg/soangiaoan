const fs = require('fs');
let code = fs.readFileSync('public/js/layout.js', 'utf-8');
const search = '<div class="user-greeting"><span class="hello-text">Xin chào,</span> <b id="topbar-username" style="color:var(--primary)">...</b></div>';
const replace = '<div class="user-greeting"><span class="hello-text">Xin chào,</span> <b id="topbar-username" style="color:var(--primary)">...</b> <a href="#" onclick="logout()" style="margin-left: 8px; color: var(--danger); font-size: 1.1em; text-decoration: none;" title="Đăng xuất"><i class="fas fa-sign-out-alt"></i></a></div>';
code = code.replace(search, replace);
fs.writeFileSync('public/js/layout.js', code, 'utf-8');
console.log("Success topbar");
