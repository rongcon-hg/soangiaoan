const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Hide the Model dropdown
content = content.replace(
    /<div class="row2">/,
    '<div class="row2" style="display:none;">'
);

// Hide the three utility buttons
content = content.replace(
    /<button class="btn" id="btnSaveAI">Lưu cài đặt AI<\/button>\s*<button class="btn" id="btnTestAI">Kiểm tra kết nối Gemini<\/button>\s*<button class="btn" id="btnRefreshModels">Tải danh sách model<\/button>/,
    '<button class="btn" id="btnSaveAI" style="display:none;">Lưu cài đặt AI</button>\n            <button class="btn" id="btnTestAI" style="display:none;">Kiểm tra kết nối Gemini</button>\n            <button class="btn" id="btnRefreshModels" style="display:none;">Tải danh sách model</button>'
);

// Optional: Rename "3. Cài đặt AI" to "3. Trợ lý AI (Gemini)" to reflect its new streamlined purpose
content = content.replace(
    /<h2>3\. Cài đặt AI<\/h2>/,
    '<h2>3. Trợ lý AI (Gemini)</h2>'
);

fs.writeFileSync('views/app.ejs', content);
console.log("Hidden unnecessary AI buttons and dropdown");
