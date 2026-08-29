const fs = require('fs');
let txt = fs.readFileSync('routes/drive.js', 'utf8');

// Change express.raw to always parse, regardless of Content-Type
const rawMiddlewareStr = "express.raw({ type: '*/*', limit: '4mb' })";
const newRawMiddlewareStr = "express.raw({ type: () => true, limit: '4mb' })";

if (txt.includes(rawMiddlewareStr)) {
    txt = txt.replace(rawMiddlewareStr, newRawMiddlewareStr);
}

// Safely handle req.body
const oldBodyLength = "'Content-Length': req.body.length";
const newBodyLength = "'Content-Length': (req.body ? req.body.length : 0)";

if (txt.includes(oldBodyLength)) {
    txt = txt.replace(oldBodyLength, newBodyLength);
}

// Ensure body is passed to fetch properly
const oldBodyPass = "body: req.body\n        });";
const newBodyPass = "body: req.body || Buffer.alloc(0)\n        });";

if (txt.includes(oldBodyPass)) {
    txt = txt.replace(oldBodyPass, newBodyPass);
}

fs.writeFileSync('routes/drive.js', txt);
console.log("Patched express.raw and req.body logic in routes/drive.js");
