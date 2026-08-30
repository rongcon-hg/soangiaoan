const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Thiết lập View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Basic check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Import routes

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
});
app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/drive', require('./routes/drive'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Page routes
app.get('/login', (req, res) => res.render('login'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/settings', (req, res) => res.render('settings'));
app.get('/users', (req, res) => res.render('users'));
app.get('/app', (req, res) => res.render('app'));

// Route chính trả về index.html (Dashboard)
app.use((req, res) => {
    res.render('index');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

module.exports = app;
