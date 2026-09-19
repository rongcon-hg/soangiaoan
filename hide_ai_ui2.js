const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Hide the Model dropdown (row2)
content = content.replace(
    /&lt;div class=&quot;row2&quot;&gt;/,
    '&lt;div class=&quot;row2&quot; style=&quot;display:none&quot;&gt;'
);

// Hide the buttons
content = content.replace(
    /&lt;button class=&quot;btn&quot; id=&quot;btnSaveAI&quot;&gt;Lưu cài đặt AI&lt;\/button&gt;\s*&lt;button class=&quot;btn&quot; id=&quot;btnTestAI&quot;&gt;Kiểm tra kết nối Gemini&lt;\/button&gt;\s*&lt;button class=&quot;btn&quot; id=&quot;btnRefreshModels&quot;&gt;Tải danh sách model&lt;\/button&gt;/,
    '&lt;button class=&quot;btn&quot; id=&quot;btnSaveAI&quot; style=&quot;display:none&quot;&gt;Lưu cài đặt AI&lt;/button&gt;\n            &lt;button class=&quot;btn&quot; id=&quot;btnTestAI&quot; style=&quot;display:none&quot;&gt;Kiểm tra kết nối Gemini&lt;/button&gt;\n            &lt;button class=&quot;btn&quot; id=&quot;btnRefreshModels&quot; style=&quot;display:none&quot;&gt;Tải danh sách model&lt;/button&gt;'
);

// Rename section header
content = content.replace(
    /&lt;h2&gt;3\. Cài đặt AI&lt;\/h2&gt;/,
    '&lt;h2&gt;3. Trợ lý AI (Gemini)&lt;/h2&gt;'
);

fs.writeFileSync('views/app.ejs', content);
console.log("Hidden unnecessary AI buttons and dropdown");
