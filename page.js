const fs = require("fs");
const path = require("path");

const [,, name, startPath = ""] = process.argv;
const cn = name.replace(/\s/g, "")
const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Epic Website</title>
    <link rel="icon" type="image/png" href="../alien.png"/>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width"/>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <script src="../pagedefault.js" type="module"></script>
    <h1 class="title" id="title">${name.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(" ")}</h1>
    <script src="index.js" type="module"></script>
  </body>
</html>`;
const dir = path.join(__dirname, startPath, cn);
fs.mkdirSync(dir);
var html = template;
var js = "";
if(fs.existsSync(`${cn}.html`)) {
    html = fs.readFileSync(`${cn}.html`, "utf8");
    js = fs.readFileSync(`${cn}.js`, "utf8");
}
fs.writeFileSync(path.join(dir, "index.html"), html);
fs.writeFileSync(path.join(dir, "index.js"), js);