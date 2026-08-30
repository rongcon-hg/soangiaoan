const pool = require("../config/database");

exports.getStats = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Lay danh sach mon hoc cua user
        const projectsRes = await pool.query(
            `SELECT id, name, course_code, total_hours, system_type, class_name, created_at 
             FROM projects 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        );
        const projects = projectsRes.rows;

        // 2. Thong ke tong so mon hoc va tong gio giang day
        const totalProjects = projects.length;
        const totalHours = projects.reduce((acc, p) => acc + (parseInt(p.total_hours) || 0), 0);

        // 3. Phan bo theo he dao tao (Cao dang vs Trung cap)
        let cdCount = 0;
        let tcCount = 0;
        let cdHours = 0;
        let tcHours = 0;

        projects.forEach(p => {
            const h = parseInt(p.total_hours) || 0;
            if (p.system_type === "Cao đẳng") {
                cdCount++;
                cdHours += h;
            } else {
                tcCount++;
                tcHours += h;
            }
        });

        // 4. Thong ke so luong So dau bai da tao
        const schedulesRes = await pool.query(
            `SELECT COUNT(DISTINCT s.project_id) as total_schedules 
             FROM schedules s 
             JOIN projects p ON s.project_id = p.id 
             WHERE p.user_id = $1`,
            [userId]
        );
        const totalSchedules = parseInt(schedulesRes.rows[0]?.total_schedules || 0);

        // 5. Thong ke tong so giao an buoi hoc (lessons) da soan
        const lessonsRes = await pool.query(
            `SELECT COUNT(l.id) as total_lessons 
             FROM lessons l 
             JOIN projects p ON l.project_id = p.id 
             WHERE p.user_id = $1`,
            [userId]
        );
        const totalLessons = parseInt(lessonsRes.rows[0]?.total_lessons || 0);

        // 6. Lay trang thai user (API Key, Chu ky)
        const userRes = await pool.query(
            `SELECT username, full_name, role, gemini_api_key, signature, signature_filename, department 
             FROM users 
             WHERE id = $1`,
            [userId]
        );
        const user = userRes.rows[0] || {};

        // 7. Thong ke Admin toan he thong (neu la Admin)
        let systemStats = null;
        if (userRole === "Admin") {
            const allUsersCount = await pool.query(`SELECT COUNT(*) as c FROM users`);
            const allProjectsCount = await pool.query(`SELECT COUNT(*) as c FROM projects`);
            const allLessonsCount = await pool.query(`SELECT COUNT(*) as c FROM lessons`);
            systemStats = {
                totalUsers: parseInt(allUsersCount.rows[0]?.c || 0),
                totalProjects: parseInt(allProjectsCount.rows[0]?.c || 0),
                totalLessons: parseInt(allLessonsCount.rows[0]?.c || 0)
            };
        }

        // 8. Du lieu bieu do phan bo gio theo tung mon hoc (Top 7 mon nhieu gio nhat)
        const topProjectsByHours = [...projects]
            .sort((a, b) => (parseInt(b.total_hours) || 0) - (parseInt(a.total_hours) || 0))
            .slice(0, 7)
            .map(p => ({
                name: p.name,
                course_code: p.course_code || "",
                total_hours: parseInt(p.total_hours) || 0,
                class_name: p.class_name || ""
            }));

        // 9. Danh sach 5 mon hoc gan day nhat
        const recentProjects = projects.slice(0, 5);

        res.json({
            user: {
                username: user.username,
                full_name: user.full_name || user.username,
                department: user.department || "Chưa cập nhật",
                role: user.role,
                hasGeminiKey: Boolean(user.gemini_api_key && user.gemini_api_key.trim()),
                hasSignature: Boolean(user.signature)
            },
            stats: {
                totalProjects,
                totalHours,
                totalSchedules,
                totalLessons,
                cdCount,
                tcCount,
                cdHours,
                tcHours
            },
            charts: {
                topProjectsByHours,
                systemDistribution: {
                    labels: ["Cao đẳng", "Trung cấp"],
                    counts: [cdCount, tcCount],
                    hours: [cdHours, tcHours]
                }
            },
            recentProjects,
            systemStats
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ error: error.message });
    }
};
