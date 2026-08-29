const fs = require('fs');
let txt = fs.readFileSync('controllers/authController.js', 'utf8');

const oldCode = `        if (!user.is_verified) {
            return res.status(403).json({ message: 'Vui lòng xác thực mã OTP trước khi đăng nhập', requiresOtp: true, username: user.username });
        }`;

const newCode = `        if (!user.is_verified) {
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
        }`;

txt = txt.replace(oldCode, newCode);
fs.writeFileSync('controllers/authController.js', txt);
console.log('Patched authController.js');
