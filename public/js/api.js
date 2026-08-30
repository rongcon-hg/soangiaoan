const API_URL = '/api';
let currentUser = null;

function showAlert(msg, type = 'error') {
    const box = document.getElementById('alert-box');
    if(!box) return alert(msg);
    box.textContent = msg;
    box.className = 'alert-' + type;
    box.style.display = 'block';
    setTimeout(() => box.style.display = 'none', 3000);
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

async function checkAuth(redirectIfNotAuth = true) {
    const token = localStorage.getItem('token');
    if (!token) {
        if (redirectIfNotAuth) window.location.href = '/login';
        return null;
    }
    
    try {
        const res = await fetch(API_URL + '/auth/me', { headers: getHeaders() });
        if (!res.ok) throw new Error();
        
        const data = await res.json();
        currentUser = data.user;
        
        if (currentUser) {
            if (currentUser.signature) {
                localStorage.setItem('giaoan_user_signature', currentUser.signature);
            } else {
                localStorage.removeItem('giaoan_user_signature');
            }
            localStorage.setItem('giaoan_user_name', currentUser.full_name || currentUser.username || '');
        }

        // Cập nhật thông tin UI nếu có
        const nameEl = document.getElementById('topbar-username');
        if(nameEl) nameEl.textContent = currentUser.full_name || currentUser.username;

        // Hiện tab admin
        if(currentUser.role === 'Admin') {
            const adminTab = document.getElementById('nav-users');
            if(adminTab) adminTab.style.display = 'flex';
        }

        return currentUser;
    } catch (err) {
        localStorage.removeItem('token');
        if (redirectIfNotAuth) window.location.href = '/login';
        return null;
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
