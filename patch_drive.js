const fs = require('fs');
let txt = fs.readFileSync('utils/drive.js', 'utf8');

const oldSyntax = `const auth = new google.auth.JWT(
            email,
            null,
            formattedKey,
            ['https://www.googleapis.com/auth/drive']
        );`;

const newSyntax = `const auth = new google.auth.JWT({
            email: email,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/drive']
        });`;

// Có 2 chỗ: 1 ở uploadToDrive, 1 ở testConnection
txt = txt.split(oldSyntax).join(newSyntax);

fs.writeFileSync('utils/drive.js', txt);
console.log('Fixed JWT constructor', txt.indexOf(newSyntax) > -1);
