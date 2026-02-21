const fs = require("fs");
const path = require("path");

const [,, name] = process.argv;
const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Epic Website</title>
    <link rel="icon" type="image" href="https://google.com"/>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width"/>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <script src="../pagedefault.js"></script>
    <h1 class="title" id="title">${name.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(" ")}</h1>
    <script src="index.js" type="module"></script>
  </body>
</html>`;
const dir = path.join(__dirname, name);
fs.mkdirSync(dir);
var html = template;
var js = "";
if(fs.existsSync(`${name}.html`)) {
  html = fs.readFileSync(`${name}.html`, "utf8");
  js = fs.readFileSync(`${name}.js`, "utf8");
}
fs.writeFileSync(path.join(dir, "index.html"), html);
fs.writeFileSync(path.join(dir, "index.js"), js);