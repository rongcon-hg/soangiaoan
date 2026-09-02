const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// Hàm khởi tạo các bảng
const initDb = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the PostgreSQL database.');

        // Tạo bảng users
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'User',
                gemini_api_key TEXT,
                full_name VARCHAR(255),
                department VARCHAR(255),
                phone VARCHAR(20),
                email VARCHAR(255),
                avatar TEXT,
                settings JSONB DEFAULT '{}',
                is_verified BOOLEAN DEFAULT false,
                otp_code VARCHAR(10),
                otp_expires TIMESTAMP
            )
        `);

        // Đảm bảo các cột bổ sung tồn tại (cho các database đã tạo)
        try {
            await client.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'User',
                ADD COLUMN IF NOT EXISTS signature TEXT,
                ADD COLUMN IF NOT EXISTS signature_filename TEXT,
                ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
                ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
            `);
            // Cập nhật tài khoản Admin là vô thời hạn và người dùng mặc định 3 tháng nếu chưa có
            await client.query(`
                UPDATE users SET expires_at = '2099-12-31 23:59:59' WHERE role = 'Admin' AND (expires_at IS NULL OR expires_at < '2090-01-01');
                UPDATE users SET expires_at = CURRENT_TIMESTAMP + INTERVAL '1 month' WHERE role != 'Admin' AND expires_at IS NULL;
            `);
        } catch (e) {
            // Bỏ qua lỗi
        }

        // Tạo tài khoản superadmin mặc định
        const bcrypt = require('bcryptjs');
        const adminPass = await bcrypt.hash('Nsg@2026', 10);
        await client.query(`
            INSERT INTO users (username, password, role, is_verified) 
            VALUES ($1, $2, 'Admin', true) 
            ON CONFLICT (username) DO NOTHING
        `, ['qtv', adminPass]);

        // Tạo bảng projects
        await client.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                course_code VARCHAR(100),
                total_hours INTEGER,
                system_type VARCHAR(50) DEFAULT 'Trung cấp',
                class_name VARCHAR(100),
                program_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration nếu thiếu cột cho projects
        await client.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS system_type VARCHAR(50) DEFAULT 'Trung cấp',
            ADD COLUMN IF NOT EXISTS class_name VARCHAR(100);
        `);

        // Tạo bảng schedules
        await client.query(`
            CREATE TABLE IF NOT EXISTS schedules (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                schedule_data TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo bảng departments (V2)
        await client.query(`
            CREATE TABLE IF NOT EXISTS departments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo bảng notifications (V2)
        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT false,
                link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo bảng templates (V2)
        await client.query(`
            CREATE TABLE IF NOT EXISTS templates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo bảng lessons
        await client.query(`
            CREATE TABLE IF NOT EXISTS lessons (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                schedule_tt INTEGER NOT NULL,
                lesson_data TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(project_id, schedule_tt)
            )
        `);

        client.release();
    } catch (err) {
        console.error('Error initializing database tables:', err);
    }
};

// Auto migrate columns safely
let migrated = false;
pool.on('connect', async (client) => {
    // Disabled auto migration on connect to save Vercel Serverless CPU
    if (false) {
        migrated = true;
        try {
            await client.query(`

                CREATE TABLE IF NOT EXISTS departments (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    message TEXT NOT NULL,
                    type VARCHAR(50) DEFAULT 'info',
                    is_read BOOLEAN DEFAULT false,
                    link TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS templates (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'User',
                ADD COLUMN IF NOT EXISTS signature TEXT,
                ADD COLUMN IF NOT EXISTS signature_filename TEXT,
                ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL;

                ALTER TABLE projects 
                ADD COLUMN IF NOT EXISTS system_type VARCHAR(50) DEFAULT 'Trung cấp',
                ADD COLUMN IF NOT EXISTS class_name VARCHAR(100);
                
                ALTER TABLE lessons 
                ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT',
                ADD COLUMN IF NOT EXISTS reviewer_comment TEXT,
                ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS pdf_link TEXT;
            `);
        } catch(e) {
            console.error('Auto migration warning:', e.message);
        }
    }
});


let auditMigrated = false;
pool.on('connect', async (client) => {
    if (!auditMigrated) {
        auditMigrated = true;
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                    action VARCHAR(255) NOT NULL,
                    target_type VARCHAR(50),
                    target_id INTEGER,
                    details JSONB,
                    ip_address VARCHAR(45),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
        } catch(e) {
            console.error('Audit migration warning:', e.message);
        }
    }
});

module.exports = pool;
