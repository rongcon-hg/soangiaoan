const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

txt = txt.replace(
    'name: currentProject.name,',
    'name: e.data.payload?.courseInfo?.name || currentProject.name,'
);
txt = txt.replace(
    'course_code: currentProject.course_code,',
    'course_code: e.data.payload?.courseInfo?.code || currentProject.course_code,'
);
txt = txt.replace(
    'total_hours: currentProject.total_hours,',
    'total_hours: e.data.payload?.courseInfo?.total || currentProject.total_hours,'
);

fs.writeFileSync('views/app.ejs', txt);
console.log('Fixed PUT project data');
