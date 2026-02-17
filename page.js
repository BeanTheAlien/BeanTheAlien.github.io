const fs = require("fs");
const path = require("path");

const [,, name, pagename] = process.argv;
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
    <h1 class="title" id="title">${pagename}</h1>
    <script src="index.js" type="module"></script>
  </body>
</html>`;
const dir = path.join(__dirname, name);
fs.mkdirSync(dir);
fs.writeFileSync(path.join(dir, "index.html"), template);
fs.writeFileSync(path.join(dir, "index.js"), "");