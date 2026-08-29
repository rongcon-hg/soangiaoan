const fs = require('fs');

let cssCode = fs.readFileSync('public/css/style.css', 'utf8');

// Replace font-family and primary colors
cssCode = "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');\n" + cssCode;
cssCode = cssCode.replace(/--primary: #2563eb;/g, '--primary: #16469d;'); // Standardizing blue
cssCode = cssCode.replace(/--primary-dark: #1d4ed8;/g, '--primary-dark: #0e3073;');
cssCode = cssCode.replace(/--bg: #f1f5f9;/g, '--bg: #f5f8fc;');
cssCode = cssCode.replace(/font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;/g, "font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, sans-serif;");
cssCode = cssCode.replace(/font-family: 'Inter', sans-serif;/g, "font-family: 'Be Vietnam Pro', sans-serif;");
cssCode = cssCode.replace(/font-family:'Times New Roman',Times,serif;/g, "font-family: 'Be Vietnam Pro', sans-serif;"); // Convert times new roman if exists

// Adding mobile responsive styles if not exist
if (!cssCode.includes('@media (max-width: 768px)')) {
    cssCode += `

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        position: fixed;
        z-index: 9999;
    }
    .sidebar.active {
        transform: translateX(0);
    }
    .main-content {
        margin-left: 0;
        width: 100%;
    }
    .topbar {
        padding: 10px;
    }
    .grid {
        grid-template-columns: 1fr !important;
    }
    .table-container, .sheet-wrap, .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .nav-menu .nav-item {
        padding: 12px;
    }
    .card {
        padding: 12px;
    }
    #step1, #step2 {
        padding: 10px;
    }
}
`;
}

fs.writeFileSync('public/css/style.css', cssCode, 'utf8');

// Also update inline styles in app.ejs
let ejsCode = fs.readFileSync('views/app.ejs', 'utf8');
ejsCode = ejsCode.replace(/font-family:"Times New Roman",Times,serif/g, 'font-family:"Be Vietnam Pro", sans-serif');
ejsCode = ejsCode.replace(/font-family:"Times New Roman",serif/g, 'font-family:"Be Vietnam Pro", sans-serif');
ejsCode = ejsCode.replace(/font-family:'Times New Roman',Times,serif/g, 'font-family:"Be Vietnam Pro", sans-serif');
ejsCode = ejsCode.replace(/font-family:'Times New Roman',serif/g, 'font-family:"Be Vietnam Pro", sans-serif');

// Add Google fonts to layout or app.ejs if not present
if (!ejsCode.includes('family=Be+Vietnam+Pro')) {
    ejsCode = ejsCode.replace('</head>', '    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">\n</head>');
}

fs.writeFileSync('views/app.ejs', ejsCode, 'utf8');

// Also index.ejs
let indexCode = fs.readFileSync('views/index.ejs', 'utf8');
if (!indexCode.includes('family=Be+Vietnam+Pro')) {
    indexCode = indexCode.replace('</head>', '    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">\n</head>');
    fs.writeFileSync('views/index.ejs', indexCode, 'utf8');
}

console.log("CSS updated.");
