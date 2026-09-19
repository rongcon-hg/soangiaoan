const fs = require('fs');

let content = fs.readFileSync('views/app.ejs', 'utf-8');

const targetStr = '&lt;h2&gt;Xem trước và chỉnh sửa trực tiếp &lt;span class=&quot;pill&quot;&gt;A4 dọc · 210 × 297 mm&lt;/span&gt;&lt;/h2&gt;';
const replaceStr = '&lt;h2 class=&quot;no-print&quot;&gt;Xem trước và chỉnh sửa trực tiếp &lt;span class=&quot;pill&quot;&gt;A4 dọc · 210 × 297 mm&lt;/span&gt;&lt;/h2&gt;';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('views/app.ejs', content);
    console.log("Successfully added no-print to h2!");
} else {
    console.log("Could not find the target string.");
}
