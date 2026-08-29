const fs = require('fs');
let txt = fs.readFileSync('utils/drive.js', 'utf8');

const oldUrl = "'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable'";
const newUrl = "'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true'";

if (txt.includes(oldUrl)) {
    txt = txt.replace(oldUrl, newUrl);
    fs.writeFileSync('utils/drive.js', txt);
    console.log("Patched startResumableUpload to include supportsAllDrives=true");
} else {
    console.log("Could not find the URL to patch in utils/drive.js.");
}
