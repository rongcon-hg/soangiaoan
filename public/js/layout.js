const sidebarHTML = `
<div class="sidebar">
    <div class="sidebar-header" style="display:flex; align-items:center; justify-content:space-between;">
        <a href="/" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:8px;" title="Về trang chủ">
            <h2 style="margin:0; font-size:1.15rem; color:var(--primary); cursor:pointer;"><i class="fas fa-book-open"></i> Giáo án điện tử</h2>
        </a>
        <button type="button" class="sidebar-close-btn" onclick="toggleSidebar()" title="Đóng menu" style="background:none; border:none; color:#64748b; font-size:1.2rem; cursor:pointer; padding:4px 8px;"><i class="fas fa-times"></i></button>
    </div>
    <div class="nav-menu">
        <a href="/dashboard" class="nav-item" id="nav-dashboard">
            <i class="fas fa-chart-pie"></i> Bảng điều khiển
        </a>
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
        <a href="#" class="nav-item" onclick="logout()" style="margin-top:auto; border-top:1px solid #e2e8f0; color:var(--danger);" onmouseover="this.style.background=\'#fee2e2\'" onmouseout="this.style.background=\'transparent\'">
            <i class="fas fa-sign-out-alt" style="color:var(--danger);"></i> Đăng xuất
        </a>
    </div>
</div>
`;

function injectLayout(pageId, pageTitle) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="sidebar-overlay" onclick="toggleSidebar()"></div>' + sidebarHTML);
    
    // Set active
    const activeNav = document.getElementById('nav-' + pageId);
    if(activeNav) activeNav.classList.add('active');

    // Create main content wrapper
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    const topbar = `
        <div class="topbar">
            <div style="display:flex; align-items:center;">
                <button type="button" class="mobile-toggle" onclick="toggleSidebar()" title="Menu"><i class="fas fa-bars"></i></button>
                <div class="page-title" style="font-weight:600; color:var(--text-light)">${pageTitle}</div>
            </div>
            <div>
                <div class="user-greeting">
                    <span class="hello-text">Xin chào,</span> 
                    <a href="/profile" style="text-decoration:none; color:inherit;" title="Xem thông tin cá nhân">
                        <b id="topbar-username" style="color:var(--primary); cursor:pointer; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">...</b>
                    </a> 
                    <a href="#" onclick="logout()" style="margin-left: 8px; color: var(--danger); font-size: 1.1em; text-decoration: none;" title="Đăng xuất"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = topbar;

    // Move existing content into content-area
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    
    // Grab all direct children of body that are not sidebar, sidebar-overlay, alert-box or scripts
    const children = Array.from(document.body.children);
    children.forEach(child => {
        if(child.className !== 'sidebar' && child.className !== 'sidebar-overlay' && child.id !== 'alert-box' && child.tagName !== 'SCRIPT') {
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
    if (!sidebar) return;
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
