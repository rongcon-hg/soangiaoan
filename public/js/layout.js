const sidebarHTML = `
<div class="sidebar">
    <div class="sidebar-header">
        <h2><i class="fas fa-book-open"></i> Sổ Giáo Án</h2>
    </div>
    <div class="nav-menu">
        <a href="/" class="nav-item" id="nav-projects">
            <i class="fas fa-layer-group"></i> Quản lý Môn học
        </a>
        <a href="/profile" class="nav-item" id="nav-profile">
            <i class="fas fa-user"></i> Thông tin cá nhân
        </a>
        <a href="/settings" class="nav-item" id="nav-settings">
            <i class="fas fa-cog"></i> Cấu hình hệ thống
        </a>
        <a href="/users" class="nav-item" id="nav-users" style="display:none">
            <i class="fas fa-users"></i> Quản lý Người dùng
        </a>
        <a href="#" class="nav-item" onclick="logout()" style="margin-top:auto; border-top:1px solid #e2e8f0;">
            <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </a>
    </div>
</div>
`;

function injectLayout(pageId, pageTitle) {
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // Set active
    const activeNav = document.getElementById('nav-' + pageId);
    if(activeNav) activeNav.classList.add('active');

    // Create main content wrapper
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    const topbar = `
        <div class="topbar">
            <div style="font-weight:600; color:var(--text-light)">${pageTitle}</div>
            <div>
                <span>Xin chào, <b id="topbar-username">...</b></span>
            </div>
        </div>
    `;
    mainContent.innerHTML = topbar;

    // Move existing content into content-area
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    
    // Grab all direct children of body that are not sidebar, alert-box or scripts
    const children = Array.from(document.body.children);
    children.forEach(child => {
        if(child.className !== 'sidebar' && child.id !== 'alert-box' && child.tagName !== 'SCRIPT') {
            contentArea.appendChild(child);
        }
    });

    mainContent.appendChild(contentArea);
    document.body.appendChild(mainContent);
}
