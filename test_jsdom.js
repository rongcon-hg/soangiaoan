const fs = require('fs');
const { JSDOM } = require('jsdom');
const content = fs.readFileSync('views/app.ejs', 'utf8');

const dom = new JSDOM(content, { runScripts: "dangerously" });
const window = dom.window;

window.addEventListener('error', (event) => {
    console.error("JSDOM Error:", event.error);
});

setTimeout(() => {
    console.log("Checking if buildSchedule exists:", typeof window.buildSchedule);
    try {
        window.buildSchedule();
        console.log("buildSchedule executed successfully");
    } catch (e) {
        console.error("Error in buildSchedule:", e);
    }
    process.exit(0);
}, 1000);
