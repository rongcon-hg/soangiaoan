const fs = require('fs');
let txt = fs.readFileSync('views/settings.ejs', 'utf8');

// Replace the old testConnection
const oldTestConnection = `function testConnection() {
            showAlert('Tính năng Test kết nối đang được phát triển.', 'success');
        }`;

const newTestConnection = `async function testConnection() {
            // Find which tab is active
            const activePanel = document.querySelector('.s-panel.active').id;
            
            if (activePanel === 'panel-gdrive') {
                return testDriveConnection();
            }
            
            if (activePanel === 'panel-smtp') {
                const host = document.getElementById('cfg-smtp-host').value.trim();
                const port = document.getElementById('cfg-smtp-port').value.trim();
                const user = document.getElementById('cfg-smtp-user').value.trim();
                const pass = document.getElementById('cfg-smtp-pass').value.trim();
                
                if(!host || !port || !user || !pass) {
                    return showAlert('Vui lòng điền đủ Host, Port, User, Pass để test SMTP', 'error');
                }
                try {
                    showAlert('Đang kiểm tra kết nối SMTP...', 'success');
                    const res = await fetch(API_URL + '/auth/test-smtp', {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({ host, port, user, pass })
                    });
                    const data = await res.json();
                    if(!res.ok) throw new Error(data.error || data.message);
                    showAlert('✅ ' + data.message, 'success');
                } catch(e) {
                    showAlert('❌ ' + e.message, 'error');
                }
                return;
            }

            if (activePanel === 'panel-gemini') {
                const apiKey = document.getElementById('cfg-gemini-key').value.trim();
                if(!apiKey) return showAlert('Vui lòng nhập API Key để test', 'error');
                
                try {
                    showAlert('Đang kiểm tra Gemini API...', 'success');
                    const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models?key=\${apiKey}\`);
                    const data = await res.json();
                    if(data.error) throw new Error(data.error.message);
                    showAlert('✅ Kết nối Gemini API thành công!', 'success');
                } catch(e) {
                    showAlert('❌ Lỗi Gemini: ' + e.message, 'error');
                }
                return;
            }
        }`;

txt = txt.replace(oldTestConnection, newTestConnection);

fs.writeFileSync('views/settings.ejs', txt);
console.log('Patched testConnection in settings.ejs');
