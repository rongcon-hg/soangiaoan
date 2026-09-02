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
        <a href="/" class="nav-item" id="nav-projects" title="Quản lý Giáo án">
            <i class="fas fa-layer-group"></i> <span class="nav-item-text">Quản lý Giáo án</span>
        </a>
        <a href="/library" class="nav-item" id="nav-library" title="Thư viện Giáo án">
            <i class="fas fa-book-open"></i> <span class="nav-item-text">Thư viện Giáo án</span>
        </a>

        <a href="/approvals" class="nav-item" id="nav-approvals" style="display:none" title="Phê duyệt Giáo án">
            <i class="fas fa-check-double"></i> <span class="nav-item-text">Phê duyệt Giáo án</span>
        </a>
        <a href="/profile" class="nav-item" id="nav-profile" title="Thông tin cá nhân">
            <i class="fas fa-user"></i> <span class="nav-item-text">Thông tin cá nhân</span>
        </a>

        <div class="nav-menu-bottom" style="margin-top:auto; padding-top:10px; border-top:1px solid var(--border, #e2e8f0); display:flex; flex-direction:column;">
            <a href="/departments" class="nav-item" id="nav-departments" style="display:none" title="Quản lý Đơn vị">
                <i class="fas fa-building"></i> <span class="nav-item-text">Quản lý Đơn vị</span>
            </a>
            <a href="/users" class="nav-item" id="nav-users" style="display:none" title="Quản lý Người dùng">
                <i class="fas fa-users"></i> <span class="nav-item-text">Quản lý Người dùng</span>
            </a>
            <a href="/settings" class="nav-item" id="nav-settings" title="Cấu hình hệ thống">
                <i class="fas fa-cog"></i> <span class="nav-item-text">Cấu hình hệ thống</span>
            </a>
            <a href="#" class="nav-item" onclick="logout()" style="color:var(--danger);" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'" title="Đăng xuất">
                <i class="fas fa-sign-out-alt" style="color:var(--danger);"></i> <span class="nav-item-text">Đăng xuất</span>
            </a>
        </div>
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
            <div style="display:flex; align-items:center; gap:20px;">
                <!-- V2: Notification Bell -->
                <div class="notification-wrapper" style="position:relative; cursor:pointer;" onclick="toggleNotifications()">
                    <i class="fas fa-bell" style="font-size: 1.2rem; color: #64748b; transition: color 0.2s;"></i>
                    <span id="notif-badge" style="display:none; position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; font-size:10px; padding:2px 5px; border-radius:10px; font-weight:bold; line-height:1;">0</span>
                    <div id="notif-dropdown" class="notif-dropdown" style="display:none;">
                        <div style="padding:12px 15px; font-weight:bold; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:14px; color:#1e293b;">Thông báo</span>
                            <span style="font-size:12px; color:#3b82f6; cursor:pointer;" onclick="markAllNotificationsRead(event)">Đánh dấu đã đọc</span>
                        </div>
                        <div id="notif-list" style="max-height:300px; overflow-y:auto; padding:0;">
                            <div style="text-align:center; padding:20px 10px; color:#94a3b8; font-size:13px;">Chưa có thông báo nào</div>
                        </div>
                    </div>
                </div>

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
<!-- Renewal Request Modal -->
<div id="renewal-modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.65); backdrop-filter:blur(4px); z-index:99999; align-items:center; justify-content:center; padding:16px;">
    <div style="background:#fff; border-radius:14px; max-width:520px; width:100%; box-shadow:0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1); overflow:hidden; border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg, #16469d 0%, #1e3a8a 100%); color:#fff; padding:18px 22px; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:1.1rem; display:flex; align-items:center; gap:8px; color:#fff;">
                <i class="fas fa-history"></i> Gửi Yêu cầu Gia hạn Sử dụng
            </h3>
            <button type="button" onclick="closeRenewalModal()" style="background:transparent; border:none; color:#fff; font-size:1.4rem; cursor:pointer; opacity:0.8; line-height:1;" title="Đóng">&times;</button>
        </div>
        <div style="padding:22px; max-height:80vh; overflow-y:auto;">
            <div id="renewal-modal-notice" style="background:#fef2f2; border-left:4px solid #ef4444; padding:12px 14px; border-radius:6px; margin-bottom:18px; color:#991b1b; font-size:0.88rem; line-height:1.5;">
                <i class="fas fa-exclamation-triangle"></i> Tài khoản của bạn đã hết thời hạn sử dụng. Vui lòng gửi thông tin để Quản trị viên hỗ trợ kích hoạt thêm thời gian sử dụng nhé!
            </div>
            <form id="renewal-request-form" onsubmit="submitRenewalForm(event)">
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-weight:600; font-size:0.88rem; color:#334155; margin-bottom:4px; display:block;">Họ và tên <span style="color:#ef4444;">*</span></label>
                    <input type="text" id="renewal-fullname" class="form-control" required placeholder="Nhập họ và tên...">
                </div>
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-weight:600; font-size:0.88rem; color:#334155; margin-bottom:4px; display:block;">Email liên hệ <span style="color:#ef4444;">*</span></label>
                    <input type="email" id="renewal-email" class="form-control" required placeholder="name@nsg.edu.vn">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
                    <div class="form-group">
                        <label style="font-weight:600; font-size:0.88rem; color:#334155; margin-bottom:4px; display:block;">Số điện thoại</label>
                        <input type="text" id="renewal-phone" class="form-control" placeholder="09xx...">
                    </div>
                    <div class="form-group">
                        <label style="font-weight:600; font-size:0.88rem; color:#334155; margin-bottom:4px; display:block;">Khoa / Bộ môn</label>
                        <input type="text" id="renewal-dept" class="form-control" placeholder="Ví dụ: Khoa Cơ khí">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:18px;">
                    <label style="font-weight:600; font-size:0.88rem; color:#334155; margin-bottom:4px; display:block;">Lời nhắn gửi Quản trị viên</label>
                    <textarea id="renewal-reason" class="form-control" rows="3" placeholder="Vui lòng nói lý do chúng tôi Thầy/Cô muốn liên hệ với chúng tôi để gia hạn sử dụng phần mềm."></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeRenewalModal()">Đóng</button>
                    <button type="submit" id="btn-submit-renewal" class="btn btn-primary" style="background:#16469d;">
                        <i class="fas fa-paper-plane"></i> Gửi yêu cầu gia hạn
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

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


function showExpiredWarningBanner(user) {
    if (document.getElementById('expired-warning-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'expired-warning-banner';
    banner.style.cssText = 'background:#fee2e2; border-bottom:1px solid #fca5a5; color:#991b1b; padding:10px 16px; font-size:0.88rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; z-index:999;';
    banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <i class="fas fa-exclamation-circle" style="font-size:1.1rem; color:#dc2626;"></i>
            <span>Tài khoản của bạn đã <b>hết thời hạn sử dụng</b>. Một số tính năng có thể bị khóa.</span>
        </div>
        <button type="button" onclick="openRenewalModal()" class="btn btn-sm" style="background:#dc2626; color:#fff; font-size:0.82rem; padding:5px 12px; border:none; border-radius:6px; font-weight:600; cursor:pointer;">
            <i class="fas fa-history"></i> Gửi yêu cầu gia hạn ngay
        </button>
    `;
    const topbar = document.querySelector('.topbar');
    if (topbar && topbar.parentNode) {
        topbar.parentNode.insertBefore(banner, topbar.nextSibling);
    }
}

function openRenewalModal() {
    const modal = document.getElementById('renewal-modal-overlay');
    if (!modal) return;
    if (currentUser) {
        document.getElementById('renewal-fullname').value = currentUser.full_name || currentUser.username || '';
        document.getElementById('renewal-email').value = currentUser.email || '';
        document.getElementById('renewal-phone').value = currentUser.phone || '';
        document.getElementById('renewal-dept').value = currentUser.department || '';

        // Tùy chỉnh nội dung thông báo theo thời gian còn lại
        const noticeBox = document.getElementById('renewal-modal-notice');
        if (noticeBox) {
            if (currentUser.expires_at) {
                const expDate = new Date(currentUser.expires_at);
                const now = new Date();
                const diffTime = expDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 0) {
                    noticeBox.style.background = '#eff6ff';
                    noticeBox.style.borderLeftColor = '#2563eb';
                    noticeBox.style.color = '#1e40af';
                    noticeBox.innerHTML = `<i class="fas fa-info-circle"></i> Tài khoản của bạn còn <b>${diffDays} ngày</b> sẽ hết thời hạn sử dụng. Vui lòng gửi thông tin để Quản trị viên hỗ trợ kích hoạt thêm thời gian sử dụng nhé!`;
                } else {
                    noticeBox.style.background = '#fef2f2';
                    noticeBox.style.borderLeftColor = '#ef4444';
                    noticeBox.style.color = '#991b1b';
                    noticeBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Tài khoản của bạn đã hết thời hạn sử dụng. Vui lòng gửi thông tin để Quản trị viên hỗ trợ kích hoạt thêm thời gian sử dụng nhé!`;
                }
            } else {
                noticeBox.style.background = '#fef2f2';
                noticeBox.style.borderLeftColor = '#ef4444';
                noticeBox.style.color = '#991b1b';
                noticeBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Tài khoản của bạn đã hết thời hạn sử dụng. Vui lòng gửi thông tin để Quản trị viên hỗ trợ kích hoạt thêm thời gian sử dụng nhé!`;
            }
        }
    }
    modal.style.display = 'flex';
}

function closeRenewalModal() {
    const modal = document.getElementById('renewal-modal-overlay');
    if (modal) modal.style.display = 'none';

    // Nếu tài khoản đã hết hạn và đang ở trang Quản lý Giáo án hoặc Soạn giáo án, lập tức chuyển về Bảng điều khiển
    if (currentUser && currentUser.is_expired) {
        const path = window.location.pathname;
        if (path === '/' || path === '/app' || path.startsWith('/app')) {
            window.location.href = '/dashboard';
        }
    }
}

async function submitRenewalForm(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-renewal');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    }

    const payload = {
        fullName: document.getElementById('renewal-fullname')?.value.trim() || (currentUser?.full_name || ''),
        username: currentUser?.username || '',
        email: document.getElementById('renewal-email')?.value.trim() || (currentUser?.email || ''),
        phone: document.getElementById('renewal-phone')?.value.trim() || '',
        department: document.getElementById('renewal-dept')?.value.trim() || '',
        reason: document.getElementById('renewal-reason')?.value.trim() || ''
    };

    try {
        const res = await fetch(API_URL + '/auth/request-renewal', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error);

        closeRenewalModal();
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Đã gửi yêu cầu!',
                text: 'Yêu cầu gia hạn của Thầy/Cô đã được gửi tới Quản trị viên và email xác nhận đã được gửi vào hộp thư của bạn.',
                icon: 'success',
                confirmButtonColor: '#16469d'
            });
        } else {
            alert('Đã gửi yêu cầu gia hạn thành công!');
        }

        if (currentUser && currentUser.is_expired) {
            const path = window.location.pathname;
            if (path === '/' || path === '/app' || path.startsWith('/app')) {
                window.location.href = '/dashboard';
            }
        }
    } catch (err) {
        console.error(err);
        alert(err.message || 'Lỗi khi gửi yêu cầu gia hạn');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi yêu cầu gia hạn';
        }
    }
}


function updateExpiryUI(user) {
    if (!user) return;
    const sbBadge = document.getElementById('sidebar-expiry-badge');

    if (user.role === 'Admin') {
        const html = `<span style="font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:999px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-infinity"></i> Vô thời hạn</span>`;
        if (sbBadge) { sbBadge.innerHTML = html; sbBadge.style.display = 'block'; }
        return;
    }

    if (user.expires_at) {
        const expDate = new Date(user.expires_at);
        const now = new Date();
        const diffTime = expDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let sbBadgeHtml = '';

        if (diffDays <= 0) {
            sbBadgeHtml = `<span style="font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:999px; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.05);"><i class="fas fa-times-circle"></i> Đã hết hạn <span style="text-decoration:underline; margin-left:2px;">[Gia hạn]</span></span>`;
        } else if (diffDays <= 7) {
            sbBadgeHtml = `<span style="font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:999px; background:#fef3c7; color:#b45309; border:1px solid #fde68a; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.05);"><i class="fas fa-hourglass-half"></i> Còn ${diffDays} ngày <span style="text-decoration:underline; margin-left:2px;">[Gia hạn]</span></span>`;
        } else {
            sbBadgeHtml = `<span style="font-size:0.75rem; font-weight:600; padding:3px 8px; border-radius:999px; background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 2px rgba(0,0,0,0.05);"><i class="fas fa-clock"></i> Còn ${diffDays} ngày <span style="opacity:0.8; margin-left:2px;">[Gia hạn]</span></span>`;
        }

        if (sbBadge) { sbBadge.innerHTML = sbBadgeHtml; sbBadge.style.display = 'block'; }
    }
}

// ================= V2: NOTIFICATION LOGIC =================
function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.notification-wrapper');
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && dropdown.style.display === 'block' && wrapper && !wrapper.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

async function loadNotifications() {
    try {
        const res = await fetch(API_URL + '/users/notifications?t=' + Date.now(), { headers: Object.assign({}, getHeaders(), { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }) });
        if (!res.ok) return;
        const notifs = await res.json();
        
        const list = document.getElementById('notif-list');
        const badge = document.getElementById('notif-badge');
        
        if (!notifs || notifs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px 10px; color:#94a3b8; font-size:13px;">Chưa có thông báo nào</div>';
            badge.style.display = 'none';
            return;
        }

        const unreadCount = notifs.filter(n => !n.is_read).length;
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

        let html = '';
        notifs.forEach(n => {
            const bg = n.is_read ? 'transparent' : '#f0f9ff';
            const icon = n.type === 'success' ? '<i class="fas fa-check-circle" style="color:#22c55e;"></i>' : 
                         n.type === 'error' ? '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i>' : 
                         '<i class="fas fa-info-circle" style="color:#3b82f6;"></i>';
            html += `
                <div style="padding:12px 15px; border-bottom:1px solid #f1f5f9; background:${bg}; display:flex; gap:12px; align-items:flex-start; font-size:13px; line-height:1.4;">
                    <div style="margin-top:2px;">${icon}</div>
                    <div>
                        <div style="color:#334155; margin-bottom:4px;">${n.message}</div>
                        <div style="font-size:11px; color:#94a3b8;">${new Date(n.created_at).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;

    } catch (e) {
        console.error('Lỗi tải thông báo', e);
    }
}

window.readSingleNotification = async function(id, link) {
    try {
        await fetch(API_URL + `/users/notifications/${id}/read`, {
            method: 'POST',
            headers: getHeaders()
        });
        
        // Hide dropdown
        document.getElementById('notif-dropdown').classList.remove('show');
        
        if (link && link !== 'null' && link !== '') {
            window.location.href = link;
        } else {
            // If no link, just reload notifications to update UI
            loadNotifications();
        }
    } catch(e) {
        console.error('Lỗi đánh dấu đã đọc', e);
    }
}

async function markAllNotificationsRead(e) {
    if (e) e.stopPropagation();
    try {
        await fetch(API_URL + '/users/notifications/read', { method: 'POST', headers: getHeaders() });
        loadNotifications();
    } catch(err) {
        console.error(err);
    }
}

// Tự động load thông báo
window.addEventListener('DOMContentLoaded', () => {
    // Đợi token check
    setTimeout(loadNotifications, 1000);
});
