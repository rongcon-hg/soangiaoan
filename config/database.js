const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
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
                settings JSONB DEFAULT '{}'
            )
        `);

        // Đảm bảo cột role tồn tại (cho các database đã tạo)
        try {
            await client.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'User'`);
        } catch (e) {
            // Cột đã tồn tại, bỏ qua lỗi
        }

        // Tạo tài khoản superadmin mặc định
        const bcrypt = require('bcrypt');
        const adminPass = await bcrypt.hash('Nsg@2026', 10);
        await client.query(`
            INSERT INTO users (username, password, role) 
            VALUES ('qtv', $1, 'Admin') 
            ON CONFLICT (username) DO NOTHING
        `, [adminPass]);

        // Tạo bảng projects
        await client.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                course_code VARCHAR(100),
                total_hours INTEGER,
                program_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
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

initDb();

module.exports = pool;
