const fs = require("fs");
const path = require("path");

const ghostmodule = {
    name: "io",
    desc: "The I/O module for GhostScript.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "io"
};

function writeFile(filepath, content) {
    fs.writeFile(path.join(__dirname, filepath), content);
}

function readFile(filepath) {
    return fs.readFile(path.join(__dirname, filepath));
}

function appendFile(filepath, content) {
    fs.appendFile(path.join(__dirname, filepath), content);
}

function pathExists(filepath) {
    return fs.existsSync(path.join(__dirname, filepath));
}

function makeDir(dir) {
    fs.mkdir(path.join(__dirname, dir), { recursive: true }, (err) => {
        if(err) throw err;
    });
}

function readDir(dir) {
    return fs.readdir(path.join(__dirname, dir));
}

module.exports = {
    writeFile,
    readFile,
    appendFile,
    pathExists,
    makeDir,
    readDir,
    ghostmodule
};
