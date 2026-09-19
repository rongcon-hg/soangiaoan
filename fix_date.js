const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// Replace the hardcoded date with EJS logic for today's date in VN time
const replacement = `value="<%= (function(){
      const d = new Date();
      d.setHours(d.getHours() + 7);
      return d.toISOString().split('T')[0];
    })() %>"`;

content = content.replace('value="2026-07-07"', replacement);

fs.writeFileSync('views/app.ejs', content);
console.log("Updated default start date to dynamic EJS");
