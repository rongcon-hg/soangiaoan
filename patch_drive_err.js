const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const errRegex = /(status\.innerHTML = oldHtml \+ &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive\.<\/b><\/span>&quot;;)/;
if (errRegex.test(txt)) {
    txt = txt.replace(errRegex, `status.innerHTML = oldHtml + &quot;<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> &quot; + (err.message || err.toString() || 'Lỗi không xác định') + &quot;</span>&quot;;`);
} else {
    // Maybe not encoded
    const errRegex2 = /(status\.innerHTML = oldHtml \+ "<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive\.<\/b><\/span>";)/;
    if(errRegex2.test(txt)) {
        txt = txt.replace(errRegex2, `status.innerHTML = oldHtml + "<br><span style='color:#b45309;'>❌ <b>Lỗi khi đẩy file lên Google Drive:</b> " + (err.message || err.toString() || 'Lỗi không xác định') + "</span>";`);
    } else {
        console.log("Could not find error message");
    }
}

fs.writeFileSync('views/app.ejs', txt);
console.log("Patched drive error message!");
