const fs = require('fs');
['views/projects.ejs', 'views/users.ejs', 'views/app.ejs'].forEach(f => {
    if(!fs.existsSync(f)) return;
    let txt = fs.readFileSync(f, 'utf8');
    // If not already wrapped
    if(!txt.includes('<div class="table-responsive">')) {
        txt = txt.replace(/<table/g, '<div class="table-responsive"><table');
        txt = txt.replace(/<\/table>/g, '</table></div>');
    }
    txt = txt.replace(/Sổ Giáo Án/g, 'Giáo án điện tử');
    txt = txt.replace(/Sổ giáo án/g, 'Giáo án điện tử');
    fs.writeFileSync(f, txt);
});
console.log('Done');
