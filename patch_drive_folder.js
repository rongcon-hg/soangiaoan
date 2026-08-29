const fs = require('fs');
let txt = fs.readFileSync('utils/drive.js', 'utf8');

txt = txt.replace(
    'exports.uploadToDrive = async (email, key, folderId, fileBuffer, fileName, mimeType) => {',
    'exports.uploadToDrive = async (email, key, folderId, fileBuffer, fileName, mimeType, subFolderName) => {'
);
txt = txt.replace(
    'const folderName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, \'0\')}`;',
    'const folderName = subFolderName || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, \'0\')}`;'
);

fs.writeFileSync('utils/drive.js', txt);

let routeTxt = fs.readFileSync('routes/drive.js', 'utf8');
routeTxt = routeTxt.replace(
    'req.file.mimetype',
    'req.file.mimetype,\n            req.user.username'
);
fs.writeFileSync('routes/drive.js', routeTxt);
console.log('Patched uploadToDrive to use username subfolder');
