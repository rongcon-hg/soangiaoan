const fs = require('fs');
let content = fs.readFileSync('views/app.ejs', 'utf-8');

// The previous script replaced 'value="2026-07-07"' but let's just make sure it's correct.
// We will search for the snippet and replace it with a bulletproof timezone calculation.
const target = `value="<%= (function(){
      const d = new Date();
      d.setHours(d.getHours() + 7);
      return d.toISOString().split('T')[0];
    })() %>"`;

const robustReplacement = `value="<%= new Date(Date.now() + 7 * 3600 * 1000).toISOString().split('T')[0] %>"`;

content = content.replace(target, robustReplacement);

fs.writeFileSync('views/app.ejs', content);
console.log("Updated default start date to robust EJS");
