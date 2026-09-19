const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

const targetStr = '&lt;input style=&quot;display:none&quot; id=&quot;apiKey&quot; type=&quot;password&quot; placeholder=&quot;AIza... hoặc API key từ Google AI Studio&quot;&gt;\n          &lt;div class=&quot;row2&quot;&gt;';
const replaceStr = '&lt;input style=&quot;display:none&quot; id=&quot;apiKey&quot; type=&quot;password&quot; placeholder=&quot;AIza... hoặc API key từ Google AI Studio&quot;&gt;\n          &lt;div class=&quot;row2&quot; style=&quot;display:none&quot;&gt;';

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('views/app.ejs', content);
console.log("Hidden row2 successfully");
