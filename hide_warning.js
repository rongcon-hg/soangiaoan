const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const regexWarning = /(&lt;p.*?&gt;Gemini API key được dùng trực tiếp từ trình duyệt.*?&lt;\/p&gt;)/;
txt = txt.replace(regexWarning, '&lt;p style=&quot;display:none&quot;&gt;Gemini API key được dùng trực tiếp từ trình duyệt...&lt;/p&gt;');

// also without <p> if it's not a p tag
const regexWarning2 = /Gemini API key được dùng trực tiếp từ trình duyệt theo yêu cầu của người dùng\. Cách này tiện nhưng không an toàn nếu chia sẻ file hoặc máy\./;
txt = txt.replace(regexWarning2, '<span style="display:none">Gemini API key được dùng trực tiếp từ trình duyệt theo yêu cầu của người dùng. Cách này tiện nhưng không an toàn nếu chia sẻ file hoặc máy.</span>');

fs.writeFileSync('views/app.ejs', txt);
console.log("Hidden warning text!");
