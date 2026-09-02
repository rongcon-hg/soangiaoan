const pool = require('../config/database');

const auditLog = (action, getTargetInfo = (req) => ({})) => {
    return async (req, res, next) => {
        // We log after the response is sent to capture success/failure
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const userId = req.user ? req.user.id : null;
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    const { targetType = null, targetId = null, details = {} } = getTargetInfo(req);
                    
                    await pool.query(
                        `INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address) 
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [userId, action, targetType, targetId, JSON.stringify(details), ipAddress]
                    );
                } catch (error) {
                    console.error('Error saving audit log:', error.message);
                }
            }
        });
        next();
    };
};

module.exports = auditLog;
