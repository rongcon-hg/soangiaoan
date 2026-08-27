const sidebarHTML = `
<div class="sidebar">
    <div class="sidebar-header">
        <h2><i class="fas fa-book-open"></i> Giáo án điện tử</h2>
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
    document.body.insertAdjacentHTML('afterbegin', '<div class=\x22sidebar-overlay\x22 onclick=\x22toggleSidebar()\x22></div>' + sidebarHTML);
    
    // Set active
    const activeNav = document.getElementById('nav-' + pageId);
    if(activeNav) activeNav.classList.add('active');

    // Create main content wrapper
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    const topbar = `
        <div class="topbar">
            <div style="display:flex; align-items:center;">
                <button class="mobile-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
            <div class="page-title" style="font-weight:600; color:var(--text-light)">${pageTitle}</div>
            </div>
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
    document.body.insertAdjacentHTML('beforeend', `
<!-- Back to Top Button -->
<button class="back-to-top" onclick="scrollToTop()" title="Lên đầu trang"><i class="fas fa-arrow-up"></i></button>
`);
    setupBackToTop();
}


function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        if(overlay) overlay.classList.toggle('active');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function scrollToTop() {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if(!btn) return;
    const checkScroll = (e) => {
        if (e.target.scrollTop > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    };
    
    const contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.addEventListener('scroll', checkScroll);
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.addEventListener('scroll', checkScroll);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.style.display = 'flex';
        else btn.style.display = 'none';
    });
}
