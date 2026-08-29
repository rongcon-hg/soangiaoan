const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const oldStr = `for(const t of tables){
   const txt=t.textContent||&quot;&quot;;
   if(/Tên chương|Tên các bài|Tên bài/i.test(txt) &amp;&amp; /Lý thuyết/i.test(txt) &amp;&amp; /Thực hành/i.test(txt)){
     table=t; break;
   }
 }`;

const newStr = `let maxRows = 0;
 let biggestTable = null;
 for(const t of tables){
   const txt=t.textContent||&quot;&quot;;
   const rowCount = t.querySelectorAll(&quot;tr&quot;).length;
   if(rowCount &gt; maxRows) { maxRows = rowCount; biggestTable = t; }

   if(/Tên chương|Tên các bài|Tên bài|Nội dung/i.test(txt) &amp;&amp; (/Lý thuyết|LT|Số tiết|Thời gian/i.test(txt))){
     table=t; break;
   }
 }
 if(!table &amp;&amp; biggestTable &amp;&amp; maxRows &gt;= 2) table = biggestTable;`;

txt = txt.replace(oldStr, newStr);

fs.writeFileSync('views/app.ejs', txt);
console.log('Patched parseProgramTable with HTML Escaped', txt.indexOf('biggestTable'));
