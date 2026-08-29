const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const txt = fs.readFileSync('live.html', 'utf8');

const matches = txt.match(/<iframe id="scheduleFrame"[^>]*srcdoc="([\s\S]*?)"><\/iframe>/);
if (matches) {
    let srcdoc = matches[1];
    let scriptMatch = srcdoc.match(/&lt;script&gt;([\s\S]*?)&lt;\/script&gt;/);
    if (scriptMatch) {
        let script = scriptMatch[1];
        script = script.replace(/&quot;/g, '"')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&amp;/g, '&')
                       .replace(/&#x27;/g, "'")
                       .replace(/&#39;/g, "'");

        const html = `
        <!DOCTYPE html>
        <html>
        <head></head>
        <body>
          <div id="fileStatus">Chưa chọn file. Demo đang dùng sẵn dữ liệu —.</div>
          <input type="file" id="programFile" onchange="readProgramFile(this.files[0])">
          <div id="courseName"></div>
          <div id="courseCode"></div>
          <div id="totalHours"></div>
          <div id="converted"></div>
          <div id="convertedBreakdown"></div>
          <div id="formulaInfo"></div>
          <div id="startDate"></div>
          <div id="slotCount"></div>
          <div id="tbody"></div>
          <div id="weeklyCount"></div>
          <div id="conversionPreview"></div>
          <div id="excludeStartDate"></div>
          <div id="excludeEndDate"></div>
          <div id="excludeReason"></div>
          <div id="weeklySlots"></div>
          <div id="exclusionList"></div>
          <div id="weeklyCheck"></div>
          <script>${script}</script>
        </body>
        </html>
        `;

        const dom = new JSDOM(html, { runScripts: "dangerously" });
        console.log("JSDOM initialized without crashing!");
    }
}
