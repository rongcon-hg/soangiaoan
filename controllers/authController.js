const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const mailer = require('../utils/mailer');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password and email are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id`;
        
        const result = await pool.query(query, [username, hashedPassword, email]);
        
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60000); // 10 phút
        
        await pool.query('UPDATE users SET otp_code = $1, otp_expires = $2 WHERE id = $3', [otpCode, expires, result.rows[0].id]);
        
        try {
            await mailer.sendMail(email, 'Mã xác thực OTP - Hệ thống Giáo án', 'otp', { username, otp: otpCode });
        } catch(e) {
            console.error('Lỗi gửi mail', e);
        }

        res.status(201).json({ message: 'User registered successfully. Please verify OTP.', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    try {
        const query = `SELECT id, otp_code, otp_expires FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.otp_code !== otp) return res.status(400).json({ message: 'Mã OTP không hợp lệ' });
        if (new Date() > new Date(user.otp_expires)) return res.status(400).json({ message: 'Mã OTP đã hết hạn' });

        // Kích hoạt
        await pool.query(`UPDATE users SET is_verified = true, otp_code = NULL, otp_expires = NULL WHERE id = $1`, [user.id]);
        res.json({ message: 'Xác thực tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { username } = req.body;
    try {
        const query = `SELECT id, email FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user || !user.email) return res.status(404).json({ message: 'Tài khoản không tồn tại hoặc chưa có email' });
        
        // Sinh mật khẩu mới ngẫu nhiên 6 ký tự
        const newPassword = Math.random().toString(36).slice(-6);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, user.id]);
        
        try {
            await mailer.sendMail(user.email, 'Đặt lại mật khẩu - Hệ thống Giáo án', 'reset-password', { username, newPassword });
        } catch(e) {
            console.error('Lỗi gửi mail', e);
        }

        res.json({ message: 'Đã gửi mật khẩu mới vào Email của bạn.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const query = `SELECT * FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.is_verified) {
            // Generate and send a new OTP automatically
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 10 * 60000); // 10 minutes
            await pool.query('UPDATE users SET otp_code = $1, otp_expires = $2 WHERE id = $3', [otpCode, expires, user.id]);
            
            try {
                await mailer.sendMail(user.email, 'Mã xác thực OTP - Hệ thống Giáo án', 'otp', { username: user.username, otp: otpCode });
            } catch(e) {
                console.error('Lỗi gửi mail OTP trong lúc login', e);
            }

            return res.status(403).json({ message: 'Đã gửi mã OTP mới vào email của bạn. Vui lòng kiểm tra và xác thực để đăng nhập', requiresOtp: true, username: user.username });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, gemini_api_key: user.gemini_api_key } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApiKey = async (req, res) => {
    const { apiKey } = req.body;
    const userId = req.user.id;

    try {
        const cleanedKey = apiKey ? apiKey.trim() : null;
        const query = `UPDATE users SET gemini_api_key = $1 WHERE id = $2`;
        await pool.query(query, [cleanedKey, userId]);
        res.json({ message: 'Cập nhật API Key thành công', gemini_api_key: cleanedKey });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function toDirectDriveUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('data:image') || url.startsWith('blob:') || url.includes('googleusercontent.com')) {
        return url;
    }
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
}

exports.me = async (req, res) => {
    try {
        let user;
        try {
            const query = `SELECT id, username, role, gemini_api_key, full_name, department, phone, email, avatar, signature, signature_filename, settings FROM users WHERE id = $1`;
            const result = await pool.query(query, [req.user.id]);
            user = result.rows[0];
        } catch (colErr) {
            // Auto run migration if columns missing
            await pool.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS signature TEXT,
                ADD COLUMN IF NOT EXISTS signature_filename TEXT;
            `).catch(() => {});

            const fallbackQuery = `SELECT id, username, role, gemini_api_key, full_name, department, phone, email, avatar, settings FROM users WHERE id = $1`;
            const fallbackRes = await pool.query(fallbackQuery, [req.user.id]);
            user = fallbackRes.rows[0];
            if (user) {
                user.signature = null;
                user.signature_filename = null;
            }
        }

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Normalize signature & avatar to direct image links
        if (user.signature) user.signature = toDirectDriveUrl(user.signature);
        if (user.avatar) user.avatar = toDirectDriveUrl(user.avatar);

        // Lấy key của user 'qtv' hoặc Admin để fallback nếu user không có
        const adminQuery = `SELECT gemini_api_key FROM users WHERE (username = 'qtv' OR role = 'Admin') AND gemini_api_key IS NOT NULL AND gemini_api_key != '' ORDER BY CASE WHEN username = 'qtv' THEN 1 ELSE 2 END LIMIT 1`;
        const adminRes = await pool.query(adminQuery);
        if (adminRes.rows.length > 0) {
            user.admin_gemini_api_key = adminRes.rows[0].gemini_api_key;
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    let { full_name, department, phone, email, avatar } = req.body;
    try {
        // Nếu avatar là chuỗi Base64 mới, ta upload lên Drive
        if (avatar && avatar.startsWith('data:image')) {
            // Lấy config Drive của Admin (hoặc của chính user nếu có)
            const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
            const adminRes = await pool.query(adminQuery);
            let adminSettings = {}; if(adminRes.rows.length > 0 && adminRes.rows[0].settings) { adminSettings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings; }
            
            const driveEmail = adminSettings.drive_email;
            const driveKey = adminSettings.drive_key;
            const driveFolder = adminSettings.drive_folder;

            if (driveEmail && driveKey && driveFolder) {
                const driveUtil = require('../utils/drive');
                // Tách header base64 (ví dụ: data:image/png;base64,iVBORw0...)
                const matches = avatar.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const mimeType = matches[1];
                    const base64Data = matches[2];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const ext = mimeType.split('/')[1] || 'png';
                    const fileName = `avatar_${req.user.id}_${Date.now()}.${ext}`;
                    
                    // Upload lên Drive
                    const driveUrl = await driveUtil.uploadToDrive(driveEmail, driveKey, driveFolder, buffer, fileName, mimeType);
                    avatar = driveUrl; // Thay thế base64 bằng link Drive
                }
            }
        }

        avatar = toDirectDriveUrl(avatar);
        const query = `UPDATE users SET full_name = $1, department = $2, phone = $3, email = $4, avatar = $5 WHERE id = $6`;
        await pool.query(query, [full_name, department, phone, email, avatar, req.user.id]);
        res.json({ message: 'Profile updated successfully', avatar_url: avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSignature = async (req, res) => {
    let { signature, signature_filename } = req.body;
    try {
        if (signature && signature.startsWith('data:image')) {
            const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
            const adminRes = await pool.query(adminQuery);
            let adminSettings = {};
            if (adminRes.rows.length > 0 && adminRes.rows[0].settings) {
                adminSettings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings;
            }
            
            const driveEmail = adminSettings.drive_email;
            const driveKey = adminSettings.drive_key;
            const driveFolder = adminSettings.drive_folder;

            if (driveEmail && driveKey && driveFolder) {
                const driveUtil = require('../utils/drive');
                const matches = signature.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const mimeType = matches[1];
                    const base64Data = matches[2];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const ext = mimeType.split('/')[1] || 'png';
                    const safeName = (req.user.username || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
                    const fileName = `signature_${req.user.id}_${safeName}_${Date.now()}.${ext}`;
                    
                    const driveUrl = await driveUtil.uploadToDrive(driveEmail, driveKey, driveFolder, buffer, fileName, mimeType, req.user.username);
                    signature = driveUrl;
                    if (!signature_filename) signature_filename = fileName;
                }
            }
        }

        signature = toDirectDriveUrl(signature);
        const query = `UPDATE users SET signature = $1, signature_filename = $2 WHERE id = $3`;
        await pool.query(query, [signature || null, signature_filename || null, req.user.id]);
        res.json({ message: 'Signature updated successfully', signature_url: signature, signature_filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    const { settings } = req.body;
    try {
        const query = `UPDATE users SET settings = $1 WHERE id = $2`;
        await pool.query(query, [JSON.stringify(settings), req.user.id]);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.testDriveConnection = async (req, res) => {
    const { email, key, folderId } = req.body;
    if (!email || !key || !folderId) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ Email, Key và Folder ID' });
    }
    
    try {
        const driveUtil = require('../utils/drive');
        const folder = await driveUtil.testConnection(email, key, folderId);
        res.json({ message: 'Kết nối thành công tới thư mục: ' + folder.name });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi kết nối: ' + error.message });
    }
};


exports.testSmtpConnection = async (req, res) => {
    const { host, port, user, pass } = req.body;
    if (!host || !port || !user || !pass) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin SMTP' });
    }
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: host,
            port: parseInt(port),
            secure: parseInt(port) === 465,
            auth: {
                user: user,
                pass: pass
            }
        });
        await transporter.verify();
        res.json({ message: 'Kết nối máy chủ SMTP thành công!' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi kết nối SMTP: ' + error.message });
    }
};


// Helper to retrieve Google OAuth configuration from Admin settings or env
async function getGoogleOAuthConfig() {
    try {
        const adminQuery = "SELECT settings FROM users WHERE (username = 'qtv' OR role = 'Admin') AND settings IS NOT NULL ORDER BY CASE WHEN username = 'qtv' THEN 1 ELSE 2 END LIMIT 1";
        const adminRes = await pool.query(adminQuery);
        let settings = {};
        if (adminRes.rows.length > 0 && adminRes.rows[0].settings) {
            settings = typeof adminRes.rows[0].settings === 'string' ? JSON.parse(adminRes.rows[0].settings) : adminRes.rows[0].settings;
        }
        return {
            enabled: settings.google_login_enabled === true || settings.google_login_enabled === 'true' || settings.google_login_enabled === '1',
            clientId: settings.google_client_id || process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: settings.google_client_secret || process.env.GOOGLE_CLIENT_SECRET || ''
        };
    } catch(e) {
        console.error('Error fetching Google config:', e);
        return { enabled: false, clientId: '', clientSecret: '' };
    }
}

exports.getGoogleConfig = async (req, res) => {
    try {
        const cfg = await getGoogleOAuthConfig();
        res.json({
            enabled: cfg.enabled && Boolean(cfg.clientId && cfg.clientSecret),
            clientId: cfg.clientId
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.googleAuthRedirect = async (req, res) => {
    try {
        const cfg = await getGoogleOAuthConfig();
        if (!cfg.enabled || !cfg.clientId || !cfg.clientSecret) {
            return res.redirect('/login?error=' + encodeURIComponent('Tính năng Đăng nhập bằng Google hiện chưa được cấu hình hoặc bị tắt bởi Quản trị viên.'));
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, redirectUri);
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            prompt: 'select_account'
        });

        res.redirect(authUrl);
    } catch (e) {
        console.error('Error initiating Google OAuth:', e);
        res.redirect('/login?error=' + encodeURIComponent('Lỗi khởi tạo đăng nhập Google: ' + e.message));
    }
};

exports.googleAuthCallback = async (req, res) => {
    try {
        const { code, error } = req.query;
        if (error) {
            return res.redirect('/login?error=' + encodeURIComponent('Hủy đăng nhập Google hoặc phát sinh lỗi: ' + error));
        }
        if (!code) {
            return res.redirect('/login?error=' + encodeURIComponent('Không nhận được mã xác thực từ Google.'));
        }

        const cfg = await getGoogleOAuthConfig();
        if (!cfg.enabled || !cfg.clientId || !cfg.clientSecret) {
            return res.redirect('/login?error=' + encodeURIComponent('Cấu hình Google OAuth chưa hợp lệ.'));
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, redirectUri);
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: profile } = await oauth2.userinfo.get();

        if (!profile || !profile.email) {
            return res.redirect('/login?error=' + encodeURIComponent('Không lấy được thông tin email từ tài khoản Google.'));
        }

        // Auto ensure google_id column exists
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);`).catch(() => {});

        // 1. Check if user already exists with matching google_id or email
        const userQuery = `SELECT * FROM users WHERE google_id = $1 OR LOWER(email) = LOWER($2) LIMIT 1`;
        const userRes = await pool.query(userQuery, [profile.id, profile.email]);
        const user = userRes.rows[0];

        if (user) {
            // User exists -> Update google_id and mark is_verified = true
            await pool.query(
                `UPDATE users SET google_id = $1, is_verified = true WHERE id = $2`,
                [profile.id, user.id]
            );

            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.redirect(`/login?google_token=${token}`);
        } else {
            // User does NOT exist in system
            const emailEnc = encodeURIComponent(profile.email || '');
            const nameEnc = encodeURIComponent(profile.name || '');
            return res.redirect(`/login?error=google_not_registered&email=${emailEnc}&name=${nameEnc}`);
        }
    } catch (e) {
        console.error('Error handling Google OAuth callback:', e);
        res.redirect('/login?error=' + encodeURIComponent('Lỗi xác thực Google: ' + e.message));
    }
};
