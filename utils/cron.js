const pool = require('../config/database');
const backupUtil = require('./backup');

function initCron() {
    console.log("Khởi tạo dịch vụ Auto Backup...");
    
    setInterval(async () => {
        const now = new Date();
        // Chỉ kiểm tra vào phút 0 của mỗi giờ để tránh spam (và phù hợp với 0 0 * * *)
        if (now.getMinutes() !== 0) return;

        try {
            const adminRes = await pool.query("SELECT settings FROM users WHERE role = 'Admin' LIMIT 1");
            if (!adminRes.rows.length) return;

            const settings = adminRes.rows[0].settings || {};
            if (!settings.backup_enabled) return;

            const cronPattern = settings.backup_cron || '0 0 * * *';
            const hour = now.getHours();
            const date = now.getDate();
            const day = now.getDay();

            let shouldRun = false;
            
            // Hàng ngày (0 0 * * *) -> Chạy lúc 00:00
            if (cronPattern === '0 0 * * *' && hour === 0) {
                shouldRun = true;
            }
            // Hàng tuần (0 0 * * 0) -> Chạy lúc 00:00 Chủ Nhật
            else if (cronPattern === '0 0 * * 0' && hour === 0 && day === 0) {
                shouldRun = true;
            }
            // Hàng tháng (0 0 1 * *) -> Chạy lúc 00:00 ngày 1
            else if (cronPattern === '0 0 1 * *' && hour === 0 && date === 1) {
                shouldRun = true;
            }

            if (shouldRun) {
                console.log("Bắt đầu chạy Auto Backup...");
                await backupUtil.runBackup(settings);
                console.log("Auto Backup hoàn tất!");
            }
        } catch (error) {
            console.error("Lỗi khi chạy Auto Backup:", error.message);
        }
    }, 60 * 1000); // Check mỗi phút
}

module.exports = initCron;
