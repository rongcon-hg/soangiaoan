const fs = require('fs');

// 1. Patch layout.js
let layout = fs.readFileSync('public/js/layout.js', 'utf8');
layout = layout.replace(
    '<div class="topbar">',
    `<div class="topbar">
            <div style="display:flex; align-items:center;">
                <button class="mobile-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>`
);
layout = layout.replace(
    '<div style="font-weight:600; color:var(--text-light)">${pageTitle}</div>',
    '<div class="page-title" style="font-weight:600; color:var(--text-light)">${pageTitle}</div>\n            </div>'
);

if (!layout.includes('toggleSidebar')) {
    layout += `
window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    if(sidebar) sidebar.classList.toggle('open');
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'sidebar-overlay';
        overlay.onclick = function() { window.toggleSidebar(); };
        document.body.appendChild(overlay);
    }
    overlay.classList.toggle('active');
};
`;
}
fs.writeFileSync('public/js/layout.js', layout);

// 2. Patch style.css
let style = fs.readFileSync('public/css/style.css', 'utf8');

const responsiveCSS = `
/* Responsive Styles */
.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-right: 15px;
    color: var(--text);
}
.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
}
.sidebar-overlay.active {
    display: block;
}

@media (max-width: 768px) {
    .mobile-toggle {
        display: inline-block;
    }
    .sidebar {
        position: fixed;
        left: -280px;
        top: 0;
        bottom: 0;
        z-index: 1000;
        transition: left 0.3s ease;
        width: 260px;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }
    .sidebar.open {
        left: 0;
    }
    .main-content {
        width: 100%;
        margin-left: 0;
    }
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
    .topbar {
        padding: 15px;
    }
    .content-area {
        padding: 15px;
    }
}
@media (max-width: 480px) {
    .page-title {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
    .topbar span {
        font-size: 14px;
    }
}
`;

if (!style.includes('.mobile-toggle')) {
    style += responsiveCSS;
    fs.writeFileSync('public/css/style.css', style);
}
console.log('Patched layout.js and style.css for responsiveness');
