const fs = require('fs');

const ogTags = `
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Soạn lịch giảng dạy và Giáo án với Gemini">
    <meta property="og:description" content="AI đồng hành cùng giảng dạy hiệu quả hơn! Hệ thống quản lý giáo án và lịch giảng dạy thông minh.">
    <meta property="og:image" content="https://soangiaoan.nsg.edu.vn/images/og-banner.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://soangiaoan.nsg.edu.vn">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Soạn lịch giảng dạy và Giáo án với Gemini">
    <meta name="twitter:description" content="AI đồng hành cùng giảng dạy hiệu quả hơn! Hệ thống quản lý giáo án và lịch giảng dạy thông minh.">
    <meta name="twitter:image" content="https://soangiaoan.nsg.edu.vn/images/og-banner.jpg">`;

const files = ['views/index.ejs', 'views/login.ejs', 'views/app.ejs'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Check if already injected to avoid duplication
    if (!content.includes('og:image')) {
        // Find the title tag
        content = content.replace(/(<title>.*?<\/title>)/i, `$1\n${ogTags}`);
        fs.writeFileSync(file, content);
        console.log(`Injected OG tags into ${file}`);
    } else {
        console.log(`OG tags already present in ${file}`);
    }
});
