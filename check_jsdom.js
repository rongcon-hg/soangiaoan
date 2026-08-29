const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const script = fs.readFileSync('debug_script.js', 'utf8');

const html = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="fileStatus">Chưa chọn file. Demo đang dùng sẵn dữ liệu —.</div>
  <input type="file" id="programFile" onchange="readProgramFile(this.files[0])">
  <div id="startDate"></div>
  <div id="slotCount"></div>
  <div id="tbody"></div>
  <div id="weeklyCount"></div>
  <div id="conversionPreview"></div>
  <div id="excludeStartDate"></div>
  <div id="excludeEndDate"></div>
  <div id="excludeReason"></div>
  <script>${script}</script>
</body>
</html>
`;

const dom = new JSDOM(html, { runScripts: "dangerously" });
console.log("JSDOM initialized without crashing!");
