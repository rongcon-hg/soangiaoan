const fs = require('fs');
let txt = fs.readFileSync('controllers/authController.js', 'utf8');

const smtpTest = `
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
`;

txt = txt + '\n' + smtpTest;
fs.writeFileSync('controllers/authController.js', txt);
console.log('Added testSmtpConnection');
