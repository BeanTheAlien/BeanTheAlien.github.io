const fs = require("fs");
const cp = require("child_process");
cp.execSync("npm i @beanthealien/phantomjs");
fs.writeFileSync("phantom2d.ts", fs.readFileSync("node_modules/@beanthealien/phantomjs/phantom2d.ts"));
cp.execSync("tsc");