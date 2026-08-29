const fs = require('fs');
let txt = fs.readFileSync('views/app.ejs', 'utf8');

const targetStr = `   updateCourseCards();
   renderConversionPreview();
   updateWeeklyCheck();
 }catch(e){`;

const newStr = `   updateCourseCards();
   renderConversionPreview();
   updateWeeklyCheck();
   if(typeof saveStateToBackend === 'function') saveStateToBackend();
 }catch(e){`;

if(txt.includes(targetStr)) {
    txt = txt.replace(targetStr, newStr);
    fs.writeFileSync('views/app.ejs', txt);
    console.log("Added saveStateToBackend to readProgramFile!");
} else {
    console.log("Could not find the target string.");
}
