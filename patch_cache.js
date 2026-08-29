const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
code = code.replace("app.use(express.static(path.join(__dirname, 'public')));", "app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));");
fs.writeFileSync('server.js', code);
console.log('Static caching applied.');
