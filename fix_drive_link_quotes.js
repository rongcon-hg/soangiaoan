const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(/target="_blank" style="color:#16469d;font-weight:bold;text-decoration:underline;"/g, "target='_blank' style='color:#16469d;font-weight:bold;text-decoration:underline;'");
txt = txt.replace(/<a href="\$\{course.driveLink\}"/g, "<a href='${course.driveLink}'");

fs.writeFileSync('views/app.ejs', txt);
console.log("Fixed raw double quotes in driveLink!");
