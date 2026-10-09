<!-- QR Code Modal -->
<div id="qr-modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.65); backdrop-filter:blur(4px); z-index:100000; align-items:center; justify-content:center; padding:16px;">
    <div style="background:#fff; border-radius:14px; max-width:850px; width:100%; box-shadow:0 20px 25px -5px rgba(0,0,0,0.2); overflow:hidden;">
        
        <div style="padding: 24px 30px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <div style="display:inline-block; background:#fef3c7; color:#d97706; font-size:12px; font-weight:bold; padding:4px 12px; border-radius:99px; border:1px solid #fde68a; margin-bottom:10px;"><i class="fas fa-crown"></i> Gói Dịch Vụ Thành Viên</div>
                <h2 style="margin:0; font-size:22px; color:#0f172a; font-weight:800; margin-bottom:5px;">Thông Tin Thanh Toán Chuyển Khoản</h2>
                <p style="margin:0; font-size:14px; color:#64748b;">Mở ứng dụng Ngân hàng để quét mã QR hoặc chuyển khoản với nội dung chính xác bên dưới.</p>
            </div>
            <button type="button" onclick="document.getElementById('qr-modal-overlay').style.display='none'" style="background:transparent; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <div style="padding:15px 30px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:13px; color:#475569;">
            <div><i class="far fa-calendar-alt"></i> Tài khoản: <b style="color:#0f172a;" id="qr-modal-email"></b></div>
            <div><i class="far fa-clock"></i> Hạn dùng: <b style="color:#10b981;" id="qr-modal-expires"></b></div>
        </div>

        <div style="display:flex; flex-wrap:wrap; padding:25px 30px; gap:30px;">
            <div style="flex: 0 0 280px; text-align:center;">
                <div style="border:1px solid #e2e8f0; border-radius:12px; padding:15px; margin-bottom:15px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
                    <img id="qr-image" src="" style="width:100%; display:block; border-radius:8px;">
                </div>
                <div style="font-size:12.5px; color:#64748b; display:flex; align-items:flex-start; gap:8px; text-align:left;">
                    <i class="fas fa-qrcode" style="margin-top:2px;"></i> Mở App Ngân Hàng quét mã để chuyển khoản nhanh với nội dung tự động điền.
                </div>
            </div>
            
            <div style="flex:1; min-width:300px;">
                <div style="background:#eff6ff; border-radius:8px; padding:15px 20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div style="font-size:16px; font-weight:700; color:#1e293b;" id="qr-modal-pkg-name"></div>
                    <div style="font-size:20px; font-weight:800; color:#3b82f6;" id="qr-modal-pkg-price"></div>
                </div>

                <div style="display:flex; border:1px solid #e2e8f0; border-radius:6px; padding:12px 15px; margin-bottom:12px; align-items:center;">
                    <div style="flex:0 0 120px; color:#64748b; font-size:14px;">Ngân hàng:</div>
                    <div style="flex:1; font-weight:700; font-size:15px; color:#0f172a; text-align:right;" id="qr-modal-bank"></div>
                </div>

                <div style="display:flex; border:1px solid #e2e8f0; border-radius:6px; padding:12px 15px; margin-bottom:12px; align-items:center;">
                    <div style="flex:0 0 120px; color:#64748b; font-size:14px;">Số tài khoản:</div>
                    <div style="flex:1; font-weight:700; font-size:15px; color:#0f172a; text-align:right;" id="qr-modal-account"></div>
                    <button onclick="copyToClipboard(document.getElementById('qr-modal-account').innerText, this)" style="margin-left:15px; background:#fff; border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; font-size:12px; cursor:pointer; color:#475569;"><i class="far fa-copy"></i> Sao chép</button>
                </div>

                <div style="display:flex; border:1px solid #e2e8f0; border-radius:6px; padding:12px 15px; margin-bottom:12px; align-items:center;">
                    <div style="flex:0 0 120px; color:#64748b; font-size:14px;">Chủ tài khoản:</div>
                    <div style="flex:1; font-weight:700; font-size:15px; color:#0f172a; text-align:right;" id="qr-modal-owner"></div>
                </div>

                <div style="display:flex; border:1px solid #e2e8f0; border-radius:6px; padding:12px 15px; margin-bottom:15px; align-items:center;">
                    <div style="flex:0 0 120px; color:#64748b; font-size:14px;">Số tiền:</div>
                    <div style="flex:1; font-weight:700; font-size:15px; color:#10b981; text-align:right;" id="qr-modal-amount"></div>
                    <button onclick="copyToClipboard(document.getElementById('qr-modal-amount').innerText.replace(/[^0-9]/g, ''), this)" style="margin-left:15px; background:#fff; border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; font-size:12px; cursor:pointer; color:#475569;"><i class="far fa-copy"></i> Sao chép</button>
                </div>

                <div style="display:flex; border:1px dashed #ef4444; background:#fef2f2; border-radius:6px; padding:12px 15px; margin-bottom:20px; align-items:center;">
                    <div style="flex:0 0 120px; color:#b91c1c; font-size:14px; font-weight:600;">Nội dung CK:</div>
                    <div style="flex:1; font-weight:800; font-size:16px; color:#ef4444; text-align:right;" id="qr-modal-desc"></div>
                    <button onclick="copyToClipboard(document.getElementById('qr-modal-desc').innerText, this)" style="margin-left:15px; background:#fff; border:1px solid #fca5a5; border-radius:4px; padding:4px 8px; font-size:12px; cursor:pointer; color:#ef4444;"><i class="far fa-copy"></i> Sao chép</button>
                </div>

                <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:12px 15px; color:#b45309; font-size:12.5px; line-height:1.5;">
                    <i class="fas fa-exclamation-circle"></i> <b>Lưu ý:</b> Vui lòng giữ nguyên nội dung chuyển khoản <b id="qr-modal-desc-warn"></b> để hệ thống duyệt và kích hoạt tự động chính xác cho tài khoản của bạn.
                </div>
            </div>
        </div>

        <div style="padding:20px 30px; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:15px; align-items:center;">
            <a href="javascript:void(0)" onclick="document.getElementById('qr-modal-overlay').style.display='none'; document.getElementById('renewal-modal-overlay').style.display='flex';" style="color:#0f172a; text-decoration:none; font-weight:600; font-size:14.5px;">Đổi gói khác</a>
            <button class="btn btn-primary" onclick="document.getElementById('qr-modal-overlay').style.display='none'; closeRenewalModal(); alert('Hệ thống sẽ tự động cộng ngày sử dụng ngay sau khi Admin duyệt giao dịch của bạn!');" style="background:#6366f1; border-color:#6366f1; border-radius:8px; padding:10px 20px; font-weight:600; font-size:15px;"><i class="far fa-check-circle"></i> Tôi Đã Chuyển Khoản Xong</button>
        </div>

    </div>
</div>

<!-- QR Code Modal -->
<div id="qr-modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.65); backdrop-filter:blur(4px); z-index:100000; align-items:center; justify-content:center; padding:16px;">
    <div style="background:#fff; border-radius:14px; max-width:400px; width:100%; box-shadow:0 20px 25px -5px rgba(0,0,0,0.2); overflow:hidden;">
        <div style="background:#16469d; color:#fff; padding:15px 20px; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:1rem; color:#fff;">Thanh toán qua mã QR</h3>
            <button type="button" onclick="document.getElementById('qr-modal-overlay').style.display='none'" style="background:transparent; border:none; color:#fff; font-size:1.4rem; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:20px; text-align:center;">
            <div id="qr-image-container" style="min-height:300px; margin-bottom:15px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
                <img id="qr-image" src="" style="max-width:100%; display:none; border-radius:8px;">
            </div>
            <p style="font-size:0.9rem; color:#475569; margin-bottom:15px;">Mở ứng dụng ngân hàng và quét mã QR phía trên để thanh toán.</p>
            <button class="btn btn-primary" onclick="document.getElementById('qr-modal-overlay').style.display='none'; closeRenewalModal();" style="width:100%;">Đã thanh toán xong</button>
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


// --- DARK MODE LOGIC ---
function toggleDarkMode(e) {
    if(e) e.preventDefault();
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeUI(isDark);
    
    // Broadcast to iframes (for planner/schedule)
    document.querySelectorAll('iframe').forEach(iframe => {
        if(iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'TOGGLE_DARK_MODE', isDark }, '*');
        }
    });
}

function updateDarkModeUI(isDark) {
    const btn = document.getElementById('header-darkmode');
    if(btn) {
        btn.innerHTML = isDark 
            ? '<i class="fas fa-sun" style="font-size: 1.25rem; color:#f59e0b; transition: color 0.2s;"></i>'
            : '<i class="fas fa-moon" style="font-size: 1.25rem; color:#64748b; transition: color 0.2s;"></i>';
    }
}

function initDarkMode() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if(isDark) document.body.classList.add('dark-mode');
    
    // Inject global Dark Mode CSS
    const style = document.createElement('style');
    style.innerHTML = `
        body.dark-mode {
            --bg: #0f172a; --white: #1e293b; --text: #e2e8f0; --text-light: #94a3b8; --border: #334155;
            background-color: var(--bg); color: var(--text);
        }
        body.dark-mode .sidebar { background: var(--white); border-right: 1px solid var(--border); }
        body.dark-mode .nav-item { color: var(--text); }
        body.dark-mode .nav-item:hover { background: #334155; }
        body.dark-mode .nav-item.active { background: #3b82f6; color: #fff; }
        body.dark-mode .top-header { background: var(--white); border-bottom: 1px solid var(--border); }
        body.dark-mode .stat-card, body.dark-mode .card, body.dark-mode .panel { background: var(--white); border-color: var(--border); color: var(--text); }
        body.dark-mode table { background-color: var(--bg) !important; }
        body.dark-mode table, body.dark-mode th, body.dark-mode td { border-color: var(--border) !important; color: var(--text) !important; }
        body.dark-mode th { background-color: #0f172a !important; color: #f8fafc !important; }
        body.dark-mode tr:hover { background-color: #334155 !important; }
        body.dark-mode input, body.dark-mode select, body.dark-mode textarea { background: #0f172a; color: #e2e8f0; border: 1px solid var(--border); }
        body.dark-mode .swal2-popup { background: var(--white); color: var(--text); }
        body.dark-mode .swal2-title, body.dark-mode .swal2-html-container { color: var(--text); }
        body.dark-mode .modal-content { background: var(--white); color: var(--text); }
        body.dark-mode .modal-header, body.dark-mode .modal-footer { border-color: var(--border); }
        body.dark-mode .btn-secondary { background: #334155; color: #e2e8f0; border-color: #475569; }
    `;
    document.head.appendChild(style);
    
    // Slight delay to update UI after sidebar is injected
    setTimeout(() => updateDarkModeUI(isDark), 50);
}
document.addEventListener('DOMContentLoaded', initDarkMode);
// ----------------------

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
    
    const noticeBox = document.getElementById('renewal-modal-notice');
    if (noticeBox && currentUser) {
        if (currentUser.expires_at) {
            const expDate = new Date(currentUser.expires_at);
            const now = new Date();
            const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                noticeBox.style.background = '#eff6ff';
                noticeBox.style.borderLeftColor = '#2563eb';
                noticeBox.style.color = '#1e40af';
                noticeBox.innerHTML = `<i class="fas fa-info-circle"></i> Tài khoản của bạn còn <b>${diffDays} ngày</b> sẽ hết thời hạn sử dụng. Hãy chọn gói nâng cấp bên dưới.`;
            } else {
                noticeBox.style.background = '#fef2f2';
                noticeBox.style.borderLeftColor = '#ef4444';
                noticeBox.style.color = '#991b1b';
                noticeBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Tài khoản của bạn đã hết thời hạn sử dụng. Vui lòng chọn gói nâng cấp để tiếp tục sử dụng!`;
            }
        }
    }
    
    modal.style.display = 'flex';
    fetchAndRenderPackages();
}

let billingSettingsCache = null;

async function fetchAndRenderPackages() {
    const container = document.getElementById('billing-packages-container');
    if (!container) return;
    
    try {
        const res = await fetch(API_URL + '/billing/settings', { headers: getHeaders() });
        const data = await res.json();
        
        if (!res.ok) throw new Error('Failed to load packages');
        
        billingSettingsCache = data;
        
        if (!data.packages || data.packages.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#ef4444; font-weight:600;">Hệ thống chưa cấu hình bảng giá.</div>';
            return;
        }
        
        container.innerHTML = data.packages.map(pkg => `
            <div style="border:1px solid #cbd5e1; border-radius:10px; padding:20px; background:#fff; display:flex; flex-direction:column; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <h4 style="margin:0 0 10px; color:#1e293b; font-size:1.1rem; text-align:center;">${pkg.name}</h4>
                <div style="font-size:1.4rem; font-weight:bold; color:#16469d; margin-bottom:15px;">${Number(pkg.price).toLocaleString('vi-VN')} đ</div>
                <div style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Sử dụng ${pkg.days} ngày</div>
                <button type="button" class="btn btn-primary" style="width:100%; border-radius:8px; padding:10px;" onclick="selectBillingPackage('${pkg.id}')">
                    <i class="fas fa-shopping-cart"></i> Thanh Toán Ngay
                </button>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#ef4444;">Lỗi tải bảng giá.</div>';
    }
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

async function selectBillingPackage(pkgId) {
    if (!billingSettingsCache || !billingSettingsCache.packages) return;
    const pkg = billingSettingsCache.packages.find(p => p.id === pkgId);
    if (!pkg) return;
    
    try {
        const payload = {
            package_id: pkg.id,
            package_name: pkg.name,
            amount: pkg.price,
            package_days: pkg.days
        };
        
        const res = await fetch(API_URL + '/billing/request', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Lỗi gửi yêu cầu');
        
        // Hiện mã QR
        showQRCode(pkg, data.transfer_code);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="color:#10b981;"></i> Đã chép';
        setTimeout(() => btn.innerHTML = oldHtml, 2000);
    });
}

function showQRCode(pkg, transferCode) {
    if (!billingSettingsCache || !billingSettingsCache.bank_account) {
        alert('Chưa cấu hình tài khoản ngân hàng.');
        return;
    }
    
    const bankId = billingSettingsCache.bank_name;
    const accountNo = billingSettingsCache.bank_account;
    const accountName = billingSettingsCache.bank_owner;
    const amount = pkg.price;
    const desc = transferCode;
    
    // https://img.vietqr.io/image/<BIN>-<RECEIVER_NUMBER>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(accountName)}`;
    
    const img = document.getElementById('qr-image');
    if (img) img.src = qrUrl;
    
    document.getElementById('qr-modal-email').innerText = currentUser ? (currentUser.email || currentUser.username) : '';
    document.getElementById('qr-modal-expires').innerText = pkg.name; // Trọn đời hoặc + 365 ngày
    
    document.getElementById('qr-modal-pkg-name').innerText = pkg.name;
    document.getElementById('qr-modal-pkg-price').innerText = amount.toLocaleString('vi-VN') + ' ₫';
    
    document.getElementById('qr-modal-bank').innerText = bankId;
    document.getElementById('qr-modal-account').innerText = accountNo;
    document.getElementById('qr-modal-owner').innerText = accountName;
    document.getElementById('qr-modal-amount').innerText = amount.toLocaleString('vi-VN') + ' ₫';
    
    document.getElementById('qr-modal-desc').innerText = desc;
    document.getElementById('qr-modal-desc-warn').innerText = desc;
    
    document.getElementById('renewal-modal-overlay').style.display = 'none';
    document.getElementById('qr-modal-overlay').style.display = 'flex';
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
        
        if (!notifs) notifs = [];

        let hasExpiryWarning = false;
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.expires_at) {
            const expDate = new Date(currentUser.expires_at);
            if (Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24)) <= 7) hasExpiryWarning = true;
        }

        const unreadCount = notifs.filter(n => !n.is_read).length;
        const totalBadge = unreadCount + (hasExpiryWarning ? 1 : 0);
        
        if (totalBadge > 0) {
            badge.textContent = totalBadge;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
        
        if (notifs.length === 0 && !hasExpiryWarning) {
            list.innerHTML = '<div style="text-align:center; padding:20px 10px; color:#94a3b8; font-size:13px;">Chưa có thông báo nào</div>';
            return;
        }

        let html = '';

        if (typeof currentUser !== 'undefined' && currentUser && currentUser.expires_at) {
            const expDate = new Date(currentUser.expires_at);
            const now = new Date();
            const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
            
            let expiryMsg = null;
            let expiryType = null;
            let expiryIcon = null;
            
            if (daysLeft < 0) {
                expiryMsg = `Tài khoản của bạn đã <b>quá hạn</b> sử dụng ${-daysLeft} ngày. Vui lòng gia hạn để tiếp tục sử dụng hệ thống!`;
                expiryType = 'error';
                expiryIcon = '<i class="fas fa-ban" style="color:#ef4444;"></i>';
            } else if (daysLeft === 0) {
                expiryMsg = `Tài khoản của bạn sẽ <b>hết hạn vào hôm nay</b>. Vui lòng gia hạn để tránh gián đoạn!`;
                expiryType = 'error';
                expiryIcon = '<i class="fas fa-exclamation-triangle" style="color:#f59e0b;"></i>';
            } else if (daysLeft <= 7) {
                expiryMsg = `Tài khoản của bạn sắp hết hạn sau <b>${daysLeft} ngày</b> nữa. Vui lòng gia hạn sớm!`;
                expiryType = 'warning';
                expiryIcon = '<i class="fas fa-clock" style="color:#f59e0b;"></i>';
            }

            if (expiryMsg) {
                html += `
                    <div onclick="Swal.fire({ title: 'Bản quyền hệ thống', html: '${expiryMsg}', icon: '${expiryType}' })" style="cursor:pointer; padding:12px 15px; border-bottom:1px solid #f1f5f9; background:#fffbeb; display:flex; gap:12px; align-items:flex-start; font-size:13px; line-height:1.4;">
                        <div style="margin-top:2px;">${expiryIcon}</div>
                        <div>
                            <div style="color:#b45309; margin-bottom:4px; font-weight:600;">${expiryMsg}</div>
                            <div style="font-size:11px; color:#d97706;">Hệ thống tự động</div>
                        </div>
                    </div>
                `;
            }
        }

        notifs.forEach(n => {
            const bg = n.is_read ? 'transparent' : '#f0f9ff';
            const icon = n.type === 'success' ? '<i class="fas fa-check-circle" style="color:#22c55e;"></i>' : 
                         n.type === 'error' ? '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i>' : 
                         '<i class="fas fa-info-circle" style="color:#3b82f6;"></i>';
            
            const escapedMessage = (n.message || '').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, '<br>');
            const formattedDate = new Date(n.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            html += `
                <div onclick="readSingleNotification(${n.id}, '${n.link || ''}', '${escapedMessage}', '${formattedDate}', '${n.type || 'info'}')" style="cursor:pointer; padding:12px 15px; border-bottom:1px solid #f1f5f9; background:${bg}; display:flex; gap:12px; align-items:flex-start; font-size:13px; line-height:1.4; transition: background 0.2s;">
                    <div style="margin-top:2px;">${icon}</div>
                    <div>
                        <div style="color:#334155; margin-bottom:4px;">${n.message}</div>
                        <div style="font-size:11px; color:#94a3b8;">${formattedDate}</div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;

    } catch (e) {
        console.error('Lỗi tải thông báo', e);
    }
}

window.readSingleNotification = async function(id, link, message, created_at, type) {
    try {
        await fetch(API_URL + `/users/notifications/${id}/read`, {
            method: 'POST',
            headers: getHeaders()
        });
        
        document.getElementById('notif-dropdown').classList.remove('show');
        loadNotifications();
        
        if (!message) {
            if (link && link !== 'null' && link !== '') window.location.href = link;
            return;
        }

        const iconType = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
        
        Swal.fire({
            title: 'Chi tiết thông báo',
            html: `
                <div style="text-align:left; font-size:15px; line-height:1.5; color:#334155; margin-bottom:15px;">${message}</div>
                <div style="font-size:12px; color:#94a3b8; text-align:left;"><i class="fas fa-clock" style="margin-right:4px;"></i> ${created_at}</div>
            `,
            icon: iconType,
            showCancelButton: link && link !== 'null' && link !== '' ? true : false,
            confirmButtonText: link && link !== 'null' && link !== '' ? '<i class="fas fa-external-link-alt" style="margin-right:5px;"></i> Xem chi tiết' : 'Đóng',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#64748b'
        }).then((result) => {
            if (result.isConfirmed && link && link !== 'null' && link !== '') {
                window.location.href = link;
            }
        });

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

// Ensure token is synced to cookies for SSR
(function syncTokenToCookie() {
    const token = localStorage.getItem('token');
    if (token) {
        document.cookie = "token=" + token + "; path=/; max-age=864000; SameSite=Lax";
    } else {
        document.cookie = "token=; path=/; max-age=0";
    }
})();
