const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middlewares/auth');
const mailer = require('../utils/mailer');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const xlsx = require('xlsx');


// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    next();
};

router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Đảm bảo cột expires_at luôn tồn tại
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;`).catch(() => {});
        
        let result;
        try {
            const query = `SELECT u.id, u.username, u.role, u.full_name, u.email, u.is_verified, u.expires_at, u.last_login, d.name AS department_name, u.department_id, u.phone, u.avatar, u.settings 
                           FROM users u 
                           LEFT JOIN departments d ON u.department_id = d.id 
                           ORDER BY u.id ASC`;
            result = await pool.query(query);
        } catch (colErr) {
            const fallbackQuery = `SELECT id, username, role, full_name, email, is_verified FROM users ORDER BY id ASC`;
            result = await pool.query(fallbackQuery);
        }
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { username, password, email, role, full_name, expires_at } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let finalExpires = expires_at;
        if (!finalExpires) {
            finalExpires = role === 'Admin' ? '2099-12-31 23:59:59' : null;
        }

        let query, params;
        if (finalExpires) {
            query = `INSERT INTO users (username, password, email, role, full_name, is_verified, expires_at) VALUES ($1, $2, $3, $4, $5, true, $6) RETURNING id`;
            params = [username, hashedPassword, email, role, full_name || null, finalExpires];
        } else {
            query = `INSERT INTO users (username, password, email, role, full_name, is_verified, expires_at) VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP + INTERVAL '1 month') RETURNING id`;
            params = [username, hashedPassword, email, role, full_name || null];
        }

        await pool.query(query, params);
        res.status(201).json({ message: 'Thêm người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET /api/users/template
router.get('/template', authenticateToken, isAdmin, (req, res) => {
    try {
        const wb = xlsx.utils.book_new();
        const wsData = [
            ['Tên đăng nhập (*)', 'Họ và tên', 'Email', 'Vai trò (Admin/Manager/User)', 'Mật khẩu', 'Mã phòng ban (ID)']
        ];
        wsData.push(['nguyenvana', 'Nguyễn Văn A', 'nva@example.com', 'User', '123456', '']);
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [{wch: 20}, {wch: 30}, {wch: 25}, {wch: 25}, {wch: 15}, {wch: 15}];
        xlsx.utils.book_append_sheet(wb, ws, 'UsersTemplate');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="Mau_Import_Nguoi_Dung.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

// GET /api/users/export
router.get('/export', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `SELECT u.username, u.full_name, u.email, u.role, d.name AS department_name, u.is_verified, u.expires_at, u.last_login 
                       FROM users u LEFT JOIN departments d ON u.department_id = d.id ORDER BY u.id ASC`;
        const result = await pool.query(query);

        const wsData = [
            ['Tên đăng nhập', 'Họ và tên', 'Email', 'Vai trò', 'Phòng ban', 'Trạng thái', 'Hạn sử dụng', 'Đăng nhập cuối']
        ];

        result.rows.forEach(r => {
            const exp = r.expires_at ? new Date(r.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn';
            const ll = r.last_login ? new Date(r.last_login).toLocaleString('vi-VN') : 'Chưa đăng nhập';
            const status = r.is_verified ? 'Đã xác thực' : 'Chờ xác thực';
            wsData.push([
                r.username, r.full_name || '', r.email || '', r.role, r.department_name || '', status, exp, ll
            ]);
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [ {wch: 15}, {wch: 25}, {wch: 25}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 20} ];
        xlsx.utils.book_append_sheet(wb, ws, 'UsersList');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="Danh_Sach_Nguoi_Dung.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

// POST /api/users/import
router.post('/import', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn file Excel.' });

    try {
        const wb = xlsx.read(req.file.buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        if (data.length < 2) return res.status(400).json({ message: 'File không có dữ liệu hợp lệ.' });

        const rows = data.slice(1);
        let successCount = 0;
        let skipCount = 0;

        for (let row of rows) {
            if (!row[0]) continue; // skip empty rows
            
            const username = row[0].toString().trim();
            const full_name = row[1] ? row[1].toString().trim() : null;
            const email = row[2] ? row[2].toString().trim() : null;
            const role = row[3] ? row[3].toString().trim() : 'User';
            const rawPassword = row[4] ? row[4].toString().trim() : '123456';
            let dept_id = row[5] ? parseInt(row[5], 10) : null;
            if (isNaN(dept_id)) dept_id = null;

            const check = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
            if (check.rows.length > 0) {
                skipCount++;
                continue;
            }

            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            let finalExpires = role === 'Admin' ? '2099-12-31 23:59:59' : null;
            
            const query = `INSERT INTO users (username, password, email, role, full_name, department_id, is_verified, expires_at) 
                           VALUES ($1, $2, $3, $4, $5, $6, true, COALESCE($7, CURRENT_TIMESTAMP + INTERVAL '1 month'))`;
            await pool.query(query, [username, hashedPassword, email, role, full_name, dept_id, finalExpires]);
            successCount++;
        }

        res.json({ message: `Import thành công ${successCount} tài khoản, bỏ qua ${skipCount} (bị trùng Tên đăng nhập).` });
    } catch(e) {
        res.status(500).json({message: 'Lỗi đọc file: ' + e.message});
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { email, password, role, full_name, expires_at } = req.body;
    try {
        const prevRes = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        const prevUser = prevRes.rows[0];

        let finalExpires = expires_at;
        if (role === 'Admin' && (!finalExpires || new Date(finalExpires) < new Date('2090-01-01'))) {
            finalExpires = '2099-12-31 23:59:59';
        }

        const { department_id } = req.body;
        let query, params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE users SET email = $1, role = $2, full_name = $3, password = $4, expires_at = $5, department_id = $6 WHERE id = $7`;
            params = [email, role, full_name || null, hashedPassword, finalExpires, department_id || null, req.params.id];
        } else {
            query = `UPDATE users SET email = $1, role = $2, full_name = $3, expires_at = $4, department_id = $5 WHERE id = $6`;
            params = [email, role, full_name || null, finalExpires, department_id || null, req.params.id];
        }
        await pool.query(query, params);

        // Nếu gia hạn thêm thời gian sử dụng mới, gửi email thông báo cho giảng viên
        if (prevUser && prevUser.email && finalExpires && role !== 'Admin') {
            const newDate = new Date(finalExpires);
            const prevDate = prevUser.expires_at ? new Date(prevUser.expires_at) : new Date(0);
            if (newDate > prevDate && newDate > new Date()) {
                try {
                    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
                    const host = req.headers['x-forwarded-host'] || req.get('host');
                    const loginUrl = `${protocol}://${host}/login`;
                    const d = newDate;
                    const newExpiryFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    
                    await mailer.sendMail(prevUser.email, '[Hệ thống Giáo án] Tài khoản của bạn đã được gia hạn thành công!', 'renewal-approved-user', {
                        fullName: full_name || prevUser.full_name || prevUser.username,
                        newExpiryFormatted,
                        loginUrl
                    });
                } catch (mailErr) {
                    console.error('Lỗi gửi mail thông báo gia hạn thành công:', mailErr);
                }
            }
        }

        res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Lấy danh sách thông báo của user (Phase 1)
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const pool = require('../config/database');
        const notifRes = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
            [req.user.id]
        );
        res.json(notifRes.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Đánh dấu một thông báo là đã đọc
router.post('/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const pool = require('../config/database');
        await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1 AND id = $2', [req.user.id, req.params.id]);
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Đánh dấu tất cả đã đọc
router.post('/notifications/read', authenticateToken, async (req, res) => {
    try {
        const pool = require('../config/database');
        await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
