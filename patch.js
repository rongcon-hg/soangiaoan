const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// Remove the footer credit
txt = txt.replace('<p>Được thiết kế bởi <b>Trần Hữu Nhân</b> - giảng viên khoa CNTT-KTĐ dưới sự hỗ trợ của AI</p>', '');

// Add head links
const headLinks = `<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">\n<link rel="stylesheet" href="/css/style.css">\n</head>`;
txt = txt.replace('</head>', headLinks);

// Add scripts at bottom
const scriptsStr = `<script src="/js/api.js"></script>\n<script src="/js/layout.js"></script>\n<script>\n    injectLayout('projects', 'Soạn Giáo án');\n    checkAuth();\n`;
txt = txt.replace('<script>', scriptsStr);

fs.writeFileSync('views/app.ejs', txt);
console.log('Updated app.ejs');
