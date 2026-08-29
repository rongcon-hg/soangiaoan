const fs = require('fs');

// Update server.js
let serverCode = fs.readFileSync('server.js', 'utf8');
if (!serverCode.includes('compression')) {
    serverCode = serverCode.replace("const helmet = require('helmet');", "const helmet = require('helmet');\nconst compression = require('compression');\nconst rateLimit = require('express-rate-limit');");
    
    const limiterCode = `
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
});
app.use('/api/auth', authLimiter);
`;
    serverCode = serverCode.replace("app.use(helmet({ contentSecurityPolicy: false }));", "app.use(helmet({ contentSecurityPolicy: false }));\napp.use(compression());");
    serverCode = serverCode.replace("app.use('/api/auth', require('./routes/auth'));", limiterCode + "\napp.use('/api/auth', require('./routes/auth'));");
    
    fs.writeFileSync('server.js', serverCode, 'utf8');
}
console.log("Server optimization applied.");
