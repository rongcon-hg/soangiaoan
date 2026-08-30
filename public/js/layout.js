const sidebarHTML = `
<div class="sidebar" id="app-sidebar">
    <div class="sidebar-header">
        <button type="button" class="sidebar-collapse-btn" onclick="toggleSidebar()" title="Thu gọn / Mở rộng menu">
            <i class="fas fa-chevron-left" id="sidebar-collapse-icon"></i>
        </button>
        
        <div style="margin-bottom:8px;">
            <a href="/profile" style="text-decoration:none; display:inline-block;" title="Xem & Cập nhật Hồ sơ cá nhân">
                <div class="sidebar-avatar-wrapper" style="position:relative; width:60px; height:60px; margin:0 auto;">
                    <img id="sidebar-user-avatar" class="sidebar-avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" alt="Avatar" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2.5px solid var(--primary); box-shadow:0 3px 10px rgba(22,70,157,0.18); background:#f8fafc; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                </div>
            </a>
            <div id="sidebar-user-fullname" class="sidebar-user-fullname" style="font-size:0.88rem; font-weight:700; color:#1e293b; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:190px; margin-left:auto; margin-right:auto;">...</div>
        </div>

        <a href="/dashboard" class="sidebar-brand-link" style="text-decoration:none; color:inherit; display:flex; align-items:center; justify-content:center; gap:8px;" title="Bảng điều khiển">
            <h2 class="sidebar-brand-title" style="margin:0; font-size:1.05rem; color:var(--primary); cursor:pointer;"><i class="fas fa-book-open"></i> Giáo án điện tử</h2>
        </a>
    </div>
    <div class="nav-menu">
        <a href="/dashboard" class="nav-item" id="nav-dashboard" title="Bảng điều khiển">
            <i class="fas fa-chart-pie"></i> <span class="nav-item-text">Bảng điều khiển</span>
        </a>
        <a href="/" class="nav-item" id="nav-projects" title="Quản lý Môn học">
            <i class="fas fa-layer-group"></i> <span class="nav-item-text">Quản lý Môn học</span>
        </a>
        <a href="/profile" class="nav-item" id="nav-profile" title="Thông tin cá nhân">
            <i class="fas fa-user"></i> <span class="nav-item-text">Thông tin cá nhân</span>
        </a>
        <a href="/settings" class="nav-item" id="nav-settings" title="Cấu hình hệ thống">
            <i class="fas fa-cog"></i> <span class="nav-item-text">Cấu hình hệ thống</span>
        </a>
        <a href="/users" class="nav-item" id="nav-users" style="display:none" title="Quản lý Người dùng">
            <i class="fas fa-users"></i> <span class="nav-item-text">Quản lý Người dùng</span>
        </a>
        <a href="#" class="nav-item" onclick="logout()" style="margin-top:auto; border-top:1px solid #e2e8f0; color:var(--danger);" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'" title="Đăng xuất">
            <i class="fas fa-sign-out-alt" style="color:var(--danger);"></i> <span class="nav-item-text">Đăng xuất</span>
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
                <button type="button" class="sidebar-toggle-btn" onclick="toggleSidebar()" title="Thu gọn / Mở rộng menu"><i class="fas fa-bars"></i></button>
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
        if(child.className !== 'sidebar' && child.id !== 'app-sidebar' && child.className !== 'sidebar-overlay' && child.id !== 'alert-box' && child.tagName !== 'SCRIPT') {
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

    // Check saved collapsed state on desktop
    if (window.innerWidth > 768) {
        try {
            const savedCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
            const sidebar = document.getElementById('app-sidebar');
            if (sidebar && savedCollapsed) {
                sidebar.classList.add('collapsed');
                updateCollapseIcon(true);
            }
        } catch(e) {}
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar') || document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        if(overlay) overlay.classList.toggle('active');
    } else {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        try {
            localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');
        } catch(e) {}
        updateCollapseIcon(isCollapsed);
    }
}

function updateCollapseIcon(isCollapsed) {
    const icon = document.getElementById('sidebar-collapse-icon');
    if (icon) {
        icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
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
