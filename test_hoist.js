const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <input type="file" id="file" onchange="test(this.value)">
  <script>
    function test(v) { console.log("Called with", v); }
    throw new Error("Top level error");
  </script>
</body>
</html>
`, { runScripts: "dangerously" });
const input = dom.window.document.getElementById("file");
input.value = "test.txt";
dom.window.document.body.dispatchEvent(new dom.window.Event("change", { bubbles: true })); // wait, input triggers change on itself
input.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
