const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldBtn = `<button class="secondary" onclick="document.getElementById('step1').scrollIntoView({behavior:'smooth'})">↑ Quay lại Sổ đầu bài</button>`;
const newBtn = `<button class="secondary" onclick="switchTab(1)">← Quay lại Sổ đầu bài</button>`;

txt = txt.replace(oldBtn, newBtn);
fs.writeFileSync('views/app.ejs', txt);
console.log("Updated back button to use switchTab!");
