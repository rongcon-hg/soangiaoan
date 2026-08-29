const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

// Hide API Key
const apiKeyLabel = '<label>Google/Gemini API Key</label>';
const apiKeyInput = '<input id="apiKey" type="password" placeholder="AIza... hoặc API key từ Google AI Studio">';
txt = txt.replace(apiKeyLabel, '<label style="display:none">Google/Gemini API Key</label>');
txt = txt.replace(apiKeyInput, '<input style="display:none" id="apiKey" type="password" placeholder="AIza... hoặc API key từ Google AI Studio">');

// Hide Save Key dropdown
const saveKeyHtml = `<div>
              <label>Lưu khóa trên máy</label>
              <select id="saveKey">
                <option value="yes" selected>Có</option>
                <option value="no">Không</option>
              </select>
            </div>`;

if(txt.includes(saveKeyHtml)) {
    txt = txt.replace(saveKeyHtml, `<div style="display:none">
              <label>Lưu khóa trên máy</label>
              <select id="saveKey">
                <option value="yes" selected>Có</option>
                <option value="no">Không</option>
              </select>
            </div>`);
} else {
    // try replacing with &quot;
    const saveKeyHtmlEscaped = `&lt;div&gt;
              &lt;label&gt;Lưu khóa trên máy&lt;/label&gt;
              &lt;select id=&quot;saveKey&quot;&gt;
                &lt;option value=&quot;yes&quot; selected&gt;Có&lt;/option&gt;
                &lt;option value=&quot;no&quot;&gt;Không&lt;/option&gt;
              &lt;/select&gt;
            &lt;/div&gt;`;
    if(txt.includes(saveKeyHtmlEscaped)) {
        txt = txt.replace(saveKeyHtmlEscaped, `&lt;div style=&quot;display:none&quot;&gt;
              &lt;label&gt;Lưu khóa trên máy&lt;/label&gt;
              &lt;select id=&quot;saveKey&quot;&gt;
                &lt;option value=&quot;yes&quot; selected&gt;Có&lt;/option&gt;
                &lt;option value=&quot;no&quot;&gt;Không&lt;/option&gt;
              &lt;/select&gt;
            &lt;/div&gt;`);
    } else {
        console.log("Could not find saveKey section to hide.");
    }
}

// Similarly, the API key label and input are escaped!
const apiKeyLabelEscaped = '&lt;label&gt;Google/Gemini API Key&lt;/label&gt;';
const apiKeyInputEscaped = '&lt;input id=&quot;apiKey&quot; type=&quot;password&quot; placeholder=&quot;AIza... hoặc API key từ Google AI Studio&quot;&gt;';
txt = txt.replace(apiKeyLabelEscaped, '&lt;label style=&quot;display:none&quot;&gt;Google/Gemini API Key&lt;/label&gt;');
txt = txt.replace(apiKeyInputEscaped, '&lt;input style=&quot;display:none&quot; id=&quot;apiKey&quot; type=&quot;password&quot; placeholder=&quot;AIza... hoặc API key từ Google AI Studio&quot;&gt;');

fs.writeFileSync('views/app.ejs', txt);
console.log("Hidden API key and Save key inputs!");
