const ejs = require('ejs');
const path = require('path');
const pool = require('../config/database');

// Hàm lấy cấu hình SMTP từ admin
async function getSmtpConfig() {
    const adminQuery = `SELECT settings FROM users WHERE role = 'Admin' LIMIT 1`;
    const res = await pool.query(adminQuery);
    const settings = res.rows[0]?.settings || {};

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
        throw new Error('SMTP chưa được cấu hình bởi Admin');
    }

    return {
        host: settings.smtp_host,
        port: parseInt(settings.smtp_port) || 465,
        secure: parseInt(settings.smtp_port) === 465, // true for 465, false for other ports
        auth: {
            user: settings.smtp_user,
            pass: settings.smtp_pass
        },
        senderName: settings.smtp_name || 'Hệ thống Giáo án'
    };
}

// Hàm gửi email chung
exports.sendMail = async (to, subject, templateName, templateData) => {
    try {
        const config = await getSmtpConfig();
        
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth
        });

        // Render EJS template thành HTML
        const templatePath = path.join(__dirname, '..', 'views', 'emails', `${templateName}.ejs`);
        const htmlContent = await ejs.renderFile(templatePath, templateData);

        const mailOptions = {
            from: `"${config.senderName}" <${config.auth.user}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
