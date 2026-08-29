const fs = require('fs');
let txt = fs.readFileSync('views/login.ejs', 'utf8');

txt = txt.replace('<title>Đăng nhập - Hệ thống Giáo án</title>', '<title>Đăng nhập - Giáo án điện tử</title>');
txt = txt.replace('<h2>Hệ thống Giáo án</h2>', '<h2>Giáo án điện tử</h2>\n            <p style="text-align: center; color: var(--text-light); margin-top: -15px; margin-bottom: 25px; font-size: 14px; line-height: 1.4;">Phần hỗ trợ tạo giáo án điện tử và lịch giảng dạy bằng AI</p>');

const footerHtml = `
    <div style="position: absolute; bottom: 20px; width: 100%; text-align: center; color: rgba(255,255,255,0.8); font-size: 13px; line-height: 1.6;">
        Bản quyền năm &copy; 2026 - Khoa Công nghệ thông tin - Kỹ thuật điện<br>
        Hỗ trợ: nguyenluyen@nsg.edu.vn - 0917.919.522
    </div>
`;
txt = txt.replace('</body>', footerHtml + '\n</body>');

fs.writeFileSync('views/login.ejs', txt);
console.log('Patched login.ejs');
