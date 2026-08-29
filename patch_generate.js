const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldGenerate = `  $("#btnGenerate").onclick=()=>{
    buildPaper();
    runTimeCheck();
  };`;

const newGenerate = `  $("#btnGenerate").onclick=()=>{
    const status = document.getElementById("timeStatus");
    if(status) {
        status.className = "status warn";
        status.innerHTML = "⏳ <b>Đang biên soạn giáo án, vui lòng chờ...</b>";
    }
    
    // Add a small delay so the browser can render the loading status
    setTimeout(() => {
        buildPaper();
        runTimeCheck();
        if(status) {
            status.className = "status ok";
            status.innerHTML = "✅ <b>Đã biên soạn xong!</b>";
        }
    }, 150);
  };`;

if (txt.includes(oldGenerate)) {
    txt = txt.replace(oldGenerate, newGenerate);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Patched btnGenerate");
} else {
    // maybe formatted differently
    console.log("Not exactly matched");
}
