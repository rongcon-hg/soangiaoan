const pool = require("../config/database");

exports.getStats = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Lấy danh sách môn học của user
        const projectsRes = await pool.query(
            `SELECT id, name, course_code, total_hours, system_type, class_name, program_data, created_at 
             FROM projects 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        );
        const projects = projectsRes.rows;

        // 2. Thống kê tổng số môn học và tổng giờ giảng dạy
        const totalProjects = projects.length;
        const totalHours = projects.reduce((acc, p) => acc + (parseInt(p.total_hours) || 0), 0);

        // 3. Phân bổ theo hệ đào tạo (Cao đẳng vs Trung cấp)
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

        // 4. Lấy danh sách project_id có Sổ đầu bài từ bảng schedules
        const projectIds = projects.map(p => p.id);
        const projectStatsMap = {};
        if (projectIds.length > 0) {
            const schedRows = await pool.query(
                `SELECT project_id FROM schedules WHERE project_id = ANY($1::int[]) AND schedule_data IS NOT NULL AND schedule_data != '' AND schedule_data != 'null' AND schedule_data != '[]'`,
                [projectIds]
            );
            const lessonCounts = await pool.query(
                `SELECT project_id, COUNT(id) as count FROM lessons WHERE project_id = ANY($1::int[]) AND lesson_data IS NOT NULL AND lesson_data != '' GROUP BY project_id`,
                [projectIds]
            );
            schedRows.rows.forEach(r => {
                if (!projectStatsMap[r.project_id]) projectStatsMap[r.project_id] = {};
                projectStatsMap[r.project_id].hasSchedule = true;
            });
            lessonCounts.rows.forEach(r => {
                if (!projectStatsMap[r.project_id]) projectStatsMap[r.project_id] = {};
                projectStatsMap[r.project_id].lessonCount = parseInt(r.count) || 0;
            });
        }

        // Kiểm tra thêm generatedSchedule trong program_data của từng môn
        let totalSchedules = 0;
        projects.forEach(p => {
            let hasSched = Boolean(projectStatsMap[p.id]?.hasSchedule);
            if (!hasSched && p.program_data) {
                try {
                    const pdata = typeof p.program_data === 'string' ? JSON.parse(p.program_data) : p.program_data;
                    if (pdata && Array.isArray(pdata.generatedSchedule) && pdata.generatedSchedule.length > 0) {
                        hasSched = true;
                        if (!projectStatsMap[p.id]) projectStatsMap[p.id] = {};
                        projectStatsMap[p.id].hasSchedule = true;
                    }
                } catch(e) {}
            }
            if (hasSched) totalSchedules++;
        });

        // 5. Thống kê tổng số giáo án từng môn đã được lưu trữ vào CSDL
        const lessonsRes = await pool.query(
            `SELECT COUNT(l.id) as total_lessons 
             FROM lessons l 
             JOIN projects p ON l.project_id = p.id 
             WHERE p.user_id = $1 AND l.lesson_data IS NOT NULL AND l.lesson_data != ''`,
            [userId]
        );
        const totalLessons = parseInt(lessonsRes.rows[0]?.total_lessons || 0);

        // 6. Lấy trạng thái user (API Key, Chữ ký)
        const userRes = await pool.query(
            `SELECT username, full_name, role, gemini_api_key, signature, signature_filename, department, department_id, expires_at, tokens_used 
             FROM users 
             WHERE id = $1`,
            [userId]
        );
        const user = userRes.rows[0] || {};

        // 7. Thống kê Admin toàn hệ thống (nếu là Admin)
        let systemStats = null;
        if (userRole === "Admin" || userRole === "Manager") {
            const allUsersCount = await pool.query(`SELECT COUNT(*) as c FROM users`);
            const allProjectsCount = await pool.query(`SELECT COUNT(*) as c FROM projects`);
            const allSchedulesCount = await pool.query(`SELECT COUNT(*) as c FROM schedules`);
            const allLessonsCount = await pool.query(`SELECT COUNT(*) as c FROM lessons`);
            
            // Bổ sung dữ liệu cho biểu đồ Admin (6 tháng gần nhất)
            const monthlyStatsRes = await pool.query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count 
                FROM projects 
                WHERE created_at >= CURRENT_DATE - INTERVAL '5 months' 
                GROUP BY month ORDER BY month ASC
            `);
            
            // --- THỐNG KÊ CHI TIẾT PHASE 2 ---
            const statusCountsRes = await pool.query(`SELECT status, COUNT(*) as count FROM lessons WHERE lesson_data IS NOT NULL AND lesson_data != '' GROUP BY status`);
            const statusCounts = { DRAFT: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };
            statusCountsRes.rows.forEach(r => {
                const st = r.status || 'DRAFT';
                if (statusCounts[st] !== undefined) statusCounts[st] = parseInt(r.count);
                else statusCounts[st] = parseInt(r.count);
            });
            
            let topContributorsRes;
            if (userRole === "Manager" && user.department_id) {
                topContributorsRes = await pool.query(`
                    SELECT u.full_name, u.username, d.name as department_name, COUNT(l.id) as approved_count
                    FROM lessons l
                    JOIN projects p ON l.project_id = p.id
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN departments d ON u.department_id = d.id
                    WHERE l.status = 'APPROVED' AND u.department_id = $1
                    GROUP BY u.id, d.name
                    ORDER BY approved_count DESC
                    LIMIT 5
                `, [user.department_id]);
            } else {
                topContributorsRes = await pool.query(`
                    SELECT u.full_name, u.username, d.name as department_name, COUNT(l.id) as approved_count
                    FROM lessons l
                    JOIN projects p ON l.project_id = p.id
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN departments d ON u.department_id = d.id
                    WHERE l.status = 'APPROVED'
                    GROUP BY u.id, d.name
                    ORDER BY approved_count DESC
                    LIMIT 5
                `);
            }

            systemStats = {
                monthlyStats: {
                    labels: monthlyStatsRes.rows.map(r => r.month),
                    data: monthlyStatsRes.rows.map(r => parseInt(r.count))
                },
                statusCounts,
                topContributors: topContributorsRes.rows,
                totalUsers: parseInt(allUsersCount.rows[0]?.c || 0),
                totalProjects: parseInt(allProjectsCount.rows[0]?.c || 0),
                totalSchedules: parseInt(allSchedulesCount.rows[0]?.c || 0),
                totalLessons: parseInt(allLessonsCount.rows[0]?.c || 0)
            };
        }

        // 8. Dữ liệu biểu đồ phân bổ giờ theo từng môn học (Top 7 môn nhiều giờ nhất)
        const topProjectsByHours = [...projects]
            .sort((a, b) => (parseInt(b.total_hours) || 0) - (parseInt(a.total_hours) || 0))
            .slice(0, 7)
            .map(p => ({
                name: p.name,
                course_code: p.course_code || "",
                total_hours: parseInt(p.total_hours) || 0,
                class_name: p.class_name || ""
            }));

        // 9. Danh sách 5 môn học gần đây nhất kèm trạng thái
        const recentProjects = projects.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            course_code: p.course_code || "",
            total_hours: p.total_hours || 0,
            system_type: p.system_type || "Trung cấp",
            class_name: p.class_name || "",
            hasSchedule: Boolean(projectStatsMap[p.id]?.hasSchedule),
            savedLessonsCount: projectStatsMap[p.id]?.lessonCount || 0
        }));

        res.json({
            user: {
                username: user.username,
                full_name: user.full_name || user.username,
                department: user.department || "Chưa cập nhật",
                role: user.role,
                hasGeminiKey: Boolean(user.gemini_api_key && user.gemini_api_key.trim()),
                hasSignature: Boolean(user.signature),
                expires_at: user.expires_at,
                tokens_used: parseInt(user.tokens_used) || 0
            },
            adminStats: systemStats,
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
